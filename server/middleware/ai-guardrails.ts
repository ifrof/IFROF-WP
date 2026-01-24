import { Request, Response, NextFunction } from "express";
import { TRPCError } from "@trpc/server";
import { getRedisClient } from "../utils/cache";
import { getDb } from "../db"; // Assuming getDb is available
import { eq } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

// --- Rate Limiting (Redis-first with in-memory fallback) ---
const AI_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const AI_RATE_LIMIT_MAX_USER = 10; // 10 req/min per user
const AI_RATE_LIMIT_MAX_IP = 30; // 30 req/min per IP

const inMemoryStore: { [key: string]: { count: number, resetTime: number } } = {};

async function checkRateLimit(key: string, maxRequests: number, windowMs: number): Promise<{ allowed: boolean, retryAfter: number }> {
  const redis = getRedisClient();
  const now = Date.now();
  const resetTime = now + windowMs;

  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.pexpire(key, windowMs);
    }
    const ttl = await redis.pttl(key);
    const retryAfter = Math.ceil(ttl / 1000);

    if (count > maxRequests) {
      return { allowed: false, retryAfter };
    }
    return { allowed: true, retryAfter: 0 };
  } else {
    // In-memory fallback
    if (process.env.NODE_ENV === 'production') {
      console.warn("WARNING: Redis not available. Using insecure in-memory rate limiting.");
    }
    if (!inMemoryStore[key] || inMemoryStore[key].resetTime < now) {
      inMemoryStore[key] = { count: 0, resetTime };
    }
    inMemoryStore[key].count++;
    const retryAfter = Math.ceil((inMemoryStore[key].resetTime - now) / 1000);

    if (inMemoryStore[key].count > maxRequests) {
      return { allowed: false, retryAfter };
    }
    return { allowed: true, retryAfter: 0 };
  }
}

export const aiRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  const ip = req.ip || "unknown";

  // 1. User Rate Limit
  if (userId) {
    const userKey = `ai:limit:user:${userId}`;
    const { allowed, retryAfter } = await checkRateLimit(userKey, AI_RATE_LIMIT_MAX_USER, AI_RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      res.set("Retry-After", retryAfter.toString());
      return res.status(429).json({ status: "error", message: "User rate limit exceeded (10/min).", retryAfter, code: "RATE_LIMIT_USER" });
    }
  }

  // 2. IP Rate Limit (Fallback for unauthenticated users)
  const ipKey = `ai:limit:ip:${ip}`;
  const { allowed, retryAfter } = await checkRateLimit(ipKey, AI_RATE_LIMIT_MAX_IP, AI_RATE_LIMIT_WINDOW_MS);
  if (!allowed) {
    res.set("Retry-After", retryAfter.toString());
    return res.status(429).json({ status: "error", message: "IP rate limit exceeded (30/min).", retryAfter, code: "RATE_LIMIT_IP" });
  }

  next();
};

// --- Daily Cap (Cost Guardrail) ---
const DAILY_CAP_USD = 5.0;
const COST_PER_1K_TOKENS = 0.0005; // Assuming gpt-4o-mini cost

export const aiDailyCap = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  if (!userId) return next(); // Cap only applies to authenticated users

  const redis = getRedisClient();
  if (!redis) return next(); // Skip cap if Redis is unavailable

  const today = new Date().toISOString().split('T')[0];
  const key = `ai:cost:${userId}:${today}`;

  const currentCost = parseFloat(await redis.get(key) || '0');

  if (currentCost >= DAILY_CAP_USD) {
    return res.status(402).json({ status: "error", message: `Daily AI usage cap of ${DAILY_CAP_USD} USD reached.`, code: "DAILY_CAP_REACHED" });
  }

  // Inject a function to track cost after LLM call
  (req as any).trackAiCost = async (totalTokens: number) => {
    const cost = (totalTokens / 1000) * COST_PER_1K_TOKENS;
    await redis.incrbyfloat(key, cost);
    // Set expiry to midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ttl = tomorrow.getTime() - Date.now();
    await redis.pexpire(key, ttl);
  };

  next();
};

// --- Authentication/Authorization ---
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).user?.id) {
    return res.status(401).json({ status: "error", message: "Authentication required for this endpoint.", code: "UNAUTHORIZED" });
  }
  next();
};

export const requireOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  const resourceId = req.params.id; // Assuming resource ID is in params

  if (!userId) {
    return res.status(401).json({ status: "error", message: "Authentication required.", code: "UNAUTHORIZED" });
  }

  // Placeholder for actual ownership check (e.g., check DB for resource ownership)
  // For now, we'll assume the resource ID is the user ID for a simple check
  if (resourceId && resourceId !== userId.toString()) {
    return res.status(403).json({ status: "error", message: "Forbidden: You do not own this resource.", code: "FORBIDDEN" });
  }

  next();
};
