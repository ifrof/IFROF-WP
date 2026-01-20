import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, like, and, desc, or } from "drizzle-orm";
import { InsertUser, users as mysqlUsers } from "../drizzle/schema";
import * as schema from "../drizzle/schema";
import { ENV } from './_core/env';
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

export async function upsertUser(user: any): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const existing = await _db.select().from(schema.users).where(eq(schema.users.openId, user.openId)).limit(1);
      if (existing.length > 0) {
        await _db.update(schema.users)
          .set({ ...user, lastSignedIn: new Date(), updatedAt: new Date() })
          .where(eq(schema.users.openId, user.openId));
        return { ...existing[0], ...user };
      } else {
        const result = await _db.insert(schema.users).values(user);
        return { id: result.insertId, ...user };
      }
    } catch (e) {
      console.error("[Database] upsertUser MySQL error:", e);
    }
  }

  // JSON fallback
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

export async function getUserByOpenId(openId: string) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.users).where(eq(schema.users.openId, openId)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserByOpenId MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.openId === openId) || null;
}

export async function getUserById(id: number) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserById MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.id === id) || null;
}

// ============================================================================
// FACTORY OPERATIONS
// ============================================================================

export async function getAllFactories() {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.factories).orderBy(desc(schema.factories.createdAt));
    } catch (e) {
      console.error("[Database] getAllFactories MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.factories || [];
}

export async function getFactories() {
  return getAllFactories();
}

export async function getFactoryById(id: number) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.factories).where(eq(schema.factories.id, id)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getFactoryById MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.factories.find((f: any) => f.id === id) || null;
}

export async function searchFactories(query: string) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.factories)
        .where(or(
          like(schema.factories.name, `%${query}%`),
          like(schema.factories.description, `%${query}%`),
          like(schema.factories.location, `%${query}%`)
        ));
    } catch (e) {
      console.error("[Database] searchFactories MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const lowerQuery = query.toLowerCase();
  return (dbData.factories || []).filter((f: any) => 
    f.name?.toLowerCase().includes(lowerQuery) ||
    f.description?.toLowerCase().includes(lowerQuery) ||
    f.location?.toLowerCase().includes(lowerQuery)
  );
}

export async function createFactory(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.factories).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createFactory MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newFactory = {
    id: (dbData.factories.length > 0 ? Math.max(...dbData.factories.map((f: any) => f.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.factories.push(newFactory);
  writeJsonDb(dbData);
  return newFactory;
}

export async function updateFactory(id: number, data: any) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.factories).set({ ...data, updatedAt: new Date() }).where(eq(schema.factories.id, id));
      return { id, ...data };
    } catch (e) {
      console.error("[Database] updateFactory MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const index = dbData.factories.findIndex((f: any) => f.id === id);
  if (index >= 0) {
    dbData.factories[index] = { ...dbData.factories[index], ...data, updatedAt: new Date().toISOString() };
    writeJsonDb(dbData);
    return dbData.factories[index];
  }
  return null;
}

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

export async function getProductById(id: number) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getProductById MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.products.find((p: any) => p.id === id) || null;
}

export async function getProductsByFactory(factoryId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.products).where(eq(schema.products.factoryId, factoryId));
    } catch (e) {
      console.error("[Database] getProductsByFactory MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.products || []).filter((p: any) => p.factoryId === factoryId);
}

export async function searchProducts(query: string) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.products)
        .where(or(
          like(schema.products.name, `%${query}%`),
          like(schema.products.description, `%${query}%`),
          like(schema.products.category, `%${query}%`)
        ));
    } catch (e) {
      console.error("[Database] searchProducts MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const lowerQuery = query.toLowerCase();
  return (dbData.products || []).filter((p: any) => 
    p.name?.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery) ||
    p.category?.toLowerCase().includes(lowerQuery)
  );
}

export async function createProduct(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.products).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createProduct MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newProduct = {
    id: (dbData.products.length > 0 ? Math.max(...dbData.products.map((p: any) => p.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.products.push(newProduct);
  writeJsonDb(dbData);
  return newProduct;
}

export async function updateProduct(id: number, data: any) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.products).set({ ...data, updatedAt: new Date() }).where(eq(schema.products.id, id));
      return { id, ...data };
    } catch (e) {
      console.error("[Database] updateProduct MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const index = dbData.products.findIndex((p: any) => p.id === id);
  if (index >= 0) {
    dbData.products[index] = { ...dbData.products[index], ...data, updatedAt: new Date().toISOString() };
    writeJsonDb(dbData);
    return dbData.products[index];
  }
  return null;
}

// ============================================================================
// INQUIRY OPERATIONS
// ============================================================================

export async function getInquiriesByBuyer(buyerId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.inquiries).where(eq(schema.inquiries.buyerId, buyerId));
    } catch (e) {
      console.error("[Database] getInquiriesByBuyer MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.inquiries || []).filter((i: any) => i.buyerId === buyerId);
}

export async function getInquiriesByFactory(factoryId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.inquiries).where(eq(schema.inquiries.factoryId, factoryId));
    } catch (e) {
      console.error("[Database] getInquiriesByFactory MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.inquiries || []).filter((i: any) => i.factoryId === factoryId);
}

export async function createInquiry(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.inquiries).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createInquiry MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newInquiry = {
    id: (dbData.inquiries.length > 0 ? Math.max(...dbData.inquiries.map((i: any) => i.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.inquiries.push(newInquiry);
  writeJsonDb(dbData);
  return newInquiry;
}

export async function updateInquiry(id: number, data: any) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.inquiries).set({ ...data, updatedAt: new Date() }).where(eq(schema.inquiries.id, id));
      return { id, ...data };
    } catch (e) {
      console.error("[Database] updateInquiry MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const index = dbData.inquiries.findIndex((i: any) => i.id === id);
  if (index >= 0) {
    dbData.inquiries[index] = { ...dbData.inquiries[index], ...data, updatedAt: new Date().toISOString() };
    writeJsonDb(dbData);
    return dbData.inquiries[index];
  }
  return null;
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

export async function getOrdersByBuyer(buyerId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.orders).where(eq(schema.orders.buyerId, buyerId));
    } catch (e) {
      console.error("[Database] getOrdersByBuyer MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.orders || []).filter((o: any) => o.buyerId === buyerId);
}

export async function createOrder(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.orders).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createOrder MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newOrder = {
    id: (dbData.orders.length > 0 ? Math.max(...dbData.orders.map((o: any) => o.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.orders.push(newOrder);
  writeJsonDb(dbData);
  return newOrder;
}

// ============================================================================
// FORUM OPERATIONS
// ============================================================================

export async function getForumPosts(limit: number, offset: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.forumPosts)
        .orderBy(desc(schema.forumPosts.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (e) {
      console.error("[Database] getForumPosts MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.forumPosts || []).slice(offset, offset + limit);
}

export async function getForumPostById(id: number) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.forumPosts).where(eq(schema.forumPosts.id, id)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getForumPostById MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.forumPosts.find((p: any) => p.id === id) || null;
}

export async function createForumPost(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.forumPosts).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createForumPost MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newPost = {
    id: (dbData.forumPosts.length > 0 ? Math.max(...dbData.forumPosts.map((p: any) => p.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.forumPosts.push(newPost);
  writeJsonDb(dbData);
  return newPost;
}

export async function updateForumPost(id: number, data: any) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.forumPosts).set({ ...data, updatedAt: new Date() }).where(eq(schema.forumPosts.id, id));
      return { id, ...data };
    } catch (e) {
      console.error("[Database] updateForumPost MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const index = dbData.forumPosts.findIndex((p: any) => p.id === id);
  if (index >= 0) {
    dbData.forumPosts[index] = { ...dbData.forumPosts[index], ...data, updatedAt: new Date().toISOString() };
    writeJsonDb(dbData);
    return dbData.forumPosts[index];
  }
  return null;
}

export async function getForumAnswersByPost(postId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.forumAnswers).where(eq(schema.forumAnswers.postId, postId));
    } catch (e) {
      console.error("[Database] getForumAnswersByPost MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.forumAnswers || []).filter((a: any) => a.postId === postId);
}

export async function createForumAnswer(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.forumAnswers).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createForumAnswer MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newAnswer = {
    id: (dbData.forumAnswers.length > 0 ? Math.max(...dbData.forumAnswers.map((a: any) => a.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.forumAnswers.push(newAnswer);
  writeJsonDb(dbData);
  return newAnswer;
}

export async function updateForumAnswer(id: number, data: any) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.forumAnswers).set({ ...data, updatedAt: new Date() }).where(eq(schema.forumAnswers.id, id));
      return { id, ...data };
    } catch (e) {
      console.error("[Database] updateForumAnswer MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const index = dbData.forumAnswers.findIndex((a: any) => a.id === id);
  if (index >= 0) {
    dbData.forumAnswers[index] = { ...dbData.forumAnswers[index], ...data, updatedAt: new Date().toISOString() };
    writeJsonDb(dbData);
    return dbData.forumAnswers[index];
  }
  return null;
}

// ============================================================================
// BLOG OPERATIONS
// ============================================================================

export async function getBlogPosts(limit: number, offset: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.blogPosts)
        .where(eq(schema.blogPosts.published, 1))
        .orderBy(desc(schema.blogPosts.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (e) {
      console.error("[Database] getBlogPosts MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.blogPosts || [])
    .filter((p: any) => p.published === 1)
    .slice(offset, offset + limit);
}

export async function getBlogPostBySlug(slug: string) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.blogPosts)
        .where(and(eq(schema.blogPosts.slug, slug), eq(schema.blogPosts.published, 1)))
        .limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getBlogPostBySlug MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.blogPosts || []).find((p: any) => p.slug === slug && p.published === 1) || null;
}

export async function createBlogPost(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.blogPosts).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createBlogPost MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newPost = {
    id: (dbData.blogPosts.length > 0 ? Math.max(...dbData.blogPosts.map((p: any) => p.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.blogPosts.push(newPost);
  writeJsonDb(dbData);
  return newPost;
}

export async function updateBlogPost(id: number, data: any) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.blogPosts).set({ ...data, updatedAt: new Date() }).where(eq(schema.blogPosts.id, id));
      return { id, ...data };
    } catch (e) {
      console.error("[Database] updateBlogPost MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const index = dbData.blogPosts.findIndex((p: any) => p.id === id);
  if (index >= 0) {
    dbData.blogPosts[index] = { ...dbData.blogPosts[index], ...data, updatedAt: new Date().toISOString() };
    writeJsonDb(dbData);
    return dbData.blogPosts[index];
  }
  return null;
}
