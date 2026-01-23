import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

/**
 * Rate limiter middleware
 * @param options Rate limit configuration
 */
export function rateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = "Too many requests" } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();

    // Initialize or reset if window expired
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    // Increment request count
    store[key].count++;

    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.set("Retry-After", retryAfter.toString());
      return res.status(429).json({
        status: "error",
        message,
        retryAfter,
      });
    }

    // Add rate limit headers
    res.set({
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": (maxRequests - store[key].count).toString(),
      "X-RateLimit-Reset": new Date(store[key].resetTime).toISOString(),
    });

    next();
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Cleanup every minute

// Predefined rate limiters
export const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: "Too many API requests, please try again later",
});

export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: "Too many authentication attempts, please try again later",
});

export const strictLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: "Rate limit exceeded, please slow down",
});
