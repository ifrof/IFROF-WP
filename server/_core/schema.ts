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