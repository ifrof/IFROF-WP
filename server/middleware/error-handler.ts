import { Request, Response, NextFunction } from "express";

// Error types
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error logger
export function logError(error: Error, req?: Request) {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    message: error.message,
    stack: error.stack,
    url: req?.url,
    method: req?.method,
    ip: req?.ip,
    userAgent: req?.get("user-agent"),
  };

  console.error("[ERROR]", JSON.stringify(errorLog, null, 2));
}

// Error handler middleware
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logError(err, req);

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Unknown errors
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}

// Async handler wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
