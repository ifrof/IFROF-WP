import { Request, Response, NextFunction } from "express";

/**
 * Middleware to log user actions for security and auditing.
 * In a real production app, this would save to a 'user_logs' table.
 */
export const userActionLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Hook into the finish event to log the result
  res.on("finish", () => {
    const duration = Date.now() - start;
    const user = (req as any).user; // Assuming user is attached by auth middleware

    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: user?.id || "anonymous",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    };

    // For now, we log to console. In production, this goes to DB or ELK stack.
    if (req.method !== "GET" || res.statusCode >= 400) {
      console.log(`[UserAction] ${JSON.stringify(logEntry)}`);
    }
  });

  next();
};
