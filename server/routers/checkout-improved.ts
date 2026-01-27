import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { nanoid } from "nanoid";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(
  stripeSecretKey || "sk_test_dummy_key_for_initialization"
);

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

const shippingMethodSchema = z.enum(["standard", "express"]);

const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  shippingMethod: shippingMethodSchema.default("standard"),
  notes: z.string().optional(),
});

export const checkoutImprovedRouter = router({
  // Get checkout summary with cart items
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const cartItems = await db.getCartItems(userId);

      if (!cartItems || cartItems.length === 0) {
        return {
          itemCount: 0,
          items: [],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
        };
      }

      let subtotal = 0;
      const itemsWithDetails = [];

      for (const item of cartItems) {
        const product = await db.getProductById(item.productId);
        if (product) {
          const itemSubtotal = (product.basePrice || 0) * item.quantity;
          subtotal += itemSubtotal;
          itemsWithDetails.push({
            ...item,
            product,
            subtotal: itemSubtotal,
          });
        }
      }

      const shipping = Math.round(subtotal * 0.1);
      const tax = Math.round(subtotal * 0.08);
      const total = subtotal + shipping + tax;

      return {
        itemCount: cartItems.length,
        items: itemsWithDetails,
        subtotal,
        shipping,
        tax,
        total,
      };
    } catch (error) {
      console.error("[Checkout] getSummary error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get checkout summary",
      });
    }
  }),

  // Validate shipping address
  validateShippingAddress: protectedProcedure
    .input(shippingAddressSchema)
    .mutation(async ({ input }) => {
      try {
        return { valid: true, address: input };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid shipping address",
        });
      }
    }),

  // Create order and Stripe checkout session
  createCheckoutSession: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Payment system is currently unavailable",
        });
      }

      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        const cartItems = await db.getCartItems(userId);
        if (!cartItems || cartItems.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cart is empty",
          });
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        let subtotal = 0;
        const orderItems = [];

        for (const item of cartItems) {
          const product = await db.getProductById(item.productId);
          if (!product) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Product ${item.productId} not found`,
            });
          }

          const itemPrice = product.basePrice || 0;
          const itemTotal = itemPrice * item.quantity;
          subtotal += itemTotal;

          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description || undefined,
              },
              unit_amount: itemPrice,
            },
            quantity: item.quantity,
          });

          orderItems.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            price: itemPrice,
            subtotal: itemTotal,
          });
        }

        const shipping = Math.round(subtotal * 0.1);
        const tax = Math.round(subtotal * 0.08);
        const totalAmount = subtotal + shipping + tax;

        const origin = ctx.req.headers.origin || "https://ifrof.com";

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            shipping_method: input.shippingMethod,
          },
          success_url: `${origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout`,
          allow_promotion_codes: true,
        });

        const orderNumber = `ORD-${nanoid(8).toUpperCase()}`;
        const firstProduct = await db.getProductById(cartItems[0].productId);
        const factoryId = firstProduct?.factoryId || 1;

        const order = await db.createOrder({
          buyerId: userId,
          factoryId,
          orderNumber,
          items: JSON.stringify(orderItems),
          totalAmount,
          status: "pending",
          paymentStatus: "pending",
          stripePaymentIntentId: session.id,
          shippingAddress: JSON.stringify(input.shippingAddress),
          notes: input.notes,
        });

        return {
          success: true,
          sessionId: session.id,
          checkoutUrl: session.url,
          orderNumber,
          orderId: order.id,
          totalAmount,
        };
      } catch (error: any) {
        console.error("[Checkout] createCheckoutSession error:", error);
        if (error.code) throw error;
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
      try {
        const order = await db.getOrderById(0);
        if (!order) {
          return null;
        }

        if (order.buyerId !== ctx.user?.id && ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this order",
          });
        }

        const session = await stripe.checkout.sessions.retrieve(
          input.sessionId
        );

        return {
          ...order,
          paymentStatus:
            session.payment_status === "paid" ? "completed" : "pending",
          stripeStatus: session.status,
        };
      } catch (error) {
        console.error("[Checkout] getOrderBySession error:", error);
        return null;
      }
    }),

  // Clear cart after successful order
  clearCartAfterCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      await db.clearCart(userId);
      return { success: true };
    } catch (error) {
      console.error("[Checkout] clearCartAfterCheckout error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to clear cart",
      });
    }
  }),
});
