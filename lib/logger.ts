/**
 * Centralized logging utility with environment-aware output
 * Prevents console spam in production and provides structured logging
 */

import { env } from './env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = env.isDevelopment;

  /**
   * Log info message - only in development
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, context || '');
    }
  }

  /**
   * Log warning - always logged
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');
  }

  /**
   * Log error - always logged
   */
  error(message: string, error?: Error | any, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, {
      error: error?.message || error,
      stack: error?.stack,
      ...context,
    });
  }

  /**
   * Debug log - only in development
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log SQL query execution - for debugging
   */
  sql(operation: string, query: string, duration?: number): void {
    if (this.isDevelopment) {
      const truncatedQuery = query.length > 100 ? query.substring(0, 100) + '...' : query;
      console.log(`[SQL] ${operation}`, {
        query: truncatedQuery,
        duration: duration ? `${duration}ms` : undefined,
      });
    }
  }

  /**
   * Log API request
   */
  api(method: string, path: string, statusCode: number, duration?: number): void {
    const level = statusCode >= 400 ? 'error' : 'info';
    if (this.isDevelopment || level === 'error') {
      console.log(`[API] ${method} ${path} - ${statusCode}`, {
        duration: duration ? `${duration}ms` : undefined,
      });
    }
  }
}

export const logger = new Logger();
