import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import shrinkRay from "shrink-ray-current";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStripeWebhook } from "./stripe-webhook";
import { appRouter } from "../routers.js";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { apiLimiter, sanitizeInput, securityHeaders } from "./middleware";
import { authRateLimiter } from "./auth-rate-limiter";
import { errorHandler } from "../middleware/error-handler";
import { apiLimiter as newApiLimiter, authLimiter } from "../middleware/rate-limiter";
import { ensureCsrfToken, getCsrfTokenHandler } from "./csrf";
import { httpsRedirect } from "./https-redirect";
import cookieParser from "cookie-parser";
import sitemapRouter from "../routes/sitemap";
import { redirectMiddleware } from "../middleware/redirects";
import { initializeCronJobs } from "../cron/cron-jobs";
import path from "path";
import fs from "fs";
import { performanceMonitor, errorTracker } from "./performance-monitor";
import { healthCheck, metricsEndpoint } from "./health-check";
import { aiRateLimiter, aiDailyCap, requireAuth } from "../middleware/ai-guardrails"; // NEW
import { validateConfig, redisRateLimiter } from "./hardening";
import cors from "cors";
import { attachAuthUser } from "../middleware/auth-session";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Run startup validation
  await validateConfig();

  const app = express();
  const server = createServer(app);
  // Trust the first proxy hop so rate limiting uses the real client IP.
  app.set("trust proxy", 1);
  
  // Health check endpoint - MUST be first for Railway deployment
  app.get("/api/health", healthCheck);
  app.get("/api/metrics", metricsEndpoint);
  
  // Force HTTPS in production
  app.use(httpsRedirect);

  // SEO Redirects
  app.use(redirectMiddleware);

  // Sitemap
  app.use(sitemapRouter);

  // Robots.txt explicit route
  app.get("/robots.txt", (req, res) => {
    const robotsPath = process.env.NODE_ENV === "production"
      ? path.resolve(import.meta.dirname, "public", "robots.txt")
      : path.resolve(import.meta.dirname, "../../client/public", "robots.txt");
    
    if (fs.existsSync(robotsPath)) {
      res.sendFile(robotsPath);
    } else {
      res.type("text/plain").send("User-agent: *\nAllow: /\nSitemap: https://ifrof.com/sitemap.xml");
    }
  });
  
  // Initialize SEO Cron Jobs
  initializeCronJobs();
  
  // Enable Brotli/Gzip compression for all responses
  app.use(shrinkRay({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return true;
    },
    threshold: 1024,
  }));
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  // Attach authenticated user (DB-backed sessions) for downstream middleware.
  app.use(attachAuthUser);
  
  // Hardened CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://ifrof.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "X-CSRF-Token"],
  }));

  app.use(securityHeaders);
  app.use(sanitizeInput);
  app.use(performanceMonitor);
  app.use(ensureCsrfToken);
  app.use("/api", apiLimiter);
  app.use("/api/v2", newApiLimiter);
  
  // Redis-backed Rate Limiting for sensitive routes (10 req/min/IP)
  const sensitiveRateLimiter = redisRateLimiter({ windowMs: 60 * 1000, maxRequests: 10 });
  
  app.use("/api/trpc/aiAgent", sensitiveRateLimiter);
  app.use("/api/trpc/storage", sensitiveRateLimiter);
  app.use("/api/trpc/auth", sensitiveRateLimiter);
  app.use("/api/trpc/payments", sensitiveRateLimiter);
  app.use("/api/stripe/webhook", sensitiveRateLimiter);

  // Stricter rate limiting for auth endpoints
  app.use("/api/oauth", authRateLimiter);
  app.use("/api/trpc/auth", authRateLimiter);
  app.use("/api/trpc/twoFactorAuth", authLimiter);
  
  // AI Guardrails: Auth, Rate Limit, Daily Cap
  app.use("/api/trpc/aiAgent", requireAuth, aiRateLimiter, aiDailyCap); // NEW

  // CSRF token endpoint
  app.get("/api/csrf-token", getCsrfTokenHandler);
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Stripe webhook endpoint (must be before CSRF check)
  registerStripeWebhook(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Error tracking middleware (must be last)
  app.use(errorTracker);
  app.use(errorHandler);

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);
// Triggering Railway build at Fri Jan 23 09:32:46 EST 2026
