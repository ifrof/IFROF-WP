import { getRedisClient } from "../utils/cache";
import { getDb } from "../db";

export async function validateConfig() {
  console.log("[Hardening] Starting startup validation...");

  // 1. Secrets Validation
  const jwtSecret = process.env.JWT_SECRET;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("FATAL: JWT_SECRET is missing or too short (min 32 chars)");
  }
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("FATAL: SESSION_SECRET is missing or too short (min 32 chars)");
  }

  // 2. Redis Validation
  const redis = getRedisClient();
  if (!redis) {
    throw new Error("FATAL: Redis connection failed or REDIS_URL missing");
  }
  try {
    await redis.ping();
    console.log("[Hardening] Redis connected + rate limiter active");
  } catch (err) {
    throw new Error(`FATAL: Redis ping failed: ${err}`);
  }

  // 3. Stripe Validation
  const stripeMode = process.env.STRIPE_MODE;
  const stripeTestKey = process.env.STRIPE_SECRET_KEY_TEST;
  const stripeLiveKey = process.env.STRIPE_SECRET_KEY_LIVE;

  if (!stripeMode || !['test', 'live'].includes(stripeMode)) {
    throw new Error("FATAL: STRIPE_MODE must be 'test' or 'live'");
  }

  if (stripeMode === 'test') {
    if (!stripeTestKey || !stripeTestKey.startsWith('sk_test_')) {
      throw new Error("FATAL: STRIPE_MODE is 'test' but STRIPE_SECRET_KEY_TEST is missing or invalid");
    }
    if (stripeLiveKey) {
      console.warn("[Hardening] STRIPE_SECRET_KEY_LIVE is present in test mode, ensure it's not mixed up");
    }
  }
  
  if (stripeMode === 'live') {
    if (!stripeLiveKey || !stripeLiveKey.startsWith('sk_live_')) {
      throw new Error("FATAL: STRIPE_MODE is 'live' but STRIPE_SECRET_KEY_LIVE is missing or invalid");
    }
    if (stripeTestKey) {
      console.warn("[Hardening] STRIPE_SECRET_KEY_TEST is present in live mode, ensure it's not mixed up");
    }
  }
  console.log(`[Hardening] Stripe mode active: ${stripeMode} + key type verified`);

  // 4. Database Hardening Validation
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("FATAL: DATABASE_URL is missing");
  }

  if (dbUrl.includes('user=root') || dbUrl.includes(':root@') || dbUrl.includes('//root:')) {
    throw new Error("FATAL: DATABASE_URL uses root user. High privileges detected.");
  }

  try {
    const db = await getDb();
    if (!db) throw new Error("Database connection returned null");
    console.log("[Hardening] DB user is not root + connection successful");
  } catch (err) {
    throw new Error(`FATAL: Database connection failed: ${err}`);
  }

  // 5. CORS Validation
  const corsOrigin = process.env.CORS_ORIGIN;
  if (corsOrigin !== 'https://ifrof.com') {
    throw new Error("FATAL: CORS_ORIGIN must be set to https://ifrof.com");
  }
  console.log("[Hardening] CORS origin مضبوط على https://ifrof.com فقط");

  console.log("CONFIG_OK");
}

import type { Request, Response, NextFunction } from "express";

export const redisRateLimiter = (options: { windowMs: number; maxRequests: number }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const redis = getRedisClient();
    if (!redis) return next();

    const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
    const key = `ratelimit:${ip}:${req.baseUrl}${req.path}`;
    
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, Math.ceil(options.windowMs / 1000));
      }

      if (current > options.maxRequests) {
        const ttl = await redis.ttl(key);
        res.set("Retry-After", ttl.toString());
        return res.status(429).json({
          error: "Too many requests",
          retryAfter: ttl
        });
      }

      res.set({
        "X-RateLimit-Limit": options.maxRequests.toString(),
        "X-RateLimit-Remaining": (options.maxRequests - current).toString(),
      });

      next();
    } catch (err) {
      console.error("[RateLimiter] Redis error:", err);
      next();
    }
  };
};
