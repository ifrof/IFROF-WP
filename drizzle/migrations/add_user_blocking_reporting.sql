-- Add user blocking and reporting system
CREATE TABLE IF NOT EXISTS `user_blocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `blockerId` INT NOT NULL,
  `blockedId` INT NOT NULL,
  `reason` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`blockerId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`blockedId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `user_blocks_unique` (`blockerId`, `blockedId`),
  INDEX `user_blocks_blocker_idx` (`blockerId`),
  INDEX `user_blocks_blocked_idx` (`blockedId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reporterId` INT NOT NULL,
  `reportedId` INT NOT NULL,
  `reportType` ENUM('spam', 'harassment', 'fraud', 'inappropriate', 'other') NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending' NOT NULL,
  `adminNotes` TEXT,
  `reviewedBy` INT,
  `reviewedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reportedId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `user_reports_reporter_idx` (`reporterId`),
  INDEX `user_reports_reported_idx` (`reportedId`),
  INDEX `user_reports_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add blocked status to users table
ALTER TABLE `users` ADD COLUMN `isBlocked` INT DEFAULT 0 NOT NULL AFTER `emailVerified`;
ALTER TABLE `users` ADD COLUMN `blockedReason` TEXT AFTER `isBlocked`;
ALTER TABLE `users` ADD COLUMN `blockedAt` TIMESTAMP AFTER `blockedReason`;
