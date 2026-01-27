import { eq } from "drizzle-orm";
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { InsertUser, users as mysqlUsers } from "../drizzle/schema";
import { ENV } from './_core/env';
import path from "path";
import fs from "fs";

let _db: any = null;
let isJsonMode = false;

const JSON_DB_PATH = path.join(process.cwd(), "local_db.json");

if (!fs.existsSync(JSON_DB_PATH)) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify({ users: [] }, null, 2));
}

function readJsonDb() {
  try {
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
  } catch (e) {
    return { users: [] };
  }
}

function writeJsonDb(data: any) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

export async function getDb() {
  if (!_db) {
    if (process.env.DATABASE_URL) {
      try {
        _db = drizzleMysql(process.env.DATABASE_URL);
        isJsonMode = false;
      } catch (error) {
        console.warn("[Database] Failed to connect to MySQL:", error);
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
  return mysqlUsers;
}

export async function upsertUser(user: any): Promise<any> {
  const dbData = readJsonDb();
  const existingIndex = dbData.users.findIndex((u: any) => u.email === user.email || u.openId === user.openId);
  
  if (existingIndex >= 0) {
    const updatedUser = { 
      ...dbData.users[existingIndex], 
      ...user, 
      lastSignedIn: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
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
      lastSignedIn: new Date().toISOString()
    };
    dbData.users.push(newUser);
    writeJsonDb(dbData);
    return newUser;
  }
}

export async function getUserByEmail(email: string) {
  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.email === email) || null;
}

export async function getUserByOpenId(openId: string) {
  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.openId === openId);
}

// Feature queries (stubs for stability)
export async function getInquiriesByBuyer() { return []; }
export async function createInquiry() { return; }
export async function updateInquiry() { return; }
export async function getFactories() { return []; }
export async function getFactoryById() { return null; }
export async function getProductsByFactory() { return []; }
export async function getOrdersByBuyer() { return []; }
export async function getAllFactories() { return []; }
export async function searchFactories() { return []; }
export async function createFactory() { return; }
export async function updateFactory() { return; }
export async function getProductById() { return null; }
export async function searchProducts() { return []; }
export async function createProduct() { return; }
export async function updateProduct() { return; }
export async function getInquiriesByFactory() { return []; }
export async function getForumPosts() { return []; }
export async function getForumPostById() { return null; }
export async function updateForumPost() { return; }
export async function getForumAnswersByPost() { return []; }
export async function createForumPost() { return; }
export async function createForumAnswer() { return; }
export async function updateForumAnswer() { return; }
export async function getBlogPosts() { return []; }
export async function getBlogPostBySlug() { return null; }
export async function createBlogPost() { return; }
export async function updateBlogPost() { return; }
