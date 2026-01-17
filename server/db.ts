import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Inquiry queries
export async function getInquiriesByBuyer(buyerId: number) {
  const db = await getDb();
  if (!db) return [];
  const { inquiries } = await import('../drizzle/schema');
  return db.select().from(inquiries).where(eq(inquiries.buyerId, buyerId));
}

export async function createInquiry(inquiry: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { inquiries } = await import('../drizzle/schema');
  return db.insert(inquiries).values(inquiry);
}

export async function updateInquiry(inquiryId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { inquiries } = await import('../drizzle/schema');
  return db.update(inquiries).set(updates).where(eq(inquiries.id, inquiryId));
}

// Factory queries
export async function getFactories() {
  const db = await getDb();
  if (!db) return [];
  const { factories } = await import('../drizzle/schema');
  return db.select().from(factories);
}

export async function getFactoryById(factoryId: number) {
  const db = await getDb();
  if (!db) return null;
  const { factories } = await import('../drizzle/schema');
  const result = await db.select().from(factories).where(eq(factories.id, factoryId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Product queries
export async function getProductsByFactory(factoryId: number) {
  const db = await getDb();
  if (!db) return [];
  const { products } = await import('../drizzle/schema');
  return db.select().from(products).where(eq(products.factoryId, factoryId));
}

// Order queries
export async function getOrdersByBuyer(buyerId: number) {
  const db = await getDb();
  if (!db) return [];
  const { orders } = await import('../drizzle/schema');
  return db.select().from(orders).where(eq(orders.buyerId, buyerId));
}

// Factory queries
export async function getAllFactories() {
  const db = await getDb();
  if (!db) return [];
  const { factories } = await import('../drizzle/schema');
  return db.select().from(factories);
}

export async function searchFactories(query: string) {
  const db = await getDb();
  if (!db) return [];
  const { factories } = await import('../drizzle/schema');
  const { like } = await import('drizzle-orm');
  return db.select().from(factories).where(like(factories.name, `%${query}%`));
}

export async function createFactory(factory: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { factories } = await import('../drizzle/schema');
  return db.insert(factories).values(factory);
}

export async function updateFactory(factoryId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { factories } = await import('../drizzle/schema');
  return db.update(factories).set(updates).where(eq(factories.id, factoryId));
}

// Product queries
export async function getProductById(productId: number) {
  const db = await getDb();
  if (!db) return null;
  const { products } = await import('../drizzle/schema');
  const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function searchProducts(query: string) {
  const db = await getDb();
  if (!db) return [];
  const { products } = await import('../drizzle/schema');
  const { like } = await import('drizzle-orm');
  return db.select().from(products).where(like(products.name, `%${query}%`));
}

export async function createProduct(product: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { products } = await import('../drizzle/schema');
  return db.insert(products).values(product);
}

export async function updateProduct(productId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { products } = await import('../drizzle/schema');
  return db.update(products).set(updates).where(eq(products.id, productId));
}

// Inquiry queries
export async function getInquiriesByFactory(factoryId: number) {
  const db = await getDb();
  if (!db) return [];
  const { inquiries } = await import('../drizzle/schema');
  return db.select().from(inquiries).where(eq(inquiries.factoryId, factoryId));
}

// Forum queries
export async function getForumPosts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  const { forumPosts } = await import('../drizzle/schema');
  return db.select().from(forumPosts).limit(limit).offset(offset);
}

export async function getForumPostById(postId: number) {
  const db = await getDb();
  if (!db) return null;
  const { forumPosts } = await import('../drizzle/schema');
  const result = await db.select().from(forumPosts).where(eq(forumPosts.id, postId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateForumPost(postId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { forumPosts } = await import('../drizzle/schema');
  return db.update(forumPosts).set(updates).where(eq(forumPosts.id, postId));
}

export async function getForumAnswersByPost(postId: number) {
  const db = await getDb();
  if (!db) return [];
  const { forumAnswers } = await import('../drizzle/schema');
  return db.select().from(forumAnswers).where(eq(forumAnswers.postId, postId));
}

export async function createForumPost(post: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { forumPosts } = await import('../drizzle/schema');
  return db.insert(forumPosts).values(post);
}

export async function createForumAnswer(answer: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { forumAnswers } = await import('../drizzle/schema');
  return db.insert(forumAnswers).values(answer);
}

export async function updateForumAnswer(answerId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { forumAnswers } = await import('../drizzle/schema');
  return db.update(forumAnswers).set(updates).where(eq(forumAnswers.id, answerId));
}

// Blog queries
export async function getBlogPosts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  const { blogPosts } = await import('../drizzle/schema');
  return db.select().from(blogPosts).limit(limit).offset(offset);
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const { blogPosts } = await import('../drizzle/schema');
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createBlogPost(post: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { blogPosts } = await import('../drizzle/schema');
  return db.insert(blogPosts).values(post);
}

export async function updateBlogPost(postId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { blogPosts } = await import('../drizzle/schema');
  return db.update(blogPosts).set(updates).where(eq(blogPosts.id, postId));
}
