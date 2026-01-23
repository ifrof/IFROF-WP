-- Add shipping details and tracking fields to orders table
ALTER TABLE `orders` ADD COLUMN `shippingDetails` TEXT AFTER `shippingAddress`;
ALTER TABLE `orders` ADD COLUMN `trackingNumber` VARCHAR(100) AFTER `shippingDetails`;
ALTER TABLE `orders` ADD COLUMN `carrier` VARCHAR(100) AFTER `trackingNumber`;
ALTER TABLE `orders` ADD COLUMN `estimatedDelivery` TIMESTAMP AFTER `carrier`;

-- Add order status history table for tracking status updates
CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
  `notes` TEXT,
  `updatedBy` INT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `order_status_history_order_idx` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
