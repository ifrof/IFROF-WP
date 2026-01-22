import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, uniqueIndex, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role support for factory, buyer, and admin users.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: text("password"),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "factory", "buyer"]).default("buyer").notNull(),
  emailVerified: int("emailVerified").default(0).notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  verificationTokenExpires: timestamp("verificationTokenExpires"),
  resetPasswordToken: varchar("resetPasswordToken", { length: 255 }),
  resetPasswordExpires: timestamp("resetPasswordExpires"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Buyer profiles table for storing additional buyer information
 */
export const buyerProfiles = mysqlTable("buyer_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  companyName: text("companyName"),
  businessType: text("businessType"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  zipCode: varchar("zipCode", { length: 20 }),
  interests: text("interests"), // JSON array of product categories
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BuyerProfile = typeof buyerProfiles.$inferSelect;
export type InsertBuyerProfile = typeof buyerProfiles.$inferInsert;

/**
 * Admin profiles table for storing administrative user information
 */
export const adminProfiles = mysqlTable("admin_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  department: varchar("department", { length: 100 }),
  accessLevel: int("accessLevel").default(1).notNull(), // 1: standard, 2: superadmin
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminProfile = typeof adminProfiles.$inferSelect;
export type InsertAdminProfile = typeof adminProfiles.$inferInsert;

/**
 * Admin permissions table for granular access control
 */
export const adminPermissions = mysqlTable("admin_permissions", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull().references(() => adminProfiles.id),
  module: varchar("module", { length: 100 }).notNull(), // e.g., "users", "products", "orders"
  canRead: int("canRead").default(1).notNull(),
  canWrite: int("canWrite").default(0).notNull(),
  canDelete: int("canDelete").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminPermission = typeof adminPermissions.$inferSelect;
export type InsertAdminPermission = typeof adminPermissions.$inferInsert;

/**
 * Sessions table for managing user login sessions
 */
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Blog posts table for storing articles and content
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  lang: mysqlEnum("lang", ["ar", "en"]).notNull().default("ar"),
  slug: varchar("slug", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: int("authorId").notNull().references(() => users.id),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  featured: int("featured").default(0),
  published: int("published").default(0),
  titleAr: text("titleAr"),
  titleEn: text("titleEn"),
  contentAr: text("contentAr"),
  contentEn: text("contentEn"),
  excerptAr: text("excerptAr"),
  excerptEn: text("excerptEn"),
  categoryAr: varchar("categoryAr", { length: 100 }),
  categoryEn: varchar("categoryEn", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => {
  return {
    langSlugIdx: uniqueIndex("blog_posts_lang_slug_idx").on(table.lang, table.slug),
  };
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Chat messages table for storing AI chat history
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Factories table for storing verified Chinese manufacturer information
 */
export const factories = mysqlTable("factories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  certifications: text("certifications"),
  productCategories: text("productCategories"),
  productionCapacity: text("productionCapacity"),
  minimumOrderQuantity: int("minimumOrderQuantity"),
  logoUrl: text("logoUrl"),
  bannerUrl: text("bannerUrl"),
  certificationProofs: text("certificationProofs"), // JSON array of certification proof URLs or objects
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "rejected"]).default("pending"),
  verificationNotes: text("verificationNotes"),
  verifiedAt: timestamp("verifiedAt"),
  rating: int("rating").default(0),
  responseTime: varchar("responseTime", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => {
  return {
    nameIdx: index("factories_name_idx").on(table.name),
    locationIdx: index("factories_location_idx").on(table.location),
  };
});

export type Factory = typeof factories.$inferSelect;
export type InsertFactory = typeof factories.$inferInsert;

/**
 * Products table for storing factory products
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  factoryId: int("factoryId").notNull().references(() => factories.id),
  // Multilingual name
  nameAr: text("nameAr").notNull(),
  nameEn: text("nameEn").notNull(),
  nameZh: text("nameZh"),
  // Multilingual description
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  descriptionZh: text("descriptionZh"),
  categoryId: int("categoryId").references(() => categories.id),
  subcategoryId: int("subcategoryId").references(() => subcategories.id),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  specifications: text("specifications"),
  // Price range (stored in cents)
  minPrice: int("minPrice").notNull(),
  maxPrice: int("maxPrice"),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  pricingTiers: text("pricingTiers"), // JSON array for bulk pricing
  minimumOrderQuantity: int("minimumOrderQuantity").default(1),
  imageUrls: text("imageUrls"), // JSON array of image URLs
  featured: int("featured").default(0),
  active: int("active").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => {
  return {
    nameArIdx: index("products_name_ar_idx").on(table.nameAr),
    nameEnIdx: index("products_name_en_idx").on(table.nameEn),
    categoryIdx: index("products_category_idx").on(table.category),
  };
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Categories table for product classification
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }).notNull(),
  nameZh: varchar("nameZh", { length: 100 }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Subcategories table linked to categories
 */
export const subcategories = mysqlTable("subcategories", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull().references(() => categories.id),
  nameAr: varchar("nameAr", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }).notNull(),
  nameZh: varchar("nameZh", { length: 100 }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = typeof subcategories.$inferInsert;

/**
 * Inquiries table for buyer-factory inquiries
 */
export const importRequests = mysqlTable("import_requests", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull().references(() => users.id),
  productId: int("productId").references(() => products.id),
  factoryId: int("factoryId").references(() => factories.id),
  productName: text("productName"),
  category: varchar("category", { length: 100 }),
  quantity: int("quantity").notNull(),
  specifications: text("specifications"),
  deliveryDetails: text("deliveryDetails"),
  status: mysqlEnum("status", ["pending", "quoted", "accepted", "paid", "shipped", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ImportRequest = typeof importRequests.$inferSelect;
export type InsertImportRequest = typeof importRequests.$inferInsert;

export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull().references(() => importRequests.id),
  factoryId: int("factoryId").notNull().references(() => factories.id),
  price: int("price").notNull(), // in cents
  terms: text("terms"),
  commission: int("commission").notNull(), // 2-3% commission in cents
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

/**
 * Messages table for buyer-factory messaging
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  inquiryId: int("inquiryId").notNull().references(() => importRequests.id),
  senderId: int("senderId").notNull().references(() => users.id),
  receiverId: int("receiverId").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: text("attachments"),
  read: int("read").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Forum posts table for Q&A
 */
export const forumPosts = mysqlTable("forum_posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  views: int("views").default(0),
  status: mysqlEnum("status", ["open", "answered", "closed"]).default("open"),
  bestAnswerId: int("bestAnswerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;

/**
 * Forum answers table
 */
export const forumAnswers = mysqlTable("forum_answers", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => forumPosts.id),
  authorId: int("authorId").notNull().references(() => users.id),
  content: text("content").notNull(),
  votes: int("votes").default(0),
  isBestAnswer: int("isBestAnswer").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumAnswer = typeof forumAnswers.$inferSelect;
export type InsertForumAnswer = typeof forumAnswers.$inferInsert;

/**
 * Forum votes table for answer voting
 */
export const forumVotes = mysqlTable("forum_votes", {
  id: int("id").autoincrement().primaryKey(),
  answerId: int("answerId").notNull().references(() => forumAnswers.id),
  userId: int("userId").notNull().references(() => users.id),
  voteType: mysqlEnum("voteType", ["upvote", "downvote"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ForumVote = typeof forumVotes.$inferSelect;
export type InsertForumVote = typeof forumVotes.$inferInsert;

/**
 * Orders table for marketplace purchases
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull().references(() => users.id),
  factoryId: int("factoryId").notNull().references(() => factories.id),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  items: text("items").notNull(),
  totalAmount: int("totalAmount").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  shippingAddress: text("shippingAddress"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Notifications table for email and in-app notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  title: text("title").notNull(),
  message: text("message"),
  relatedEntityId: int("relatedEntityId"),
  read: int("read").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Subscription plans table for premium services
 */
export const subscriptionPlans = mysqlTable("subscription_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // IFROF Pro, IFROF Elite, etc.
  description: text("description"),
  price: int("price").notNull(), // Price in cents (9119 = $91.19)
  billingCycle: mysqlEnum("billingCycle", ["monthly", "annual"]).default("monthly"),
  features: text("features").notNull(), // JSON array of feature names
  active: int("active").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * User subscriptions table for tracking active subscriptions
 */
export const userSubscriptions = mysqlTable("user_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  planId: int("planId").notNull().references(() => subscriptionPlans.id),
  status: mysqlEnum("status", ["active", "expired", "cancelled", "pending"]).default("pending"),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  renewalDate: timestamp("renewalDate"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Country preferences table for factory filtering
 */
export const countryPreferences = mysqlTable("country_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  countries: text("countries").notNull(), // JSON array of country codes
  defaultCountry: varchar("defaultCountry", { length: 100 }).default("China"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CountryPreference = typeof countryPreferences.$inferSelect;
export type InsertCountryPreference = typeof countryPreferences.$inferInsert;

/**
 * Shipments table for tracking goods
 */
export const shipments = mysqlTable("shipments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  trackingNumber: varchar("trackingNumber", { length: 100 }).notNull().unique(),
  carrier: varchar("carrier", { length: 100 }), // DHL, FedEx, UPS, etc.
  status: mysqlEnum("status", ["pending", "shipped", "in_transit", "delivered", "failed"]).default("pending"),
  origin: varchar("origin", { length: 255 }), // Shipping from address
  destination: varchar("destination", { length: 255 }), // Shipping to address
  estimatedDelivery: timestamp("estimatedDelivery"),
  actualDelivery: timestamp("actualDelivery"),
  lastUpdate: timestamp("lastUpdate").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;



/**
 * Activity logs table for tracking user actions
 */
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(), // search, view, order, message, etc.
  actionType: varchar("actionType", { length: 50 }), // factory_view, product_view, order_placed, etc.
  targetId: int("targetId"), // ID of the target (factory, product, order, etc.)
  targetType: varchar("targetType", { length: 50 }), // factory, product, order, etc.
  metadata: text("metadata"), // JSON for additional data
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * Product portfolio table for manufacturer galleries
 */
export const productPortfolio = mysqlTable("product_portfolio", {
  id: int("id").autoincrement().primaryKey(),
  factoryId: int("factoryId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  specifications: text("specifications"), // JSON
  materials: varchar("materials", { length: 255 }),
  images: text("images").notNull(), // JSON array of image URLs
  thumbnail: varchar("thumbnail", { length: 500 }),
  productionYear: int("productionYear"),
  quantity: int("quantity"),
  price: int("price"), // in cents
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: mysqlEnum("status", ["available", "sold", "archived"]).default("available"),
  viewCount: int("viewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductPortfolio = typeof productPortfolio.$inferSelect;
export type InsertProductPortfolio = typeof productPortfolio.$inferInsert;

/**
 * Services table for factory services
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  factoryId: int("factoryId").notNull().references(() => factories.id),
  name: text("name").notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  basePrice: int("basePrice").notNull(),
  imageUrls: text("imageUrls"),
  active: int("active").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Shopping cart items table
 */
export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  productId: int("productId").notNull().references(() => products.id),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Reviews table for buyer reviews of products and factories
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().references(() => orders.id),
  buyerId: int("buyerId").notNull().references(() => users.id),
  factoryId: int("factoryId").notNull().references(() => factories.id),
  productId: int("productId").references(() => products.id),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  images: text("images"), // JSON array of image URLs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
