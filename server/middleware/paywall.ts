import { Request, Response, NextFunction } from "express";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "user" | "admin";
  };
}

export async function requireSubscription(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      error: "Not authenticated",
      redirectTo: "/login",
    });
  }

  const db = await getDb();
  if (!db) {
    return res.status(500).json({ error: "Database unavailable" });
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = user[0];

    // Check if subscription is active
    if (!userData.subscriptionActive) {
      return res.status(403).json({
        error: "Subscription required",
        message: "Please upgrade to access this feature",
        redirectTo: "/pricing",
      });
    }

    // Check if subscription has expired
    if (
      userData.subscriptionEndsAt &&
      userData.subscriptionEndsAt < new Date()
    ) {
      return res.status(403).json({
        error: "Subscription expired",
        message: "Your subscription has expired. Please renew to continue.",
        redirectTo: "/pricing",
      });
    }

    // Subscription is valid
    next();
  } catch (error) {
    console.error("Paywall check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      error: "Not authenticated",
      redirectTo: "/login",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required",
    });
  }

  next();
}

export async function checkSubscriptionStatus(
  req: AuthenticatedRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({ authenticated: false });
  }

  const db = await getDb();
  if (!db) {
    return res.status(500).json({ error: "Database unavailable" });
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = user[0];

    res.json({
      authenticated: true,
      subscriptionActive: userData.subscriptionActive,
      subscriptionEndsAt: userData.subscriptionEndsAt,
      daysRemaining: userData.subscriptionEndsAt
        ? Math.ceil(
            (userData.subscriptionEndsAt.getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        : null,
    });
  } catch (error) {
    console.error("Subscription status check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
