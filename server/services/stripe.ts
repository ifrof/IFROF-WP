import Stripe from "stripe";
import { getSecrets } from "../config/secrets";
import { getDb } from "../db";
import { users, payments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendPaymentConfirmation } from "./email";
import { nanoid } from "nanoid";

const secrets = getSecrets();
const stripe = new Stripe(secrets.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  language: "en" | "ar" | "zh" = "en"
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get user
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user || user.length === 0) {
    throw new Error("User not found");
  }

  // Create or get Stripe customer
  let customerId = user[0].stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user[0].email,
      metadata: { userId },
    });
    customerId = customer.id;

    // Save customer ID
    await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId));
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${secrets.FRONTEND_URL}/dashboard?payment=success`,
    cancel_url: `${secrets.FRONTEND_URL}/pricing?payment=cancelled`,
    locale: language === "ar" ? "ar" : language === "zh" ? "zh" : "en",
  });

  return session;
}

export async function handleWebhookEvent(event: Stripe.Event) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        // Activate subscription
        await db
          .update(users)
          .set({
            subscriptionActive: true,
            stripeSubscriptionId: session.subscription as string,
            subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          })
          .where(eq(users.id, userId));

        // Get user email
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user && user.length > 0) {
          await sendPaymentConfirmation(
            user[0].email,
            session.amount_total || 0,
            "Professional Plan",
            "en"
          );
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by Stripe customer ID
      const customer = await stripe.customers.retrieve(customerId);
      const userId = customer.metadata?.userId;

      if (userId) {
        await db
          .update(users)
          .set({
            subscriptionActive: false,
            subscriptionEndsAt: null,
          })
          .where(eq(users.id, userId));
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const customer = await stripe.customers.retrieve(customerId);
      const userId = customer.metadata?.userId;

      if (userId) {
        // Record payment
        await db.insert(payments).values({
          id: nanoid(),
          userId,
          stripePaymentId: invoice.id,
          amount: invoice.amount_paid,
          currency: (invoice.currency as "usd" | "eur" | "gbp") || "usd",
          status: "succeeded",
        });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const customer = await stripe.customers.retrieve(customerId);
      const userId = customer.metadata?.userId;

      if (userId) {
        // Record failed payment
        await db.insert(payments).values({
          id: nanoid(),
          userId,
          stripePaymentId: invoice.id,
          amount: invoice.amount_due,
          currency: (invoice.currency as "usd" | "eur" | "gbp") || "usd",
          status: "failed",
        });
      }
      break;
    }
  }
}

export async function createCustomerPortal(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${secrets.FRONTEND_URL}/dashboard`,
  });

  return session.url;
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    secrets.STRIPE_WEBHOOK_SECRET
  );
}
