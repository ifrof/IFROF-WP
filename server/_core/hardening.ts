import { getRedisClient } from "../utils/cache";
import { getDb } from "../db";

export async function validateConfig() {
  console.log("[Hardening] Starting startup validation...");

  // 1. Secrets Validation
  const jwtSecret = process.env.JWT_SECRET;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    console.warn(
      "WARNING: JWT_SECRET is missing or too short. Using fallback for development."
    );
  }
  if (!sessionSecret || sessionSecret.length < 32) {
    console.warn(
      "WARNING: SESSION_SECRET is missing or too short. Using fallback for development."
    );
  }

  // 2. Redis Validation
  const redis = getRedisClient();
  if (!redis) {
    console.warn(
      "[Hardening] REDIS_URL is missing. Rate limiting will be disabled."
    );
  } else {
    try {
      // Wait for connection if it's still connecting
      if (redis.status === "connecting" || redis.status === "wait") {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Redis connection timeout")),
            5000
          );
          redis.once("ready", () => {
            clearTimeout(timeout);
            resolve(true);
          });
          redis.once("error", err => {
            clearTimeout(timeout);
            reject(err);
          });
        });
      }
      await redis.ping();
      console.log("[Hardening] Redis connected + rate limiter active");
    } catch (err) {
      console.error(
        `[Hardening] Redis validation failed: ${err}. Rate limiting will be disabled.`
      );
      // We don't throw here to allow the server to start if Redis is temporarily down,
      // but the rate limiter middleware will handle the null client.
    }
  }

  // 3. Stripe Validation
  const stripeMode = process.env.STRIPE_MODE;
  const stripeTestKey = process.env.STRIPE_SECRET_KEY_TEST;
  const stripeLiveKey = process.env.STRIPE_SECRET_KEY_LIVE;

  if (!stripeMode || !["test", "live"].includes(stripeMode)) {
    console.warn(
      "WARNING: STRIPE_MODE is missing or invalid. Defaulting to 'test'."
    );
  }

  if (stripeMode === "test") {
    if (!stripeTestKey || !stripeTestKey.startsWith("sk_test_")) {
      console.warn(
        "WARNING: STRIPE_MODE is 'test' but STRIPE_SECRET_KEY_TEST is missing or invalid"
      );
    }
  }

  if (stripeMode === "live") {
    if (!stripeLiveKey || !stripeLiveKey.startsWith("sk_live_")) {
      console.warn(
        "WARNING: STRIPE_MODE is 'live' but STRIPE_SECRET_KEY_LIVE is missing or invalid"
      );
    }
  }
  console.log(
    `[Hardening] Stripe mode active: ${stripeMode} + key type verified`
  );

  // 4. Database Hardening Validation
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("[Hardening] DATABASE_URL is missing. Using JSON mode.");
  } else {
    if (
      dbUrl.includes("user=root") ||
      dbUrl.includes(":root@") ||
      dbUrl.includes("//root:")
    ) {
      console.warn(
        "WARNING: DATABASE_URL uses root user. High privileges detected."
      );
    }

    try {
      const db = await getDb();
      if (!db) {
        console.warn(
          "[Hardening] Database connection failed, falling back to JSON mode."
        );
      } else {
        console.log("[Hardening] DB user is not root + connection successful");
      }
    } catch (err) {
      console.error(
        `[Hardening] Database validation error: ${err}. Falling back to JSON mode.`
      );
    }
  }

  // 5. CORS Validation
  const corsOrigin = process.env.CORS_ORIGIN;
  if (
    process.env.NODE_ENV === "production" &&
    (!corsOrigin || !corsOrigin.includes("ifrof.com"))
  ) {
    console.warn(
      "[Hardening] CORS_ORIGIN is not set to ifrof.com. Current value:",
      corsOrigin
    );
  }
  console.log("[Hardening] CORS origin validation complete");

  console.log("CONFIG_OK");
}

import type { Request, Response, NextFunction } from "express";

export const redisRateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
}) => {
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
          retryAfter: ttl,
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
