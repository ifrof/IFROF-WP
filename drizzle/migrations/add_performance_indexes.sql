-- Add indexes for performance optimization
-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_factory_id ON products(factoryId);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(createdAt);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(userId);
CREATE INDEX IF NOT EXISTS idx_orders_factory_id ON orders(factoryId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(createdAt);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Inquiries table indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer_id ON inquiries(buyerId);
CREATE INDEX IF NOT EXISTS idx_inquiries_factory_id ON inquiries(factoryId);
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(productId);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_inquiry_id ON messages(inquiryId);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(senderId);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiverId);

-- Factories table indexes
CREATE INDEX IF NOT EXISTS idx_factories_user_id ON factories(userId);
CREATE INDEX IF NOT EXISTS idx_factories_verification_status ON factories(verificationStatus);

-- Blog posts table indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blogPosts(authorId);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blogPosts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blogPosts(published);

-- Cart items table indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cartItems(userId);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cartItems(productId);
