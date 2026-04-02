import { Pool, PoolClient } from "pg";
import { logger } from "./logger";
import { env } from "./env";

const globalForPgPool = globalThis as unknown as {
    sqlExecutorPool: Pool | undefined;
};

interface ExecutionResult {
    success: boolean;
    rows?: any[];
    error?: string;
    executionTime: number;
}

// In serverless environments, conservative pool sizes avoid exhausting
// session-mode poolers (e.g., MaxClientsInSessionMode errors).
const poolMax = Number.parseInt(process.env.DB_POOL_MAX || (env.isProduction ? "1" : "5"), 10);
const poolIdleTimeoutMs = Number.parseInt(process.env.DB_POOL_IDLE_TIMEOUT_MS || "10000", 10);
const poolConnectionTimeoutMs = Number.parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT_MS || "10000", 10);
const sqlExecutorConnectionString = process.env.SQL_EXECUTOR_DATABASE_URL || env.DATABASE_URL;

const pool =
    globalForPgPool.sqlExecutorPool ??
    new Pool({
        connectionString: sqlExecutorConnectionString,
        max: Number.isNaN(poolMax) ? 1 : poolMax,
        idleTimeoutMillis: Number.isNaN(poolIdleTimeoutMs) ? 10000 : poolIdleTimeoutMs,
        connectionTimeoutMillis: Number.isNaN(poolConnectionTimeoutMs) ? 10000 : poolConnectionTimeoutMs,
        allowExitOnIdle: true,
    });

if (!globalForPgPool.sqlExecutorPool) {
    globalForPgPool.sqlExecutorPool = pool;
}

// SQL Injection prevention - more comprehensive keyword list
const DANGEROUS_KEYWORDS = [
    'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 
    'CREATE', 'TRUNCATE', 'GRANT', 'REVOKE', 'COMMIT',
    'ROLLBACK', 'SAVEPOINT', 'SET', 'LOCK', 'COPY'
] as const;

/**
 * Validates SQL query for dangerous operations
 */
function validateQuery(query: string, allowWrites: boolean = false): { valid: boolean; error?: string } {
    const upperQuery = query.toUpperCase().trim();
    
    // Check for dangerous keywords
    if (!allowWrites) {
        for (const keyword of DANGEROUS_KEYWORDS) {
            // Use word boundaries to avoid false positives
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(upperQuery)) {
                return {
                    valid: false,
                    error: `Forbidden keyword detected: ${keyword}. Only SELECT queries are allowed.`
                };
            }
        }
    }
    
    // Check for comment-based SQL injection attempts
    if (query.includes('--') || query.includes('/*') || query.includes('*/')) {
        logger.warn('SQL query contains comments', { query: query.substring(0, 50) });
    }
    
    // Basic validation - must start with SELECT
    if (!upperQuery.startsWith('SELECT') && !upperQuery.startsWith('WITH')) {
        return {
            valid: false,
            error: 'Query must start with SELECT or WITH (for CTEs)'
        };
    }
    
    return { valid: true };
}

export async function executeSQLQuery(
    query: string,
    schema: string,
    sampleData: string,
    timeoutMs: number = 5000
): Promise<ExecutionResult> {
    const startTime = Date.now();
    let client: PoolClient | null = null;
    let tempSchema: string | null = null;

    try {
        // Validate query before execution
        const validation = validateQuery(query);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
                executionTime: Date.now() - startTime,
            };
        }

        // Get client from pool
        client = await pool.connect();

        // Set query timeout
        await client.query(`SET statement_timeout = ${timeoutMs}`);

        // Generate unique schema name with better randomness
        tempSchema = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

        logger.debug('Creating temporary schema', { tempSchema });

        // Create isolated schema for query execution
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${tempSchema}`);
        await client.query(`SET search_path TO ${tempSchema}`);

        // Set up schema
        await client.query(schema);

        // Insert sample data if provided
        if (sampleData && sampleData.trim()) {
            await client.query(sampleData);
        }

        logger.sql('Executing user query', query);

        // Execute user query with timeout
        const result = await client.query(query);

        const executionTime = Date.now() - startTime;

        logger.debug('Query executed successfully', {
            executionTime: `${executionTime}ms`,
            rowCount: result.rows.length,
        });

        // Format date columns to YYYY-MM-DD
        const formattedRows = result.rows.map((row) => {
            const newRow = { ...row };
            Object.keys(newRow).forEach((key) => {
                if (newRow[key] instanceof Date) {
                    newRow[key] = newRow[key].toISOString().split('T')[0];
                }
            });
            return newRow;
        });

        // Cleanup schema
        if (tempSchema && client) {
            try {
                await client.query(`DROP SCHEMA IF EXISTS ${tempSchema} CASCADE`);
            } catch (cleanupError) {
                logger.error('Failed to cleanup schema', cleanupError, { tempSchema });
            }
        }

        return {
            success: true,
            rows: formattedRows,
            executionTime,
        };
    } catch (error: any) {
        const executionTime = Date.now() - startTime;

        logger.error('Query execution failed', error, {
            executionTime: `${executionTime}ms`,
            queryPreview: query.substring(0, 100),
        });

        // Cleanup on error
        if (tempSchema && client) {
            try {
                await client.query(`DROP SCHEMA IF EXISTS ${tempSchema} CASCADE`);
            } catch (cleanupError) {
                logger.error('Failed to cleanup schema after error', cleanupError, { tempSchema });
            }
        }

        return {
            success: false,
            error: error.message || 'Query execution failed',
            executionTime,
        };
    } finally {
        // Release client back to pool
        if (client) {
            try {
                client.release();
            } catch (releaseError) {
                logger.error('Failed to release client', releaseError);
            }
        }
    }
}

/**
 * Gracefully shutdown the connection pool
 */
export async function closeDatabasePool(): Promise<void> {
    try {
        await pool.end();
        logger.info('Database pool closed successfully');
    } catch (error) {
        logger.error('Error closing database pool', error);
    }
}