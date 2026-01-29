/**
 * Redis client configuration with proper error handling
 */

import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// Configure Redis client with fallback
const createRedisClient = (): Redis | null => {
  // Check if Redis is configured
  const redisUrl = env.UPSTASH_REDIS_REST_URL || env.REDIS_URL;
  
  if (!redisUrl || redisUrl === 'redis://localhost:6379') {
    logger.warn('Redis not configured - rate limiting will be disabled in development');
    if (env.isProduction) {
      throw new Error('Redis must be configured in production');
    }
    return null;
  }

  try {
    // Parse Redis URL
    const isUpstash = redisUrl.includes('upstash.io');
    const host = redisUrl.replace('https://', '').replace('http://', '').split(':')[0];

    const config: any = {
      host,
      port: 6379,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };

    // Add authentication for Upstash
    if (isUpstash && env.UPSTASH_REDIS_REST_TOKEN) {
      config.password = env.UPSTASH_REDIS_REST_TOKEN;
      config.tls = {
        rejectUnauthorized: false,
      };
    }

    const redis = new Redis(config);

    // Handle connection events
    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redis.on('error', (error) => {
      logger.error('Redis connection error', error);
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

    return redis;
  } catch (error) {
    logger.error('Failed to create Redis client', error);
    if (env.isProduction) {
      throw error;
    }
    return null;
  }
};

export const redis = createRedisClient();

/**
 * Gracefully close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection', error);
    }
  }
}
