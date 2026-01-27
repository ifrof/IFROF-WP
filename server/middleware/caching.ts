import { Request, Response, NextFunction } from "express";

export function cachingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Cache static assets for 1 year (immutable)
  if (
    req.path.startsWith("/assets/") ||
    req.path.match(/\.(js|css|woff2|png|jpg|svg)$/)
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("ETag", `"${Date.now()}"`);
  }
  // Cache HTML pages for 1 hour
  else if (req.path === "/" || req.path.endsWith(".html")) {
    res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
  }
  // No cache for API endpoints
  else if (req.path.startsWith("/api/") || req.path.startsWith("/trpc/")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }

  next();
}
