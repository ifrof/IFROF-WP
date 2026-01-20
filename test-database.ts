/**
 * Database Operations Test Script
 * Tests all CRUD operations for each table
 */

import * as db from "./server/db";

async function testDatabaseOperations() {
  console.log("=".repeat(80));
  console.log("DATABASE OPERATIONS TEST");
  console.log("=".repeat(80));
  console.log();

  let passedTests = 0;
  let failedTests = 0;

  // Helper function to run tests
  async function runTest(name: string, testFn: () => Promise<void>) {
    try {
      await testFn();
      console.log(`✅ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.error(`   Error: ${error}`);
      failedTests++;
    }
  }

  // ============================================================================
  // USER OPERATIONS
  // ============================================================================
  console.log("Testing USER operations...");
  
  await runTest("Create/Upsert User", async () => {
    const user = await db.upsertUser({
      openId: "test_user_123",
      name: "Test User",
      email: "test@ifrof.com",
      role: "buyer",
    });
    if (!user || !user.id) throw new Error("User creation failed");
  });

  await runTest("Get User by OpenId", async () => {
    const user = await db.getUserByOpenId("test_user_123");
    if (!user) throw new Error("User not found");
  });

  await runTest("Get User by ID", async () => {
    const user = await db.getUserById(1);
    if (!user) throw new Error("User not found");
  });

  console.log();

  // ============================================================================
  // FACTORY OPERATIONS
  // ============================================================================
  console.log("Testing FACTORY operations...");

  await runTest("Create Factory", async () => {
    const factory = await db.createFactory({
      name: "Test Factory Ltd",
      description: "A test manufacturing facility",
      location: "Shenzhen, China",
      contactEmail: "factory@test.com",
      verificationStatus: "verified",
    });
    if (!factory || !factory.id) throw new Error("Factory creation failed");
  });

  await runTest("Get All Factories", async () => {
    const factories = await db.getAllFactories();
    if (!Array.isArray(factories)) throw new Error("Failed to get factories");
  });

  await runTest("Get Factory by ID", async () => {
    const factory = await db.getFactoryById(1);
    if (!factory) throw new Error("Factory not found");
  });

  await runTest("Search Factories", async () => {
    const results = await db.searchFactories("Test");
    if (!Array.isArray(results)) throw new Error("Search failed");
  });

  await runTest("Update Factory", async () => {
    const updated = await db.updateFactory(1, { rating: 5 });
    if (!updated) throw new Error("Factory update failed");
  });

  console.log();

  // ============================================================================
  // PRODUCT OPERATIONS
  // ============================================================================
  console.log("Testing PRODUCT operations...");

  await runTest("Create Product", async () => {
    const product = await db.createProduct({
      factoryId: 1,
      name: "Test Product",
      description: "A test product",
      category: "Electronics",
      basePrice: 9999,
      minimumOrderQuantity: 100,
    });
    if (!product || !product.id) throw new Error("Product creation failed");
  });

  await runTest("Get Product by ID", async () => {
    const product = await db.getProductById(1);
    if (!product) throw new Error("Product not found");
  });

  await runTest("Get Products by Factory", async () => {
    const products = await db.getProductsByFactory(1);
    if (!Array.isArray(products)) throw new Error("Failed to get products");
  });

  await runTest("Search Products", async () => {
    const results = await db.searchProducts("Test");
    if (!Array.isArray(results)) throw new Error("Search failed");
  });

  await runTest("Update Product", async () => {
    const updated = await db.updateProduct(1, { basePrice: 8999 });
    if (!updated) throw new Error("Product update failed");
  });

  console.log();

  // ============================================================================
  // INQUIRY OPERATIONS
  // ============================================================================
  console.log("Testing INQUIRY operations...");

  await runTest("Create Inquiry", async () => {
    const inquiry = await db.createInquiry({
      buyerId: 1,
      factoryId: 1,
      productId: 1,
      subject: "Product Inquiry",
      description: "Interested in bulk order",
      quantityRequired: 1000,
      status: "pending",
    });
    if (!inquiry || !inquiry.id) throw new Error("Inquiry creation failed");
  });

  await runTest("Get Inquiries by Buyer", async () => {
    const inquiries = await db.getInquiriesByBuyer(1);
    if (!Array.isArray(inquiries)) throw new Error("Failed to get inquiries");
  });

  await runTest("Get Inquiries by Factory", async () => {
    const inquiries = await db.getInquiriesByFactory(1);
    if (!Array.isArray(inquiries)) throw new Error("Failed to get inquiries");
  });

  await runTest("Update Inquiry", async () => {
    const updated = await db.updateInquiry(1, { status: "responded" });
    if (!updated) throw new Error("Inquiry update failed");
  });

  console.log();

  // ============================================================================
  // ORDER OPERATIONS
  // ============================================================================
  console.log("Testing ORDER operations...");

  await runTest("Create Order", async () => {
    const order = await db.createOrder({
      buyerId: 1,
      factoryId: 1,
      orderNumber: "ORD-TEST-001",
      items: JSON.stringify([{ productId: 1, quantity: 100, price: 9999 }]),
      totalAmount: 999900,
      status: "pending",
      paymentStatus: "pending",
    });
    if (!order || !order.id) throw new Error("Order creation failed");
  });

  await runTest("Get Orders by Buyer", async () => {
    const orders = await db.getOrdersByBuyer(1);
    if (!Array.isArray(orders)) throw new Error("Failed to get orders");
  });

  console.log();

  // ============================================================================
  // FORUM OPERATIONS
  // ============================================================================
  console.log("Testing FORUM operations...");

  await runTest("Create Forum Post", async () => {
    const post = await db.createForumPost({
      authorId: 1,
      title: "How to verify suppliers?",
      content: "What are the best practices for verifying suppliers?",
      category: "General",
      status: "open",
    });
    if (!post || !post.id) throw new Error("Forum post creation failed");
  });

  await runTest("Get Forum Posts", async () => {
    const posts = await db.getForumPosts(10, 0);
    if (!Array.isArray(posts)) throw new Error("Failed to get forum posts");
  });

  await runTest("Get Forum Post by ID", async () => {
    const post = await db.getForumPostById(1);
    if (!post) throw new Error("Forum post not found");
  });

  await runTest("Update Forum Post", async () => {
    const updated = await db.updateForumPost(1, { views: 10 });
    if (!updated) throw new Error("Forum post update failed");
  });

  await runTest("Create Forum Answer", async () => {
    const answer = await db.createForumAnswer({
      postId: 1,
      authorId: 1,
      content: "Here are some tips for verifying suppliers...",
    });
    if (!answer || !answer.id) throw new Error("Forum answer creation failed");
  });

  await runTest("Get Forum Answers by Post", async () => {
    const answers = await db.getForumAnswersByPost(1);
    if (!Array.isArray(answers)) throw new Error("Failed to get forum answers");
  });

  await runTest("Update Forum Answer", async () => {
    const updated = await db.updateForumAnswer(1, { votes: 5 });
    if (!updated) throw new Error("Forum answer update failed");
  });

  console.log();

  // ============================================================================
  // BLOG OPERATIONS
  // ============================================================================
  console.log("Testing BLOG operations...");

  await runTest("Create Blog Post", async () => {
    const post = await db.createBlogPost({
      title: "Guide to Importing from China",
      slug: "guide-importing-china",
      content: "This is a comprehensive guide...",
      excerpt: "Learn how to import from China",
      authorId: 1,
      category: "Guides",
      published: 1,
    });
    if (!post || !post.id) throw new Error("Blog post creation failed");
  });

  await runTest("Get Blog Posts", async () => {
    const posts = await db.getBlogPosts(10, 0);
    if (!Array.isArray(posts)) throw new Error("Failed to get blog posts");
  });

  await runTest("Get Blog Post by Slug", async () => {
    const post = await db.getBlogPostBySlug("guide-importing-china");
    if (!post) throw new Error("Blog post not found");
  });

  await runTest("Update Blog Post", async () => {
    const updated = await db.updateBlogPost(1, { featured: 1 });
    if (!updated) throw new Error("Blog post update failed");
  });

  console.log();

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log("=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total:  ${passedTests + failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  console.log("=".repeat(80));

  if (failedTests === 0) {
    console.log("\n🎉 All database operations are working correctly!");
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed. Please review the errors above.`);
  }
}

// Run tests
testDatabaseOperations().catch(console.error);
