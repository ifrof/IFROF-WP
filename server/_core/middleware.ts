import type { NextFunction, Request, Response } from "express";
import DOMPurify from "isomorphic-dompurify";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const isDevelopment = process.env.NODE_ENV === "development";
const apiOrigin = process.env.API_ORIGIN || "https://api.ifrof.com";

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        sanitizeValue(val),
      ])
    );
  }

  return value;
};

const isBinaryBody = (body: unknown): boolean => {
  if (!body) {
    return false;
  }

  if (typeof Buffer !== "undefined" && Buffer.isBuffer(body)) {
    return true;
  }

  if (body instanceof Uint8Array) {
    return true;
  }

  return false;
};

export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.is("multipart/form-data") || isBinaryBody(req.body)) {
    return next();
  }

  if (req.body && typeof req.body === "string") {
    req.body = sanitizeValue(req.body);
  } else if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query) as Request["query"];
  }

  next();
};

const contentSecurityPolicy = isDevelopment
  ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          "http://localhost:*",
          "http://127.0.0.1:*",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "http://localhost:*",
          "http://127.0.0.1:*",
        ],
        connectSrc: [
          "'self'",
          apiOrigin,
          "http://localhost:*",
          "ws://localhost:*",
          "http://127.0.0.1:*",
          "ws://127.0.0.1:*",
        ],
      },
    }
  : {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", apiOrigin],
      },
    };

export const securityHeaders = helmet({
  contentSecurityPolicy,
  hsts: isDevelopment
    ? false
    : {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
});

const rateLimitMessage =
  "تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    const retryAfter = req.rateLimit?.resetTime
      ? Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
      : undefined;
    res.status(options.statusCode).json({
      error: options.message || rateLimitMessage,
      retryAfter,
    });
  },
});
