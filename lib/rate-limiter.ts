import Redis from "ioredis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
const redisHost = redisUrl.replace("https://","").replace('http://', '');

const redis = new Redis({
  host: redisHost,
  port: 6379,
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
  tls: {
    rejectUnauthorized: false
  }
});


export async function checkRateLimit(
  identifier: string,  
  maxRequests: number, 
  windowSeconds: number 
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  
  const key = `ratelimit:${identifier}`;
  
  try {

    const current = await redis.incr(key);
    

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    

    const ttl = await redis.ttl(key);
    

    const allowed = current <= maxRequests;
    const remaining = Math.max(0, maxRequests - current);
    
    return {
      allowed,
      remaining,
      resetIn: ttl
    };
    
  } catch (error) {
    console.error('Rate limit error:', error);
    return { allowed: true, remaining: maxRequests, resetIn: windowSeconds };
  }
}
