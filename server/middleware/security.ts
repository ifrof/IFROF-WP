import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { getSecrets } from "../config/secrets";

const secrets = getSecrets();

// Helmet security headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", secrets.BACKEND_URL],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// CORS configuration
export const corsMiddleware = cors({
  origin: secrets.CORS_ORIGINS.split(",").map(o => o.trim()),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
});

// Rate limiters
export const rateLimiters = {
  // General API rate limiter
  general: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.user?.role === "admin",
  }),

  // Auth rate limiter (stricter)
  auth: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: "Too many login attempts, please try again later",
    skipSuccessfulRequests: true,
  }),

  // Payment rate limiter
  payment: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 payment attempts per hour
    message: "Too many payment attempts, please try again later",
  }),

  // AI Search rate limiter
  aiSearch: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 searches per hour for free users, unlimited for paid
    message: "Search limit exceeded. Upgrade your subscription for unlimited searches.",
  }),
};

// Request size limits
export const requestSizeLimitMiddleware = express.json({ limit: "10mb" });
export const urlEncodedLimitMiddleware = express.urlencoded({ limit: "10mb", extended: true });

// IP whitelisting for admin endpoints
export const adminIpWhitelist = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "production") {
    const adminIps = process.env.ADMIN_IP_WHITELIST?.split(",") || [];
    const clientIp = req.ip || req.connection.remoteAddress || "";
    
    if (!adminIps.includes(clientIp)) {
      return res.status(403).json({ error: "Access denied" });
    }
  }
  next();
};

// Security headers middleware
export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
};

// Request logging middleware
export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Error handling middleware
export const errorHandlingMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);
  
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  if (err.message?.includes("rate limit")) {
    return res.status(429).json({ error: err.message });
  }
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
};
