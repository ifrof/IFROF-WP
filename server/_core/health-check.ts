import { Request, Response } from 'express';
import { getRedisClient } from '../utils/cache';
import { getPerformanceStats, QueryMonitor } from './performance-monitor';

/**
 * Health check endpoint
 * Returns system status and performance metrics
 * This endpoint is used by Railway and Docker for deployment healthchecks
 */
export function healthCheck(req: Request, res: Response) {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      environment: process.env.NODE_ENV || 'development',
    };

    // Set cache headers to prevent caching of health checks
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Metrics endpoint for monitoring
 */
export function metricsEndpoint(req: Request, res: Response) {
  try {
    const metrics = {
      performance: getPerformanceStats(),
      database: QueryMonitor.getStats(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    res.json(metrics);
  } catch (error) {
    console.error('Metrics endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve metrics',
      timestamp: new Date().toISOString(),
    });
  }
}
