/**
 * Security Utilities
 * - CSRF Protection
 * - Input Validation
 * - Data Encryption
 * - RBAC (Role-Based Access Control)
 */

import crypto from "crypto";

/**
 * CSRF Token Management
 */
export class CSRFTokenManager {
  private tokens: Map<string, { token: string; timestamp: number }> = new Map();
  private tokenExpiry: number = 1000 * 60 * 60; // 1 hour

  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens.set(sessionId, {
      token,
      timestamp: Date.now(),
    });
    return token;
  }

  validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    if (!stored) return false;

    // Check if token is expired
    if (Date.now() - stored.timestamp > this.tokenExpiry) {
      this.tokens.delete(sessionId);
      return false;
    }

    // Verify token matches
    return crypto.timingSafeEqual(
      Buffer.from(stored.token),
      Buffer.from(token)
    );
  }

  revokeToken(sessionId: string): void {
    this.tokens.delete(sessionId);
  }

  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now - data.timestamp > this.tokenExpiry) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

/**
 * Input Validation
 */
export class InputValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 320;
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 20;
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeString(input: string, maxLength: number = 1000): string {
    // Remove HTML tags and limit length
    return input
      .replace(/<[^>]*>/g, "")
      .substring(0, maxLength)
      .trim();
  }

  static validateInteger(value: any, min?: number, max?: number): boolean {
    const num = parseInt(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  }

  static validateEnum(value: string, allowedValues: string[]): boolean {
    return allowedValues.includes(value);
  }

  static validatePassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one digit");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Data Encryption
 */
export class DataEncryption {
  private algorithm = "aes-256-gcm";
  private encryptionKey: Buffer;

  constructor(keyString: string) {
    // Key should be 32 bytes for aes-256
    this.encryptionKey = crypto.createHash("sha256").update(keyString).digest();
  }

  encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.encryptionKey,
      iv
    );

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Return IV + authTag + encrypted data
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      iv
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, this.encryptionKey, 100000, 64, "sha512")
      .toString("hex");
  }

  verifyPassword(password: string, hash: string): boolean {
    const newHash = this.hashPassword(password);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(newHash));
  }
}

/**
 * Role-Based Access Control (RBAC)
 */
export type UserRole = "admin" | "factory" | "buyer" | "user";

export interface Permission {
  resource: string;
  action: string;
}

export class RBACManager {
  private rolePermissions: Map<UserRole, Permission[]> = new Map([
    [
      "admin",
      [
        { resource: "users", action: "read" },
        { resource: "users", action: "write" },
        { resource: "users", action: "delete" },
        { resource: "factories", action: "read" },
        { resource: "factories", action: "write" },
        { resource: "factories", action: "delete" },
        { resource: "products", action: "read" },
        { resource: "products", action: "write" },
        { resource: "products", action: "delete" },
        { resource: "orders", action: "read" },
        { resource: "orders", action: "write" },
        { resource: "dashboard", action: "read" },
      ],
    ],
    [
      "factory",
      [
        { resource: "factories", action: "read" },
        { resource: "factories", action: "write" },
        { resource: "products", action: "read" },
        { resource: "products", action: "write" },
        { resource: "orders", action: "read" },
        { resource: "inquiries", action: "read" },
        { resource: "inquiries", action: "write" },
        { resource: "dashboard", action: "read" },
      ],
    ],
    [
      "buyer",
      [
        { resource: "factories", action: "read" },
        { resource: "products", action: "read" },
        { resource: "orders", action: "read" },
        { resource: "orders", action: "write" },
        { resource: "inquiries", action: "read" },
        { resource: "inquiries", action: "write" },
        { resource: "cart", action: "read" },
        { resource: "cart", action: "write" },
        { resource: "dashboard", action: "read" },
      ],
    ],
    [
      "user",
      [
        { resource: "factories", action: "read" },
        { resource: "products", action: "read" },
        { resource: "blog", action: "read" },
        { resource: "forum", action: "read" },
      ],
    ],
  ]);

  hasPermission(role: UserRole, resource: string, action: string): boolean {
    const permissions = this.rolePermissions.get(role) || [];
    return permissions.some(
      p => p.resource === resource && p.action === action
    );
  }

  getPermissions(role: UserRole): Permission[] {
    return this.rolePermissions.get(role) || [];
  }

  canAccessResource(role: UserRole, resource: string): boolean {
    const permissions = this.rolePermissions.get(role) || [];
    return permissions.some(p => p.resource === resource);
  }
}

/**
 * Rate Limiting
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    return Math.max(0, this.maxRequests - requests.length);
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Audit Logging
 */
export interface AuditLog {
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  changes?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  private logs: AuditLog[] = [];

  log(entry: AuditLog): void {
    this.logs.push({
      ...entry,
      timestamp: new Date(),
    });
  }

  getLogs(userId?: number, action?: string): AuditLog[] {
    return this.logs.filter(log => {
      if (userId && log.userId !== userId) return false;
      if (action && log.action !== action) return false;
      return true;
    });
  }

  getRecentLogs(limit: number = 100): AuditLog[] {
    return this.logs.slice(-limit);
  }
}
