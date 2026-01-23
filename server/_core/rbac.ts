import { TRPCError } from "@trpc/server";
import { middleware } from "./trpc";

/**
 * Strict Role-Based Access Control Middleware
 */
export const isRole = (roles: ("admin" | "factory" | "buyer")[]) => 
  middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in" });
    }

    if (!roles.includes(ctx.user.role as any)) {
      throw new TRPCError({ 
        code: "FORBIDDEN", 
        message: `Access denied. Required roles: ${roles.join(", ")}` 
      });
    }

    return next({
      ctx: {
        user: ctx.user,
      },
    });
  });

export const isAdmin = isRole(["admin"]);
export const isFactory = isRole(["factory"]);
export const isBuyer = isRole(["buyer"]);
export const isStaff = isRole(["admin", "factory"]);
