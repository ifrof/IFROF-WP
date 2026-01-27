import { Request, Response, NextFunction } from "express";

const cache = new Map<string, { data: any; expiry: number }>();

/**
 * Simple In-Memory Cache Middleware for Public Pages
 */
export const cacheMiddleware = (durationSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      return res.send(cached.data);
    }

    const originalSend = res.send;
    res.send = function (body) {
      cache.set(key, {
        data: body,
        expiry: Date.now() + durationSeconds * 1000,
      });
      return originalSend.apply(res, [body]);
    };

    next();
  };
};
