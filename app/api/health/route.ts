/**
 * Health check endpoint for monitoring
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { logger } from '@/lib/logger';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database = 'healthy';
  } catch (error) {
    logger.error('Database health check failed', error);
    checks.checks.database = 'unhealthy';
    checks.status = 'degraded';
  }

  // Check Redis connection (optional)
  if (redis) {
    try {
      await redis.ping();
      checks.checks.redis = 'healthy';
    } catch (error) {
      logger.error('Redis health check failed', error);
      checks.checks.redis = 'unhealthy';
    }
  } else {
    checks.checks.redis = 'not_configured';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
