import { Request, Response } from 'express';
import { getRedisClient } from '../utils/cache';
import { getPerformanceStats, QueryMonitor } from './performance-monitor';

/**
 * Health check endpoint
 * Returns system status and performance metrics
 * This endpoint is used by Railway and Docker for deployment healthchecks
 */
export function healthCheck(req: Request, res: Response) {
  // Simple health check that doesn't depend on any external services
  // This ensures Railway can always verify the process is running
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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
