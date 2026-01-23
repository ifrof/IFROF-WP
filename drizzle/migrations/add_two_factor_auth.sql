-- Add two-factor authentication fields to users table
ALTER TABLE `users` ADD COLUMN `twoFactorEnabled` INT DEFAULT 0 NOT NULL AFTER `emailVerified`;
ALTER TABLE `users` ADD COLUMN `twoFactorSecret` VARCHAR(255) AFTER `twoFactorEnabled`;
ALTER TABLE `users` ADD COLUMN `twoFactorBackupCodes` TEXT AFTER `twoFactorSecret`;
