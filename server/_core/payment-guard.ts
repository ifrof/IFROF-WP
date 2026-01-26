import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { orders } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function requireActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database unavailable",
    });
  }

  const activeOrder = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.buyerId, userId),
        eq(orders.paymentStatus, "completed")
      )
    )
    .limit(1);

  if (!activeOrder || activeOrder.length === 0) {
    throw new TRPCError({
      code: "PAYMENT_REQUIRED",
      message: "Active subscription required. Please complete payment to access factory database.",
    });
  }

  return true;
}

export async function checkPaymentStatus(userId: number) {
  const db = await getDb();
  if (!db) return false;

  const activeOrder = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.buyerId, userId),
        eq(orders.paymentStatus, "completed")
      )
    )
    .limit(1);

  return activeOrder && activeOrder.length > 0;
}
