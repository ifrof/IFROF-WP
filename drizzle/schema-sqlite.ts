import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role").default("buyer").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(new Date())
    .notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" })
    .default(new Date())
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  sessionId: text("sessionId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(new Date())
    .notNull(),
});
