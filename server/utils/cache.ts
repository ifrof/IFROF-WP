import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!redis && process.env.REDIS_URL) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: times => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        enableReadyCheck: true,
        lazyConnect: true,
      });

      redis.on("error", err => {
        console.error("Redis connection error:", err);
      });

      redis.on("connect", () => {
        console.log("Redis connected successfully");
      });

      // Connect asynchronously
      redis.connect().catch(err => {
        console.error("Failed to connect to Redis:", err);
        redis = null;
      });
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
      redis = null;
    }
  }
  return redis;
}

export async function getCached<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = 300 // 5 minutes default
): Promise<T> {
  const client = getRedisClient();

  if (!client) {
    return fallback();
  }

  try {
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
  }

  const result = await fallback();

  try {
    await client.setex(key, ttl, JSON.stringify(result));
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
  }

  return result;
}

export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    return;
  }

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error(`Cache invalidation error for pattern ${pattern}:`, error);
  }
}

export async function setCached(
  key: string,
  value: any,
  ttl: number = 300
): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    return;
  }

  try {
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
  }
}
