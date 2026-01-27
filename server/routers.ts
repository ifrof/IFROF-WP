import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";

// Import all feature routers
import { factoriesRouter, productsRouter } from "./routers/factories";
import { inquiriesRouter, messagesRouter } from "./routers/inquiries";
import { forumRouter } from "./routers/forum";
import { chatbotRouter } from "./routers/chatbot";
import { paymentsRouter } from "./routers/payments";
import { notificationsRouter } from "./routers/notifications";
import { blogRouter } from "./routers/blog";
import { aiAgentRouter } from "./routers/aiAgent";
import { cartRouter } from "./routers/cart";
import { reviewsRouter } from "./routers/reviews";
import { servicesRouter } from "./routers/services";
import { supportRouter } from "./routers/support";
import { dashboardRouter } from "./routers/dashboard";
import { mapsRouter } from "./routers/maps";
import { adminRouter } from "./routers/admin";
import { factoryVerificationRouter } from "./routers/factoryVerification";
import { twoFactorAuthRouter } from "./routers/two-factor-auth";
import { newsletterRouter } from "./routers/newsletter";
import { adminActionsRouter } from "./routers/admin-actions";
import { factoryVerificationAiRouter } from "./routers/factory-verification-ai";
import { contentRouter } from "./routers/content";
import { adminDashboardRouter } from "./routers/admin-dashboard";
import { searchRouter } from "./routers/search";

export const appRouter = router({
  system: systemRouter,
  
  // Marketplace features
  factories: factoriesRouter,
  products: productsRouter,
  search: searchRouter,
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
  reviews: reviewsRouter,

  // Additional features
  services: servicesRouter,
  support: supportRouter,
  dashboard: dashboardRouter,
  maps: mapsRouter,
  admin: adminRouter,
  factoryVerification: factoryVerificationRouter,
  twoFactorAuth: twoFactorAuthRouter,
  newsletter: newsletterRouter,
  adminActions: adminActionsRouter,
  
  // New critical features
  factoryVerificationAi: factoryVerificationAiRouter,
  content: contentRouter,
  adminDashboard: adminDashboardRouter,
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
  factoryVerificationAiRouter,
  contentRouter,
  adminDashboardRouter,
  searchRouter,
};
