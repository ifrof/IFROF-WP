import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { orders } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn("WARNING: STRIPE_SECRET_KEY is not set. Payment features will be disabled.");
}
const stripe = new Stripe(stripeSecretKey || "sk_test_dummy_key_for_initialization");

const createCheckoutSchema = z.object({
  factoryId: z.number(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      price: z.number().min(0.5),
    })
  ),
});

export const paymentsRouter = router({
  // Create checkout session
  createCheckout: protectedProcedure
    .input(createCheckoutSchema)
    .mutation(async ({ ctx, input }) => {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Payment system is currently unavailable. Please contact support. / نظام الدفع غير متوفر حالياً، يرجى التواصل مع الدعم.",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const origin = ctx.req.headers.origin || "https://example.com";

        // Calculate total
        const totalAmount = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: input.items.map((item) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: `Product #${item.productId}`,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          })),
          mode: "payment",
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            factory_id: input.factoryId.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          success_url: `${origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/marketplace`,
          allow_promotion_codes: true,
        });

        // Create order record in database
        const orderNumber = `ORD-${nanoid(8).toUpperCase()}`;
        await db.insert(orders).values({
          buyerId: ctx.user.id,
          factoryId: input.factoryId,
          orderNumber,
          items: JSON.stringify(input.items),
          totalAmount: Math.round(totalAmount * 100), // Store in cents
          status: "pending",
          paymentStatus: "pending",
          stripePaymentIntentId: session.payment_intent?.toString() || session.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          sessionId: session.id,
          checkoutUrl: session.url,
          orderNumber,
        };
      } catch (error) {
        console.error("Stripe checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  // Get order by session ID
  getOrderBySession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const orderRecords = await db
          .select()
          .from(orders)
          .where(eq(orders.stripePaymentIntentId, input.sessionId));

        if (orderRecords.length === 0) return null;

        const order = orderRecords[0];

        // Verify user owns this order
        if (order.buyerId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this order",
          });
        }

        // Get session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);

        return {
          ...order,
          paymentStatus: session.payment_status === "paid" ? "completed" : "pending",
          stripeStatus: session.status,
        };
      } catch (error) {
        console.error("Error fetching order:", error);
        return null;
      }
    }),

  // Get user's orders
  getOrders: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        return db
          .select()
          .from(orders)
          .where(eq(orders.buyerId, ctx.user.id))
          .limit(input.limit)
          .offset(input.offset);
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
    }),

  // Get order details
  getOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const orderRecords = await db
          .select()
          .from(orders)
          .where(eq(orders.id, input.orderId));

        if (orderRecords.length === 0) return null;

        const order = orderRecords[0];

        // Verify user owns this order
        if (order.buyerId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this order",
          });
        }

        return order;
      } catch (error) {
        console.error("Error fetching order:", error);
        return null;
      }
    }),

  // Update order status (admin only)
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "factory") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and factories can update order status",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(orders)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(orders.id, input.orderId));

        return { success: true };
      } catch (error) {
        console.error("Error updating order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order status",
        });
      }
    }),

  // Get factory orders
  getFactoryOrders: protectedProcedure
    .input(z.object({ factoryId: z.number(), limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "factory") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only factories can view their orders",
        });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        return db
          .select()
          .from(orders)
          .where(eq(orders.factoryId, input.factoryId))
          .limit(input.limit)
          .offset(input.offset);
      } catch (error) {
        console.error("Error fetching factory orders:", error);
        return [];
      }
    }),
});
