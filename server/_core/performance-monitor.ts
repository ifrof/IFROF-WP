import { Request, Response, NextFunction } from "express";

interface PerformanceMetrics {
  timestamp: string;
  method: string;
  path: string;
  duration: number;
  statusCode: number;
  userAgent?: string;
}

const slowQueryThreshold = 100; // ms
const performanceLog: PerformanceMetrics[] = [];
const maxLogSize = 1000;

/**
 * Middleware to monitor request performance
 */
export function performanceMonitor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  // Capture response finish event
  res.on("finish", () => {
    const duration = Date.now() - startTime;

    const metrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      duration,
      statusCode: res.statusCode,
      userAgent: req.headers["user-agent"],
    };

    // Log slow requests
    if (duration > slowQueryThreshold) {
      console.warn(`[SLOW REQUEST] ${req.method} ${req.path} - ${duration}ms`);
    }

    // Store metrics (keep only last 1000)
    performanceLog.push(metrics);
    if (performanceLog.length > maxLogSize) {
      performanceLog.shift();
    }
  });

  next();
}

/**
 * Get performance statistics
 */
export function getPerformanceStats() {
  if (performanceLog.length === 0) {
    return {
      totalRequests: 0,
      averageDuration: 0,
      slowRequests: 0,
      errorRate: 0,
    };
  }

  const totalRequests = performanceLog.length;
  const totalDuration = performanceLog.reduce((sum, m) => sum + m.duration, 0);
  const averageDuration = totalDuration / totalRequests;
  const slowRequests = performanceLog.filter(
    m => m.duration > slowQueryThreshold
  ).length;
  const errorRequests = performanceLog.filter(m => m.statusCode >= 400).length;
  const errorRate = (errorRequests / totalRequests) * 100;

  return {
    totalRequests,
    averageDuration: Math.round(averageDuration),
    slowRequests,
    slowRequestRate: Math.round((slowRequests / totalRequests) * 100),
    errorRate: Math.round(errorRate * 100) / 100,
    recentRequests: performanceLog.slice(-10),
  };
}

/**
 * Error tracking middleware
 */
export function errorTracker(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    userAgent: req.headers["user-agent"],
  };

  console.error("[ERROR]", JSON.stringify(errorDetails, null, 2));

  // In production, you would send this to a service like Sentry
  if (process.env.SENTRY_DSN) {
    // Sentry.captureException(err);
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
}

/**
 * Database query performance monitor
 */
export class QueryMonitor {
  private static queries: Array<{
    query: string;
    duration: number;
    timestamp: string;
  }> = [];

  static logQuery(query: string, duration: number) {
    if (duration > slowQueryThreshold) {
      console.warn(
        `[SLOW QUERY] ${duration}ms - ${query.substring(0, 100)}...`
      );
    }

    this.queries.push({
      query: query.substring(0, 200),
      duration,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 queries
    if (this.queries.length > 100) {
      this.queries.shift();
    }
  }

  static getStats() {
    if (this.queries.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
      };
    }

    const totalQueries = this.queries.length;
    const totalDuration = this.queries.reduce((sum, q) => sum + q.duration, 0);
    const averageDuration = totalDuration / totalQueries;
    const slowQueries = this.queries.filter(
      q => q.duration > slowQueryThreshold
    ).length;

    return {
      totalQueries,
      averageDuration: Math.round(averageDuration),
      slowQueries,
      slowQueryRate: Math.round((slowQueries / totalQueries) * 100),
      recentQueries: this.queries.slice(-10),
    };
  }
}
