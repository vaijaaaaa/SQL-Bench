/**
 * Middleware helpers for API routes
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { logger } from './logger';
import type { ApiError } from '@/types/api';

/**
 * Wrapper for API routes with error handling
 */
export function withErrorHandling(
  handler: (req: Request) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error: any) {
      logger.error('API route error', error, {
        method: req.method,
        url: req.url,
      });

      const apiError: ApiError = {
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
        statusCode: 500,
      };

      return NextResponse.json(apiError, { status: 500 });
    }
  };
}

/**
 * Check if user is authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    session,
  };
}

/**
 * CORS headers for API routes
 */
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

/**
 * Handle OPTIONS requests for CORS
 */
export function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}
