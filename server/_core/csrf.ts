import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";

/**
 * CSRF Protection Middleware
 * Implements Double Submit Cookie pattern
 */

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

// Generate a random CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

// Set CSRF token in cookie
export function setCsrfToken(res: Response): string {
  const token = generateCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  return token;
}

// Verify CSRF token
function verifyCsrfToken(req: Request): boolean {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken as string)
    );
  } catch {
    return false;
  }
}

// CSRF protection middleware for state-changing operations
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip CSRF check for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Skip CSRF check for API endpoints using OAuth tokens
  if (req.path.startsWith("/api/oauth/")) {
    return next();
  }

  // Verify CSRF token for state-changing operations
  if (!verifyCsrfToken(req)) {
    res.status(403).json({
      error: "Invalid CSRF token",
      code: "CSRF_TOKEN_INVALID",
    });
    return;
  }

  next();
};

// Middleware to ensure CSRF token exists
export const ensureCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies?.[CSRF_COOKIE_NAME]) {
    setCsrfToken(res);
  }
  next();
};

// Endpoint to get CSRF token
export function getCsrfTokenHandler(req: Request, res: Response) {
  const token = setCsrfToken(res);
  res.json({ csrfToken: token });
}
