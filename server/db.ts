import { eq } from "drizzle-orm";
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, like, and, desc, or } from "drizzle-orm";
import * as schema from "../drizzle/schema";
import { ENV } from "./_core/env";
import path from "path";
import fs from "fs";

let _db: any = null;
let isJsonMode = false;

const JSON_DB_PATH = path.join(process.cwd(), "local_db.json");

// Initialize JSON database with all tables
function initJsonDb() {
  const defaultDb = {
    users: [],
    factories: [],
    products: [],
    orders: [],
    importRequests: [],
    quotes: [],
    messages: [],
    blogPosts: [],
    chatMessages: [],
    forumPosts: [],
    forumAnswers: [],
    forumVotes: [],
    notifications: [],
    subscriptionPlans: [],
    userSubscriptions: [],
    countryPreferences: [],
    shipments: [],
    activityLogs: [],
    productPortfolio: [],
    services: [],
    reviews: [],
    cartItems: [],
    sessions: [],
    buyerProfiles: [],
  };

  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultDb, null, 2));
  } else {
    try {
      const existing = JSON.parse(fs.readFileSync(JSON_DB_PATH, "utf-8"));
      const merged = { ...defaultDb, ...existing };
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(merged, null, 2));
    } catch (e) {
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultDb, null, 2));
    }
  }
}

function readJsonDb() {
  try {
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, "utf-8"));
  } catch (e) {
    initJsonDb();
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, "utf-8"));
  }
}

function writeJsonDb(data: any) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

export async function getDb() {
  if (!_db) {
    if (process.env.DATABASE_URL) {
      try {
        const connection = await mysql.createConnection(dbUrl);
        _db = drizzleMysql(connection, { schema, mode: "default" });
        isJsonMode = false;
      } catch (error) {
        console.warn(
          "[Database] Failed to connect to MySQL, using JSON mode:",
          error
        );
        isJsonMode = true;
      }
    }
    if (!_db) {
      isJsonMode = true;
      _db = { select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }) };
    }
  }
  return _db;
}

export function getUsersTable() {
  return schema.users;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function getUserById(id: number): Promise<any> {
  const db = await getDb();
  if (!isJsonMode && db) {
    try {
      const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserById MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<any> {
  const db = await getDb();
  if (!isJsonMode && db) {
    try {
      const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserByEmail MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.email === email) || null;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!isJsonMode && db) {
    try {
      const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.openId, openId))
        .limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserByOpenId MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.openId === openId) || null;
}

export async function upsertUser(user: any): Promise<any> {
  const db = await getDb();
  if (!isJsonMode && db) {
    try {
      const existing = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.openId, user.openId))
        .limit(1);
      if (existing.length > 0) {
        await db
          .update(schema.users)
          .set({ ...user, lastSignedIn: new Date(), updatedAt: new Date() })
          .where(eq(schema.users.openId, user.openId));
        return { ...existing[0], ...user };
      } else {
        const [result] = await db.insert(schema.users).values(user);
        return { id: (result as any).insertId, ...user };
      }
    } catch (e) {
      console.error("[Database] upsertUser MySQL error:", e);
    }
  }

  // JSON fallback
  const dbData = readJsonDb();
  const existingIndex = dbData.users.findIndex(
    (u: any) => u.email === user.email || u.openId === user.openId
  );

  if (existingIndex >= 0) {
    const updatedUser = {
      ...dbData.users[existingIndex],
      ...user,
      lastSignedIn: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbData.users[existingIndex] = updatedUser;
    writeJsonDb(dbData);
    return updatedUser;
  } else {
    const newUser = {
      id: dbData.users.length + 1,
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSignedIn: new Date().toISOString(),
    };
    dbData.users.push(newUser);
    writeJsonDb(dbData);
    return newUser;
  }
}

export async function getUserByOpenId(openId: string) {
  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.openId === openId);
}

export async function getSession(id: string): Promise<any> {
  const db = await getDb();
  if (!isJsonMode && db) {
    try {
      const result = await db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.id, id))
        .limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getSession MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.sessions) return null;
  return dbData.sessions.find((s: any) => s.id === id) || null;
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDb();
  if (!isJsonMode && db) {
    try {
      await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
      return;
    } catch (e) {
      console.error("[Database] deleteSession MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (dbData.sessions) {
    dbData.sessions = dbData.sessions.filter((s: any) => s.id !== id);
    writeJsonDb(dbData);
  }
}
