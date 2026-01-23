import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import compression from "compression";
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
  const app = express();
  const server = createServer(app);
  // Trust the first proxy hop so rate limiting uses the real client IP.
  app.set("trust proxy", 1);
  
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
  
  // Enable compression for all responses
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6,
  }));
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  app.use(securityHeaders);
  app.use(sanitizeInput);
  app.use(performanceMonitor);
  app.use(ensureCsrfToken);
  app.use("/api", apiLimiter);
  app.use("/api/v2", newApiLimiter);
  
  // Stricter rate limiting for auth endpoints
  app.use("/api/oauth", authRateLimiter);
  app.use("/api/trpc/auth", authRateLimiter);
  app.use("/api/trpc/twoFactorAuth", authLimiter);
  
  // CSRF token endpoint
  app.get("/api/csrf-token", getCsrfTokenHandler);
  
  // Health check and metrics endpoints
  app.get("/api/health", healthCheck);
  app.get("/api/metrics", metricsEndpoint);
  
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

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
