import mysql from "mysql2/promise";
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { eq, like, and, desc, or } from "drizzle-orm";
import { InsertUser, users as mysqlUsers } from "../../drizzle/schema";
import * as schema from "../../drizzle/schema";
import { ENV } from './env';
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
    inquiries: [],
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
    cartItems: []
  };
  
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultDb, null, 2));
  } else {
    // Merge with existing data to add missing tables
    const existing = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
    const merged = { ...defaultDb, ...existing };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(merged, null, 2));
  }
}

initJsonDb();

function readJsonDb() {
  try {
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
  } catch (e) {
    initJsonDb();
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
  }
}

function writeJsonDb(data: any) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

export async function getDb() {
  if (!_db) {
    if (process.env.DATABASE_URL) {
      try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        _db = drizzleMysql(connection);
        isJsonMode = false;
        console.log("[Database] Connected to MySQL");
      } catch (error) {
        console.warn("[Database] Failed to connect to MySQL, using JSON mode:", error);
        isJsonMode = true;
      }
    } else {
      console.log("[Database] No DATABASE_URL, using JSON mode");
      isJsonMode = true;
    }
  }
  return _db;
}

export function getUsersTable() {
  return mysqlUsers;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function getUserByEmail(email: string): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserByEmail MySQL error:", e);