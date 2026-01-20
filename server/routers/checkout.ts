import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

const checkoutSchema = z.object({
  shippingAddress: z.string().min(10),
  shippingCity: z.string().min(2),
  shippingCountry: z.string().min(2),
  shippingZip: z.string().min(2),
  notes: z.string().optional(),
});

export const checkoutRouter = router({
  // Get checkout summary
  getSummary: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
        }

        const cartItems = await db.getCartItems(userId);
        
        let subtotal = 0;
        let itemCount = 0;

        for (const item of cartItems || []) {
          const product = await db.getProductById(item.productId);
          if (product) {
            subtotal += (product.basePrice || 0) * item.quantity;
            itemCount += item.quantity;
          }
        }

        const shipping = subtotal > 0 ? Math.round(subtotal * 0.1) : 0; // 10% shipping
        const tax = Math.round(subtotal * 0.08); // 8% tax
        const total = subtotal + shipping + tax;

        return {
          itemCount,
          subtotal,
          shipping,
          tax,
          total,
          items: cartItems || [],
        };
      } catch (error) {
        console.error("[Checkout] getSummary error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get checkout summary" });
      }
    }),

  // Create order from cart
  createOrder: protectedProcedure
    .input(checkoutSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
        }

        const cartItems = await db.getCartItems(userId);
        if (!cartItems || cartItems.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
        }

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of cartItems) {
          const product = await db.getProductById(item.productId);
          if (!product) {
            throw new TRPCError({ code: "NOT_FOUND", message: `Product ${item.productId} not found` });
          }

          const itemTotal = (product.basePrice || 0) * item.quantity;
          subtotal += itemTotal;

          orderItems.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            price: product.basePrice,
            subtotal: itemTotal,
          });
        }

        const shipping = Math.round(subtotal * 0.1);
        const tax = Math.round(subtotal * 0.08);
        const totalAmount = subtotal + shipping + tax;

        // Get the first factory from cart items (for demo)
        const firstProduct = await db.getProductById(cartItems[0].productId);
        const factoryId = firstProduct?.factoryId || 1;

        // Create order
        const orderNumber = `ORD-${Date.now()}`;
        const order = await db.createOrder({
          buyerId: userId,
          factoryId,
          orderNumber,
          items: JSON.stringify(orderItems),
          totalAmount,
          status: "pending",
          paymentStatus: "pending",
          shippingAddress: JSON.stringify(input),
          notes: input.notes,
        });

        // Clear cart after order creation
        await db.clearCart(userId);

        return {
          success: true,
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount,
          message: "Order created successfully",
        };
      } catch (error: any) {
        console.error("[Checkout] createOrder error:", error);
        if (error.code) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create order" });
      }
    }),

  // Get order details
  getOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }

        // Verify ownership
        if (order.buyerId !== ctx.user?.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You do not have access to this order" });
        }

        return order;
      } catch (error: any) {
        console.error("[Checkout] getOrder error:", error);
        if (error.code) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get order" });
      }
    }),

  // Get user's orders
  getOrders: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
        }

        return await db.getOrdersByBuyer(userId);
      } catch (error) {
        console.error("[Checkout] getOrders error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get orders" });
      }
    }),
});
