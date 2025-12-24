import { error } from "console";
import {Client} from "pg";

interface ExecutionResult {
    success : boolean;
    rows? : any[];
    error? : string;
    executionTime : number;
}

export async function executeSQLQuery (
    query : string,
    schema : string,
    sampleData : string,
    timeoutMs : number = 5000
) : Promise<ExecutionResult> {
    const startTime = Date.now();

    const client = new Client({
        connectionString : process.env.DATEBASE_URL,
        connectionTimeoutMillis : timeoutMs,
        query_timeout : timeoutMs,
    })

    try {
        await client.connect();

        const tempSchema = `temp_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;

        await client.query(`CREATE SCHEMA ${tempSchema}`);
        await client.query(`SET search_path TO ${tempSchema}`);

        await client.query(schema);

        if(sampleData){
            await client.query(sampleData);

            const dangerousKeywords = ['DROP','DELETE','UPDATE','INSERT','ALTER','CREATE','TRUNCATE'];
            const upperQuery = query.toUpperCase();

            for(const keyword of dangerousKeywords){
                if(upperQuery.includes(keyword)){
                    throw new Error(`Forbidden keyword detected: ${keyword}`);
                }
            }
        }


        const result = await client.query(query);

        const executionTime = Date.now() - startTime;

        await client.query(`DROP SCHEMA ${tempSchema} CASCADE`);
        await client.end();

        return {
            success : true,
            rows : result.rows,
            executionTime,
    };




    } catch (error :any) {
        const executionTime = Date.now() - startTime;
        try {
            await client.end();
        } catch (e) {
            
        }
     return {
      success: false,
      error: error.message || 'Query execution failed',
      executionTime,
    };
    }

    
}