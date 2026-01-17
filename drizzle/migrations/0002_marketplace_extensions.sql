-- Services table for marketplace
CREATE TABLE IF NOT EXISTS `services` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `factoryId` int NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `category` varchar(100),
  `tags` text,
  `specifications` text,
  `basePrice` int NOT NULL,
  `pricingTiers` text,
  `imageUrls` text,
  `featured` int DEFAULT 0,
  `active` int DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`factoryId`) REFERENCES `factories`(`id`)
);

-- Cart table for shopping cart
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `productId` int,
  `serviceId` int,
  `factoryId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `specifications` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`),
  FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`),
  FOREIGN KEY (`factoryId`) REFERENCES `factories`(`id`)
);

-- Reviews and ratings table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `factoryId` int NOT NULL,
  `orderId` int,
  `rating` int NOT NULL,
  `title` text,
  `comment` text,
  `verified` int DEFAULT 0,
  `helpful` int DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`factoryId`) REFERENCES `factories`(`id`),
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`)
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `type` enum('support', 'complaint', 'dispute') NOT NULL,
  `subject` text NOT NULL,
  `description` text,
  `status` enum('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  `priority` enum('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `relatedEntityId` int,
  `relatedEntityType` varchar(50),
  `assignedTo` int,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`)
);

-- Support ticket messages table
CREATE TABLE IF NOT EXISTS `support_messages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `ticketId` int NOT NULL,
  `userId` int NOT NULL,
  `message` text NOT NULL,
  `attachments` text,
  `isStaff` int DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticketId`) REFERENCES `support_tickets`(`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
);

-- KYC verification table
CREATE TABLE IF NOT EXISTS `kyc_verifications` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `type` enum('buyer', 'factory') NOT NULL,
  `status` enum('pending', 'approved', 'rejected', 'resubmit') DEFAULT 'pending',
  `businessName` text,
  `businessType` varchar(100),
  `registrationNumber` varchar(255),
  `taxId` varchar(255),
  `address` text,
  `documents` text,
  `notes` text,
  `reviewedBy` int,
  `reviewedAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`)
);

-- Static pages table
CREATE TABLE IF NOT EXISTS `static_pages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `slug` varchar(255) NOT NULL UNIQUE,
  `titleEn` text NOT NULL,
  `titleAr` text NOT NULL,
  `contentEn` text NOT NULL,
  `contentAr` text NOT NULL,
  `published` int DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
