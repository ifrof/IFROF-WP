import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// Import all feature routers
import { factoriesRouter, productsRouter } from "./routers/factories";
import { authRouter } from "./routers/auth-complete";
import { inquiriesRouter, messagesRouter } from "./routers/inquiries";
import { forumRouter } from "./routers/forum";
import { chatbotRouter } from "./routers/chatbot";
import { paymentsRouter } from "./routers/payments";
import { notificationsRouter } from "./routers/notifications";
import { blogRouter } from "./routers/blog";
import { aiAgentRouter } from "./routers/aiAgent";
import { cartRouter } from "./routers/cart";
import { checkoutImprovedRouter } from "./routers/checkout-improved";
import { checkoutRouter } from "./routers/checkout";
import { reviewsRouter } from "./routers/reviews";
import { profilesRouter } from "./routers/profiles";
import { storageRouter } from "./routers/storage";
import { servicesRouter } from "./routers/services";
import { supportRouter } from "./routers/support";
import { dashboardRouter } from "./routers/dashboard";
import { mapsRouter } from "./routers/maps";
import { adminRouter } from "./routers/admin";
import { factoryVerificationRouter } from "./routers/factoryVerification";

export const appRouter = router({
  system: systemRouter,
  
  auth: authRouter,

  // Marketplace features
  factories: factoriesRouter,
  products: productsRouter,
  inquiries: inquiriesRouter,
  messages: messagesRouter,
  
  // Community features
  forum: forumRouter,
  blog: blogRouter,
  
  // AI & Chat features
  chatbot: chatbotRouter,
  aiAgent: aiAgentRouter,
  
  // Payment & Order features
  payments: paymentsRouter,
  
  // Notifications
  notifications: notificationsRouter,
  
  // Shopping features
  cart: cartRouter,
  checkout: checkoutImprovedRouter,
  checkoutOld: checkoutRouter,
  reviews: reviewsRouter,
  profiles: profilesRouter,
  storage: storageRouter,
  
  // Additional features
  services: servicesRouter,
  support: supportRouter,
  dashboard: dashboardRouter,
  maps: mapsRouter,
  admin: adminRouter,
  factoryVerification: factoryVerificationRouter,
});

export type AppRouter = typeof appRouter;

// Export all routers for testing
export {
  factoriesRouter,
  productsRouter,
  inquiriesRouter,
  messagesRouter,
  forumRouter,
  chatbotRouter,
  paymentsRouter,
  notificationsRouter,
  blogRouter,
  aiAgentRouter,
  cartRouter,
  reviewsRouter,
  servicesRouter,
  supportRouter,
  dashboardRouter,
  mapsRouter,
  adminRouter,
};