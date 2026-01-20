import { getDb } from "../server/db";
import { blogPosts, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const articles = [
  {
    title: "How to Identify Real Factories vs Trading Companies in China",
    slug: "how-to-identify-real-factories",
    content: "# How to Identify Real Factories vs Trading Companies in China\n\nWhen sourcing from China, one of the most critical decisions is determining whether you're dealing with a real factory or a trading company...",
    excerpt: "Learn the key differences between real factories and trading companies. Discover red flags and green flags that will help you make the right decision.",
    category: "Supplier Verification",
    tags: JSON.stringify(["factories", "trading", "verification", "china"]),
    featured: 1,
  },
  {
    title: "Top 10 Supplier Verification Tips That Save Money",
    slug: "top-10-supplier-verification-tips",
    content: "# Top 10 Supplier Verification Tips That Save Money\n\nDiscover the most effective strategies used by professional sourcing agents to verify suppliers and avoid costly mistakes.",
    excerpt: "Discover the most effective strategies used by professional sourcing agents to verify suppliers and avoid costly mistakes.",
    category: "Tips & Tricks",
    tags: JSON.stringify(["verification", "tips", "suppliers", "sourcing"]),
    featured: 1,
  },
  {
    title: "Secure Payment Methods for Importing from China",
    slug: "secure-payment-methods-china",
    content: "# Secure Payment Methods for Importing from China\n\nDiscover the safest payment methods when buying from Chinese suppliers. Learn about escrow, trade assurance, and payment protection strategies.",
    excerpt: "Discover the safest payment methods when buying from Chinese suppliers. Learn about escrow, trade assurance, and payment protection strategies.",
    category: "Payment & Finance",
    tags: JSON.stringify(["payment", "security", "escrow", "finance"]),
    featured: 1,
  },
  {
    title: "Complete Guide to Shipping from China",
    slug: "complete-guide-shipping-china",
    content: "# Complete Guide to Shipping from China\n\nMaster the shipping process from Chinese factories. Learn about different shipping methods, costs, timelines, and how to track your shipment.",
    excerpt: "Master the shipping process from Chinese factories. Learn about different shipping methods, costs, timelines, and how to track your shipment.",
    category: "Shipping & Logistics",
    tags: JSON.stringify(["shipping", "logistics", "costs", "tracking"]),
    featured: 1,
  }
];

import fs from "fs";
import path from "path";

async function seed() {
  console.log("🌱 Starting seed...");
  
  const JSON_DB_PATH = path.join(process.cwd(), "local_db.json");
  let dbData = { users: [], blogPosts: [] };
  
  if (fs.existsSync(JSON_DB_PATH)) {
    dbData = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
  }
  
  if (!dbData.blogPosts) dbData.blogPosts = [];
  if (!dbData.users) dbData.users = [];

  // 1. Get or create an admin user
  let adminUser = dbData.users.find(u => u.role === "admin");
  let authorId;

  if (!adminUser) {
    console.log("Creating admin user...");
    adminUser = {
      id: dbData.users.length + 1,
      openId: "admin-system",
      name: "System Admin",
      email: "admin@ifrof.com",
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    dbData.users.push(adminUser);
    authorId = adminUser.id;
  } else {
    authorId = adminUser.id;
  }

  console.log(`Using authorId: ${authorId}`);

  // 2. Insert articles
  for (const article of articles) {
    const existing = dbData.blogPosts.find(p => p.slug === article.slug);
    
    if (!existing) {
      dbData.blogPosts.push({
        id: dbData.blogPosts.length + 1,
        ...article,
        authorId,
        published: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Inserted: ${article.title}`);
    } else {
      console.log(`⏩ Skipping (already exists): ${article.title}`);
    }
  }

  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(dbData, null, 2));
  console.log("✨ Seed completed!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
