-- ====================================================================
-- ADMS COVER MOBIL - Hostinger MySQL / MariaDB Database Schema
-- Website E-Commerce Sarung & Cover Mobil (Pemesanan via WhatsApp)
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- 1. Tabel Admins (Login Dashboard Admin dengan Password Hash)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Akun Default Super Admin (Password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO `admins` (`id`, `username`, `password_hash`, `name`, `email`, `role`)
VALUES ('adm-001', 'admin', '$2a$10$XQ.uJ6iY0k5VvIeqqK.5y.eWjGzU.tq5lQ94zV12qKjL6Hk/qXw3y', 'Administrator ADMS', 'admin@admscovermobil.com', 'superadmin')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- 2. Tabel Categories (Kategori Produk Cover Mobil)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` VARCHAR(500) NULL,
  `icon` VARCHAR(50) DEFAULT 'Shield',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Products (Katalog Produk & Harga Modal/Jual)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `description` LONGTEXT NULL,
  `short_description` TEXT NULL,
  `category_id` VARCHAR(64) NOT NULL,
  `cost_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,       -- Harga Modal (Admin Only)
  `selling_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,    -- Harga Jual Customer
  `discount_price` DECIMAL(12,2) NULL,                    -- Harga Promo / Diskon
  `stock` INT NOT NULL DEFAULT 0,
  `is_bestseller` TINYINT(1) DEFAULT 0,
  `is_promo` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `images` LONGTEXT NULL,                                -- JSON Array Foto
  `sizes` LONGTEXT NULL,                                 -- JSON Array Ukuran (M, L, XL, XXL, Custom)
  `colors` LONGTEXT NULL,                                -- JSON Array Warna
  `material` VARCHAR(255) NULL,
  `cover_type` VARCHAR(150) NULL,
  `vehicle_compatibility` TEXT NULL,                     -- Daftar mobil yang cocok
  `specifications` LONGTEXT NULL,                        -- JSON Data Spesifikasi
  `weight` INT DEFAULT 1500,                             -- Berat dalam gram
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `view_count` INT DEFAULT 0,
  `wa_click_count` INT DEFAULT 0,                        -- Tracking klik WA
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Settings (Pengaturan Nomor WhatsApp & Identitas Toko)
CREATE TABLE IF NOT EXISTS `settings` (
  `key_name` VARCHAR(100) NOT NULL PRIMARY KEY,
  `value_data` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Sales (Pencatatan Penjualan Manual & Laba)
CREATE TABLE IF NOT EXISTS `sales` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_whatsapp` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `cost_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `selling_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_revenue` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `profit` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `sale_date` DATE NOT NULL,
  `notes` TEXT NULL,
  `status` VARCHAR(50) DEFAULT 'Selesai',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Reviews (Ulasan & Testimoni Pelanggan)
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_location` VARCHAR(150) NULL,
  `car_model` VARCHAR(150) NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `is_verified_buyer` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
