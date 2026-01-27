import type { NextFunction, Request, Response } from "express";

const isDevelopment = process.env.NODE_ENV === "development";
const apiOrigin = process.env.API_ORIGIN || "https://api.ifrof.com";

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, match => htmlEscapes[match]);

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return escapeHtml(value);
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
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
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
        defaultSrc: ["*"],
        styleSrc: ["* ", "'unsafe-inline'"],
        fontSrc: ["* ", "data:"],
        imgSrc: ["* ", "data:", "blob:"],
        scriptSrc: ["* ", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["*"],
        frameSrc: ["*"],
      },
    };

const toCspDirective = (directive: string): string =>
  directive.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

const buildCspHeader = (directives: Record<string, string[]>): string =>
  Object.entries(directives)
    .map(([key, values]) => `${toCspDirective(key)} ${values.join(" ")}`)
    .join("; ");

const securityHeadersList: Array<[string, string]> = [
  ["X-Frame-Options", "SAMEORIGIN"],
  ["X-Content-Type-Options", "nosniff"],
  ["Referrer-Policy", "no-referrer"],
  ["X-DNS-Prefetch-Control", "off"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
];

export const securityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const directives = contentSecurityPolicy.directives;
  res.setHeader("Content-Security-Policy", buildCspHeader(directives));

  if (!isDevelopment) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  securityHeadersList.forEach(([header, value]) => {
    res.setHeader(header, value);
  });

  next();
};

const rateLimitMessage =
  "تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً";
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMax = 100;

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const getClientId = (req: Request): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
};

const getRateLimitEntry = (clientId: string, now: number): RateLimitEntry => {
  const existing = rateLimitStore.get(clientId);
  if (!existing || existing.resetTime <= now) {
    const entry = { count: 0, resetTime: now + rateLimitWindowMs };
    rateLimitStore.set(clientId, entry);
    return entry;
  }
  return existing;
};

export const apiLimiter = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  const clientId = getClientId(req);
  const entry = getRateLimitEntry(clientId, now);

  entry.count += 1;

  if (entry.count > rateLimitMax) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.resetTime - now) / 1000)
    );

    res.setHeader("Retry-After", retryAfterSeconds.toString());
    res.status(429).json({
      error: rateLimitMessage,
      retryAfter: retryAfterSeconds,
    });
    return;
  }

  res.setHeader("X-RateLimit-Limit", rateLimitMax.toString());
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(rateLimitMax - entry.count, 0).toString()
  );
  res.setHeader(
    "X-RateLimit-Reset",
    Math.ceil(entry.resetTime / 1000).toString()
  );

  next();
};
