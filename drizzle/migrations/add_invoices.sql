-- Add invoices table for invoice generation
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `invoiceNumber` VARCHAR(50) NOT NULL UNIQUE,
  `buyerId` INT NOT NULL,
  `factoryId` INT NOT NULL,
  `totalAmount` INT NOT NULL,
  `commission` INT NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'USD' NOT NULL,
  `status` ENUM('draft', 'issued', 'paid', 'cancelled') DEFAULT 'draft' NOT NULL,
  `issuedAt` TIMESTAMP,
  `paidAt` TIMESTAMP,
  `dueDate` TIMESTAMP,
  `notes` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`buyerId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`factoryId`) REFERENCES `factories`(`id`) ON DELETE CASCADE,
  INDEX `invoices_order_idx` (`orderId`),
  INDEX `invoices_buyer_idx` (`buyerId`),
  INDEX `invoices_factory_idx` (`factoryId`),
  INDEX `invoices_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add commission field to orders table
ALTER TABLE `orders` ADD COLUMN `commission` INT DEFAULT 0 AFTER `totalAmount`;
