import type { NextFunction, Request, Response } from "express";

/**
 * Stricter rate limiting for authentication endpoints
 * 5 attempts per minute per IP address
 */

type AuthRateLimitEntry = {
  count: number;
  resetTime: number;
};

const authRateLimitStore = new Map<string, AuthRateLimitEntry>();
const AUTH_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const AUTH_RATE_LIMIT_MAX = 5; // 5 attempts per minute

const getClientId = (req: Request): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
};

const getAuthRateLimitEntry = (clientId: string, now: number): AuthRateLimitEntry => {
  const existing = authRateLimitStore.get(clientId);
  if (!existing || existing.resetTime <= now) {
    const entry = { count: 0, resetTime: now + AUTH_RATE_LIMIT_WINDOW_MS };
    authRateLimitStore.set(clientId, entry);
    return entry;
  }
  return existing;
};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [clientId, entry] of Array.from(authRateLimitStore.entries())) {
    if (entry.resetTime <= now) {
      authRateLimitStore.delete(clientId);
    }
  }
}, 5 * 60 * 1000);

export const authRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  const clientId = getClientId(req);
  const entry = getAuthRateLimitEntry(clientId, now);

  entry.count += 1;

  if (entry.count > AUTH_RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.resetTime - now) / 1000)
    );

    res.setHeader("Retry-After", retryAfterSeconds.toString());
    res.status(429).json({
      error: "Too many authentication attempts. Please try again later.",
      retryAfter: retryAfterSeconds,
    });
    return;
  }

  res.setHeader("X-RateLimit-Limit", AUTH_RATE_LIMIT_MAX.toString());
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(AUTH_RATE_LIMIT_MAX - entry.count, 0).toString()
  );
  res.setHeader(
    "X-RateLimit-Reset",
    Math.ceil(entry.resetTime / 1000).toString()
  );

  next();
};
