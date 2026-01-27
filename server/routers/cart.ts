import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const cartRouter = router({
  // Get cart items for current user
  getItems: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Get user's cart items
      const cartItems = await db.getCartItems(userId);

      // Fetch product details for each cart item
      const itemsWithDetails = await Promise.all(
        (cartItems || []).map(async (item: any) => {
          const product = await db.getProductById(item.productId);
          const factory = product
            ? await db.getFactoryById(product.factoryId)
            : null;
          return {
            ...item,
            product,
            factory,
            subtotal: (product?.basePrice || 0) * item.quantity,
          };
        })
      );

      return itemsWithDetails;
    } catch (error) {
      console.error("[Cart] getItems error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch cart items",
      });
    }
  }),

  // Add item to cart
  addItem: protectedProcedure
    .input(
      z.object({ productId: z.number(), quantity: z.number().min(1).max(999) })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        // Verify product exists
        const product = await db.getProductById(input.productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        // Check minimum order quantity
        if (input.quantity < (product.minimumOrderQuantity || 1)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Minimum order quantity is ${product.minimumOrderQuantity}`,
          });
        }

        // Add or update cart item
        await db.addToCart(userId, input.productId, input.quantity);

        return { success: true, message: "Item added to cart" };
      } catch (error: any) {
        console.error("[Cart] addItem error:", error);
        if (error.code) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add item to cart",
        });
      }
    }),

  // Remove item from cart
  removeItem: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        const product = await db.getProductById(input.productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        await db.removeFromCart(userId, input.productId);
        return { success: true, message: "Item removed from cart" };
      } catch (error: any) {
        console.error("[Cart] removeItem error:", error);
        if (error.code) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove item from cart",
        });
      }
    }),

  // Update item quantity
  updateQuantity: protectedProcedure
    .input(
      z.object({ productId: z.number(), quantity: z.number().min(1).max(999) })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        // Verify product exists and check MOQ
        const product = await db.getProductById(input.productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        if (input.quantity < (product.minimumOrderQuantity || 1)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Minimum order quantity is ${product.minimumOrderQuantity}`,
          });
        }

        await db.updateCartQuantity(userId, input.productId, input.quantity);
        return { success: true, message: "Quantity updated" };
      } catch (error: any) {
        console.error("[Cart] updateQuantity error:", error);
        if (error.code) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update quantity",
        });
      }
    }),

  // Clear cart
  clear: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      await db.clearCart(userId);
      return { success: true, message: "Cart cleared" };
    } catch (error) {
      console.error("[Cart] clear error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to clear cart",
      });
    }
  }),

  // Get cart summary (total, item count, etc.)
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

      let total = 0;
      let itemCount = 0;

      for (const item of cartItems || []) {
        const product = await db.getProductById(item.productId);
        if (product) {
          total += (product.basePrice || 0) * item.quantity;
          itemCount += item.quantity;
        }
      }

      return {
        itemCount,
        total,
        itemsCount: (cartItems || []).length,
      };
    } catch (error) {
      console.error("[Cart] getSummary error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get cart summary",
      });
    }
  }),

  // Alias for compatibility
  add: protectedProcedure
    .input(z.object({ productId: z.number(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const product = await db.getProductById(input.productId);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      if (input.quantity < (product.minimumOrderQuantity || 1)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Minimum order quantity is ${product.minimumOrderQuantity}`,
        });
      }

      await db.addToCart(userId, input.productId, input.quantity);
      return { success: true, message: "Item added to cart" };
    }),

  // Aliases for compatibility
  add: protectedProcedure
    .input(z.object({ productId: z.number(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement cart functionality
      return { success: true };
    }),
});
