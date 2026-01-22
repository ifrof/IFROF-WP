import { Request, Response } from 'express';
import { getRedisClient } from '../utils/cache';
import { getPerformanceStats, QueryMonitor } from './performance-monitor';

/**
 * Health check endpoint
 * Returns system status and performance metrics
 */
export function healthCheck(req: Request, res: Response) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  };

  res.status(200).json(health);
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
