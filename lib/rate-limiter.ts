import { redis } from './redis';
import { logger } from './logger';
import { env } from './env';

export async function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  // If Redis is not available (development), allow all requests
  if (!redis) {
    logger.debug('Rate limiting disabled - Redis not available');
    return { allowed: true, remaining: maxRequests, resetIn: windowSeconds };
  }

  const key = `ratelimit:${identifier}`;

  try {
    const current = await redis.incr(key);

    // Set expiration on first request
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);

    const allowed = current <= maxRequests;
    const remaining = Math.max(0, maxRequests - current);

    if (!allowed) {
      logger.warn('Rate limit exceeded', {
        identifier,
        current,
        maxRequests,
        resetIn: ttl,
      });
    }

    return {
      allowed,
      remaining,
      resetIn: ttl > 0 ? ttl : windowSeconds,
    };
  } catch (error) {
    logger.error('Rate limit check failed', error, { identifier });
    // On error, allow the request (fail open)
    return { allowed: true, remaining: maxRequests, resetIn: windowSeconds };
  }
}
