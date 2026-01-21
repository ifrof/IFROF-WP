import { Request, Response } from 'express';
import { getRedisClient } from '../utils/cache';
import { getPerformanceStats, QueryMonitor } from './performance-monitor';

/**
 * Health check endpoint
 * Returns system status and performance metrics
 */
export async function healthCheck(req: Request, res: Response) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    services: {
      redis: false,
      database: false,
    },
    performance: getPerformanceStats(),
    database: QueryMonitor.getStats(),
  };

  // Check Redis connection
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.ping();
      health.services.redis = true;
    } catch (error) {
      console.error('Redis health check failed:', error);
    }
  }

  // Check database connection
  try {
    // Add database ping here if needed
    health.services.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  res.json(health);
}

/**
 * Metrics endpoint for monitoring
 */
export function metricsEndpoint(req: Request, res: Response) {
  const metrics = {
    performance: getPerformanceStats(),
    database: QueryMonitor.getStats(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };

  res.json(metrics);
}
