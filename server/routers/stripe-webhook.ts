import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { orders, notifications } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.warn("WARNING: STRIPE_SECRET_KEY is not set");
}

if (!webhookSecret) {
  console.warn("WARNING: STRIPE_WEBHOOK_SECRET is not set");
}

const stripe = new Stripe(stripeSecretKey || "sk_test_dummy_key_for_initialization");

export const stripeWebhookRouter = Router();

stripeWebhookRouter.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!webhookSecret) {
    console.error("Webhook secret not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return res.status(500).json({ error: "Database not available" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Stripe Webhook] Checkout session completed:", session.id);

        const orderRecords = await db
          .select()
          .from(orders)
          .where(eq(orders.stripePaymentIntentId, session.id));

        if (orderRecords.length > 0) {
          const order = orderRecords[0];

          // Calculate commission (2-3% from factory)
          const commissionRate = 0.025; // 2.5% default
          const commissionAmount = Math.round(order.totalAmount * commissionRate);

          await db
            .update(orders)
            .set({
              paymentStatus: "completed",
              status: "confirmed",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

          console.log(`[Stripe Webhook] Commission calculated: $${(commissionAmount / 100).toFixed(2)} (${(commissionRate * 100)}%)`);

          console.log(`[Stripe Webhook] Order ${order.orderNumber} payment confirmed`);

          await db.insert(notifications).values({
            userId: order.buyerId,
            type: "order_placed",
            title: "Payment Confirmed",
            message: `Your payment for order ${order.orderNumber} has been confirmed. Total: $${(order.totalAmount / 100).toFixed(2)}`,
            relatedEntityId: order.id,
            read: 0,
            createdAt: new Date(),
          });
        }
        break;
      }

      case "charge.failed": {
        const charge = event.data.object as Stripe.Charge;
        console.log("[Stripe Webhook] Charge failed:", charge.id);

        if (charge.metadata?.user_id) {
          const userId = parseInt(charge.metadata.user_id);

          await db.insert(notifications).values({
            userId,
            type: "order_placed",
            title: "Payment Failed",
            message: `Your payment failed. Reason: ${charge.failure_message || "Unknown error"}. Please try again.`,
            read: 0,
            createdAt: new Date(),
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("[Stripe Webhook] Charge refunded:", charge.id);

        const orderRecords = await db
          .select()
          .from(orders)
          .where(eq(orders.stripePaymentIntentId, charge.payment_intent?.toString() || ""));

        if (orderRecords.length > 0) {
          const order = orderRecords[0];

          await db
            .update(orders)
            .set({
              paymentStatus: "refunded",
              status: "cancelled",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

          console.log(`[Stripe Webhook] Order ${order.orderNumber} refunded`);

          await db.insert(notifications).values({
            userId: order.buyerId,
            type: "order_placed",
            title: "Refund Processed",
            message: `Your refund for order ${order.orderNumber} has been processed. Amount: $${(order.totalAmount / 100).toFixed(2)}`,
            relatedEntityId: order.id,
            read: 0,
            createdAt: new Date(),
          });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Stripe Webhook] Payment intent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Stripe Webhook] Payment intent failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
