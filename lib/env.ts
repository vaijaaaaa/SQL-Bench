/**
 * Environment variable validation and type-safe access
 */

// Required environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
} as const;

// Optional environment variables with defaults
const optionalEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || '',
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

/**
 * Validates that all required environment variables are set
 * Throws error if any are missing
 */
export function validateEnv(): void {
  const missingVars: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join('\n')}\n\nPlease check your .env file.`
    );
  }

  // Validate DATABASE_URL format
  if (requiredEnvVars.DATABASE_URL && !requiredEnvVars.DATABASE_URL.startsWith('postgresql://')) {
    console.warn('DATABASE_URL should start with postgresql://');
  }

  // Validate NEXTAUTH_URL format
  if (requiredEnvVars.NEXTAUTH_URL && !requiredEnvVars.NEXTAUTH_URL.startsWith('http')) {
    throw new Error('NEXTAUTH_URL must be a valid URL starting with http:// or https://');
  }
}

/**
 * Type-safe environment variables
 */
export const env = {
  ...requiredEnvVars,
  ...optionalEnvVars,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
} as const;

// Validate on import (only in Node.js environment)
if (typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
    if (env.isProduction) {
      process.exit(1);
    }
  }
}
