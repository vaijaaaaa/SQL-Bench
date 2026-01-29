/**
 * Performance monitoring and metrics collection
 */

import { logger } from './logger';
import { env } from './env';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;

  /**
   * Track operation duration
   */
  async track<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      this.recordMetric({
        name,
        duration,
        timestamp: new Date(),
        metadata: { ...metadata, success: true },
      });
      
      // Log slow operations
      if (duration > 1000) {
        logger.warn(`Slow operation detected: ${name}`, {
          duration: `${duration}ms`,
          ...metadata,
        });
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.recordMetric({
        name,
        duration,
        timestamp: new Date(),
        metadata: { ...metadata, success: false, error: (error as Error).message },
      });
      
      throw error;
    }
  }

  /**
   * Record a metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    if (env.isDevelopment) {
      this.metrics.push(metric);
      
      // Keep only recent metrics
      if (this.metrics.length > this.maxMetrics) {
        this.metrics = this.metrics.slice(-this.maxMetrics);
      }
    }
  }

  /**
   * Get performance statistics
   */
  getStats(operationName?: string): {
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    p95Duration: number;
  } {
    const filtered = operationName
      ? this.metrics.filter((m) => m.name === operationName)
      : this.metrics;

    if (filtered.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p95Duration: 0,
      };
    }

    const durations = filtered.map((m) => m.duration).sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);
    const p95Index = Math.floor(durations.length * 0.95);

    return {
      count: filtered.length,
      avgDuration: sum / filtered.length,
      minDuration: durations[0],
      maxDuration: durations[durations.length - 1],
      p95Duration: durations[p95Index] || 0,
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Get recent metrics
   */
  getRecent(limit: number = 10): PerformanceMetric[] {
    return this.metrics.slice(-limit);
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Middleware wrapper for API routes to track performance
 */
export function withPerformanceTracking(
  handler: (req: Request) => Promise<Response>,
  name: string
) {
  return async (req: Request): Promise<Response> => {
    return performanceMonitor.track(
      name,
      async () => handler(req),
      {
        method: req.method,
        url: req.url,
      }
    );
  };
}
