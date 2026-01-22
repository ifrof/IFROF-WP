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

export async function getUserById(id: number): Promise<any> {
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

export async function getUserByEmail(email: string): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserByEmail MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.email === email) || null;
}

export async function getUserByVerificationToken(token: string): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.users).where(eq(schema.users.verificationToken, token)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserByVerificationToken MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.verificationToken === token) || null;
}

export async function getUserByResetToken(token: string): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.users).where(eq(schema.users.resetPasswordToken, token)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getUserByResetToken MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return dbData.users.find((u: any) => u.resetPasswordToken === token) || null;
}

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

// ============================================================================
// SESSION OPERATIONS
// ============================================================================

export async function createSession(session: any): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      await _db.insert(schema.sessions).values(session);
      return session;
    } catch (e) {
      console.error("[Database] createSession MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.sessions) dbData.sessions = [];
  dbData.sessions.push(session);
  writeJsonDb(dbData);
  return session;
}

export async function getSession(id: string): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.sessions).where(eq(schema.sessions.id, id)).limit(1);
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
  if (!isJsonMode && _db) {
    try {
      await _db.delete(schema.sessions).where(eq(schema.sessions.id, id));
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

// ============================================================================
// BUYER PROFILE OPERATIONS
// ============================================================================

export async function createBuyerProfile(data: any): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.buyerProfiles).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createBuyerProfile MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.buyerProfiles) dbData.buyerProfiles = [];
  const newProfile = {
    id: dbData.buyerProfiles.length + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.buyerProfiles.push(newProfile);
  writeJsonDb(dbData);
  return newProfile;
}

export async function getBuyerProfileByUserId(userId: number): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.buyerProfiles).where(eq(schema.buyerProfiles.userId, userId)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getBuyerProfileByUserId MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.buyerProfiles) return null;
  return dbData.buyerProfiles.find((p: any) => p.userId === userId) || null;
}

export async function updateBuyerProfile(userId: number, data: any): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.buyerProfiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.buyerProfiles.userId, userId));
      return { userId, ...data };
    } catch (e) {
      console.error("[Database] updateBuyerProfile MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.buyerProfiles) return null;
  const index = dbData.buyerProfiles.findIndex((p: any) => p.userId === userId);
  if (index >= 0) {
    dbData.buyerProfiles[index] = { 
      ...dbData.buyerProfiles[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    writeJsonDb(dbData);
    return dbData.buyerProfiles[index];
  }
  return null;
}

// ============================================================================
// ADMIN PROFILE OPERATIONS
// ============================================================================

export async function createAdminProfile(data: any): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.adminProfiles).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createAdminProfile MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.adminProfiles) dbData.adminProfiles = [];
  const newProfile = {
    id: dbData.adminProfiles.length + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.adminProfiles.push(newProfile);
  writeJsonDb(dbData);
  return newProfile;
}

export async function getAdminProfileByUserId(userId: number): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.adminProfiles).where(eq(schema.adminProfiles.userId, userId)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getAdminProfileByUserId MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.adminProfiles) return null;
  return dbData.adminProfiles.find((p: any) => p.userId === userId) || null;
}

export async function createAdminPermission(data: any): Promise<any> {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.adminPermissions).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createAdminPermission MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  if (!dbData.adminPermissions) dbData.adminPermissions = [];
  const newPermission = {
    id: dbData.adminPermissions.length + 1,
    ...data,
    createdAt: new Date().toISOString()
  };
  dbData.adminPermissions.push(newPermission);
  writeJsonDb(dbData);
  return newPermission;
}

// ============================================================================
// FACTORY OPERATIONS
// ============================================================================

export async function getAllFactories(limit: number = 50, offset: number = 0) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select({
        id: schema.factories.id,
        name: schema.factories.name,
        location: schema.factories.location,
        logoUrl: schema.factories.logoUrl,
        certificationProofs: schema.factories.certificationProofs,
        verificationStatus: schema.factories.verificationStatus,
        rating: schema.factories.rating,
      })
      .from(schema.factories)
      .orderBy(desc(schema.factories.createdAt))
      .limit(limit)
      .offset(offset);
    } catch (e) {
      console.error("[Database] getAllFactories MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.factories || []).slice(offset, offset + limit);
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

export async function getFactoriesByStatus(status: string) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.factories).where(eq(schema.factories.verificationStatus, status));
    } catch (e) {
      console.error("[Database] getFactoriesByStatus MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.factories || []).filter((f: any) => f.verificationStatus === status);
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

export async function getAllProducts(limit: number = 50, offset: number = 0) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select({
        id: schema.products.id,
        nameAr: schema.products.nameAr,
        nameEn: schema.products.nameEn,
        nameZh: schema.products.nameZh,
        category: schema.products.category,
        minPrice: schema.products.minPrice,
        maxPrice: schema.products.maxPrice,
        currency: schema.products.currency,
        imageUrls: schema.products.imageUrls,
        factoryId: schema.products.factoryId,
        minimumOrderQuantity: schema.products.minimumOrderQuantity,
        featured: schema.products.featured,
      })
      .from(schema.products)
      .where(eq(schema.products.active, 1))
      .limit(limit)
      .offset(offset);
    } catch (e) {
      console.error("[Database] getAllProducts MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.products || [])
    .filter((p: any) => p.active === 1)
    .slice(offset, offset + limit);
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

export async function getRelatedProducts(factoryId: number, excludeProductId: number, limit: number = 4) {
  const products = await getProductsByFactory(factoryId);
  return (products || [])
    .filter((p: any) => p.id !== excludeProductId)
    .slice(0, limit);
}

// Cart operations
export async function getCartItems(userId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.cartItems).where(eq(schema.cartItems.userId, userId));
    } catch (e) {
      console.error("[Database] getCartItems MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.cartItems || []).filter((c: any) => c.userId === userId);
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  if (!isJsonMode && _db) {
    try {
      const existing = await _db.select().from(schema.cartItems)
        .where(and(eq(schema.cartItems.userId, userId), eq(schema.cartItems.productId, productId)));
      
      if (existing.length > 0) {
        await _db.update(schema.cartItems)
          .set({ quantity: existing[0].quantity + quantity })
          .where(and(eq(schema.cartItems.userId, userId), eq(schema.cartItems.productId, productId)));
      } else {
        await _db.insert(schema.cartItems).values({ userId, productId, quantity });
      }
      return { success: true };
    } catch (e) {
      console.error("[Database] addToCart MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const existing = (dbData.cartItems || []).find((c: any) => c.userId === userId && c.productId === productId);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    dbData.cartItems = dbData.cartItems || [];
    dbData.cartItems.push({ id: Date.now(), userId, productId, quantity, createdAt: new Date() });
  }
  
  writeJsonDb(dbData);
  return { success: true };
}

export async function removeFromCart(userId: number, productId: number) {
  if (!isJsonMode && _db) {
    try {
      await _db.delete(schema.cartItems)
        .where(and(eq(schema.cartItems.userId, userId), eq(schema.cartItems.productId, productId)));
      return { success: true };
    } catch (e) {
      console.error("[Database] removeFromCart MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  dbData.cartItems = (dbData.cartItems || []).filter((c: any) => !(c.userId === userId && c.productId === productId));
  writeJsonDb(dbData);
  return { success: true };
}

export async function updateCartQuantity(userId: number, productId: number, quantity: number) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.cartItems)
        .set({ quantity })
        .where(and(eq(schema.cartItems.userId, userId), eq(schema.cartItems.productId, productId)));
      return { success: true };
    } catch (e) {
      console.error("[Database] updateCartQuantity MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const item = (dbData.cartItems || []).find((c: any) => c.userId === userId && c.productId === productId);
  if (item) {
    item.quantity = quantity;
  }
  writeJsonDb(dbData);
  return { success: true };
}

export async function clearCart(userId: number) {
  if (!isJsonMode && _db) {
    try {
      await _db.delete(schema.cartItems).where(eq(schema.cartItems.userId, userId));
      return { success: true };
    } catch (e) {
      console.error("[Database] clearCart MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  dbData.cartItems = (dbData.cartItems || []).filter((c: any) => c.userId !== userId);
  writeJsonDb(dbData);
  return { success: true };
}

// Order operations are defined in the ORDER OPERATIONS section below

export async function searchProducts(query: string) {
  return searchProductsAdvanced({ query });
}

export async function searchProductsAdvanced(filters: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  moq?: number;
  location?: string;
}) {
  if (!isJsonMode && _db) {
    try {
      const conditions = [];
      if (filters.query) {
        const q = `%${filters.query}%`;
        conditions.push(or(
          like(schema.products.nameAr, q),
          like(schema.products.nameEn, q),
          like(schema.products.nameZh, q),
          like(schema.products.descriptionAr, q),
          like(schema.products.descriptionEn, q),
          like(schema.products.descriptionZh, q)
        ));
      }
      if (filters.category) {
        conditions.push(eq(schema.products.category, filters.category));
      }
      if (filters.minPrice !== undefined) {
        conditions.push(schema.products.minPrice.gte(filters.minPrice * 100));
      }
      if (filters.maxPrice !== undefined) {
        conditions.push(schema.products.minPrice.lte(filters.maxPrice * 100));
      }
      if (filters.moq !== undefined) {
        conditions.push(schema.products.minimumOrderQuantity.lte(filters.moq));
      }
      
      let query = _db.select().from(schema.products);
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const results = await query;
      
      if (filters.location) {
        const loc = `%${filters.location}%`;
        const matchingFactories = await _db.select({ id: schema.factories.id })
          .from(schema.factories)
          .where(like(schema.factories.location, loc));
        const factoryIds = matchingFactories.map((f: any) => f.id);
        return results.filter((p: any) => factoryIds.includes(p.factoryId));
      }
      
      return results;
    } catch (e) {
      console.error("[Database] searchProductsAdvanced MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  let results = dbData.products || [];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter((p: any) => 
      p.nameAr?.toLowerCase().includes(q) ||
      p.nameEn?.toLowerCase().includes(q) ||
      p.nameZh?.toLowerCase().includes(q) ||
      p.descriptionAr?.toLowerCase().includes(q) ||
      p.descriptionEn?.toLowerCase().includes(q) ||
      p.descriptionZh?.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    results = results.filter((p: any) => p.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p: any) => p.minPrice >= filters.minPrice! * 100);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p: any) => p.minPrice <= filters.maxPrice! * 100);
  }

  if (filters.moq !== undefined) {
    results = results.filter((p: any) => p.minimumOrderQuantity <= filters.moq!);
  }

  if (filters.location) {
    const factories = dbData.factories || [];
    const factoryIds = factories
      .filter((f: any) => f.location?.toLowerCase().includes(filters.location!.toLowerCase()))
      .map((f: any) => f.id);
    results = results.filter((p: any) => factoryIds.includes(p.factoryId));
  }

  return results;
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
// IMPORT REQUEST OPERATIONS
// ============================================================================

export async function getImportRequestsByBuyer(buyerId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.importRequests).where(eq(schema.importRequests.buyerId, buyerId));
    } catch (e) {
      console.error("[Database] getImportRequestsByBuyer MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.importRequests || []).filter((i: any) => i.buyerId === buyerId);
}

export async function getImportRequestsByFactory(factoryId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.importRequests).where(eq(schema.importRequests.factoryId, factoryId));
    } catch (e) {
      console.error("[Database] getImportRequestsByFactory MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.importRequests || []).filter((i: any) => i.factoryId === factoryId);
}

export async function getImportRequestById(id: number) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.importRequests).where(eq(schema.importRequests.id, id)).limit(1);
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getImportRequestById MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.importRequests || []).find((i: any) => i.id === id) || null;
}

export async function createImportRequest(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.importRequests).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createImportRequest MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newRequest = {
    id: (dbData.importRequests?.length > 0 ? Math.max(...dbData.importRequests.map((i: any) => i.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.importRequests = dbData.importRequests || [];
  dbData.importRequests.push(newRequest);
  writeJsonDb(dbData);
  return newRequest;
}

export async function updateImportRequest(id: number, data: any) {
  if (!isJsonMode && _db) {
    try {
      await _db.update(schema.importRequests).set({ ...data, updatedAt: new Date() }).where(eq(schema.importRequests.id, id));
      return { id, ...data };
    } catch (e) {
      console.error("[Database] updateImportRequest MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const index = dbData.importRequests.findIndex((i: any) => i.id === id);
  if (index >= 0) {
    dbData.importRequests[index] = { ...dbData.importRequests[index], ...data, updatedAt: new Date().toISOString() };
    writeJsonDb(dbData);
    return dbData.importRequests[index];
  }
  return null;
}

// ============================================================================
// QUOTE OPERATIONS
// ============================================================================

export async function createQuote(data: any) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.insert(schema.quotes).values(data);
      return { id: result.insertId, ...data };
    } catch (e) {
      console.error("[Database] createQuote MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  const newQuote = {
    id: (dbData.quotes?.length > 0 ? Math.max(...dbData.quotes.map((q: any) => q.id)) : 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbData.quotes = dbData.quotes || [];
  dbData.quotes.push(newQuote);
  writeJsonDb(dbData);
  return newQuote;
}

export async function getQuotesByRequest(requestId: number) {
  if (!isJsonMode && _db) {
    try {
      return await _db.select().from(schema.quotes).where(eq(schema.quotes.requestId, requestId));
    } catch (e) {
      console.error("[Database] getQuotesByRequest MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.quotes || []).filter((q: any) => q.requestId === requestId);
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

export async function getOrderById(orderId: number) {
  if (!isJsonMode && _db) {
    try {
      const result = await _db.select().from(schema.orders).where(eq(schema.orders.id, orderId));
      return result[0] || null;
    } catch (e) {
      console.error("[Database] getOrderById MySQL error:", e);
    }
  }

  const dbData = readJsonDb();
  return (dbData.orders || []).find((o: any) => o.id === orderId) || null;
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
