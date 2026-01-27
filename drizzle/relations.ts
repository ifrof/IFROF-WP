import { relations } from "drizzle-orm";
import {
  users,
  factories,
  products,
  orders,
  inquiries,
  messages,
  blogPosts,
  chatMessages,
  forumPosts,
  forumAnswers,
  forumVotes,
  notifications,
  buyerProfiles,
  adminProfiles,
  adminPermissions,
  sessions,
  categories,
  subcategories,
  reviews,
  cartItems,
  shipments,
  userSubscriptions,
  subscriptionPlans,
  countryPreferences,
  activityLogs,
  productPortfolio,
  services,
} from "./schema";

// User relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  buyerProfile: one(buyerProfiles),
  adminProfile: one(adminProfiles),
  blogPosts: many(blogPosts),
  chatMessages: many(chatMessages),
  forumPosts: many(forumPosts),
  forumAnswers: many(forumAnswers),
  forumVotes: many(forumVotes),
  notifications: many(notifications),
  inquiries: many(inquiries),
  messages: many(messages),
  reviews: many(reviews),
  cartItems: many(cartItems),
  userSubscriptions: many(userSubscriptions),
  countryPreferences: one(countryPreferences),
  activityLogs: many(activityLogs),
}));

// Factory relations
export const factoriesRelations = relations(factories, ({ many, one }) => ({
  user: one(users, { fields: [factories.userId], references: [users.id] }),
  products: many(products),
  inquiries: many(inquiries),
  orders: many(orders),
  services: many(services),
  productPortfolio: many(productPortfolio),
}));

// Products relations
export const productsRelations = relations(products, ({ many, one }) => ({
  factory: one(factories, { fields: [products.factoryId], references: [factories.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  subcategory: one(subcategories, { fields: [products.subcategoryId], references: [subcategories.id] }),
  inquiries: many(inquiries),
  reviews: many(reviews),
  cartItems: many(cartItems),
}));

// Orders relations
export const ordersRelations = relations(orders, ({ many, one }) => ({
  buyer: one(users, { fields: [orders.buyerId], references: [users.id] }),
  factory: one(factories, { fields: [orders.factoryId], references: [factories.id] }),
  messages: many(messages),
  shipments: many(shipments),
}));

// Inquiries relations
export const inquiriesRelations = relations(inquiries, ({ many, one }) => ({
  buyer: one(users, { fields: [inquiries.buyerId], references: [users.id] }),
  factory: one(factories, { fields: [inquiries.factoryId], references: [factories.id] }),
  product: one(products, { fields: [inquiries.productId], references: [products.id] }),
  messages: many(messages),
}));

// Messages relations
export const messagesRelations = relations(messages, ({ one }) => ({
  inquiry: one(inquiries, { fields: [messages.inquiryId], references: [inquiries.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id] }),
}));

// Blog posts relations
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
}));

// Chat messages relations
export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
}));

// Forum posts relations
export const forumPostsRelations = relations(forumPosts, ({ many, one }) => ({
  author: one(users, { fields: [forumPosts.authorId], references: [users.id] }),
  answers: many(forumAnswers),
}));

// Forum answers relations
export const forumAnswersRelations = relations(forumAnswers, ({ many, one }) => ({
  post: one(forumPosts, { fields: [forumAnswers.postId], references: [forumPosts.id] }),
  author: one(users, { fields: [forumAnswers.authorId], references: [users.id] }),
  votes: many(forumVotes),
}));

// Forum votes relations
export const forumVotesRelations = relations(forumVotes, ({ one }) => ({
  answer: one(forumAnswers, { fields: [forumVotes.answerId], references: [forumAnswers.id] }),
  user: one(users, { fields: [forumVotes.userId], references: [users.id] }),
}));

// Notifications relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Reviews relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));

// Cart items relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

// Shipments relations
export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, { fields: [shipments.orderId], references: [orders.id] }),
}));

// User subscriptions relations
export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [userSubscriptions.planId], references: [subscriptionPlans.id] }),
}));

// Country preferences relations
export const countryPreferencesRelations = relations(countryPreferences, ({ one }) => ({
  user: one(users, { fields: [countryPreferences.userId], references: [users.id] }),
}));

// Activity logs relations
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

// Product portfolio relations
export const productPortfolioRelations = relations(productPortfolio, ({ one }) => ({
  factory: one(factories, { fields: [productPortfolio.factoryId], references: [factories.id] }),
}));

// Services relations
export const servicesRelations = relations(services, ({ one }) => ({
  factory: one(factories, { fields: [services.factoryId], references: [factories.id] }),
}));

// Admin profiles relations
export const adminProfilesRelations = relations(adminProfiles, ({ many, one }) => ({
  user: one(users, { fields: [adminProfiles.userId], references: [users.id] }),
  permissions: many(adminPermissions),
}));

// Admin permissions relations
export const adminPermissionsRelations = relations(adminPermissions, ({ one }) => ({
  admin: one(adminProfiles, { fields: [adminPermissions.adminId], references: [adminProfiles.id] }),
}));

// Buyer profiles relations
export const buyerProfilesRelations = relations(buyerProfiles, ({ one }) => ({
  user: one(users, { fields: [buyerProfiles.userId], references: [users.id] }),
}));

// Sessions relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
