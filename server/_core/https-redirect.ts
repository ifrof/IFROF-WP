import type { NextFunction, Request, Response } from "express";

/**
 * HTTPS Redirect Middleware
 * Forces HTTPS in production environment
 */

export const httpsRedirect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip in development
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  // Skip if FORCE_HTTPS is explicitly disabled
  if (process.env.FORCE_HTTPS === "false") {
    return next();
  }

  // Check if request is already HTTPS
  const isHttps =
    req.secure ||
    req.headers["x-forwarded-proto"] === "https" ||
    req.headers["x-forwarded-ssl"] === "on";

  // Skip redirect for health check and metrics endpoints to avoid Railway healthcheck failures
  if (req.path === "/api/health" || req.path === "/api/metrics") {
    return next();
  }

  if (!isHttps) {
    // Redirect to HTTPS
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    return res.redirect(301, httpsUrl);
  }

  next();
};
