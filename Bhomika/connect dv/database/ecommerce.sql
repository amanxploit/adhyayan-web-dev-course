-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    category VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 4.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample products
INSERT INTO products (name, price, description, image, category, rating) VALUES
('Wireless Headphones', 49.99, 'Premium wireless headphones with noise cancellation, 30hr battery life', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Electronics', 4.5),
('Modern Sneakers', 79.99, 'Comfortable running sneakers with breathable mesh', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Shoes', 4.8),
('Classic Watch', 199.99, 'Elegant stainless steel watch with Japanese movement', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Accessories', 4.7),
('Leather Jacket', 129.99, 'Genuine leather jacket for men, perfect for all seasons', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'Fashion', 4.3),
('Smartphone', 699.99, 'Latest 5G smartphone with 108MP camera and 120Hz display', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'Electronics', 4.9),
('Sunglasses', 29.99, 'UV protection polarized sunglasses with premium frame', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 'Accessories', 4.4),
('Laptop Backpack', 59.99, 'Waterproof laptop backpack with USB charging port', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'Fashion', 4.6),
('Running Shoes', 89.99, 'Lightweight athletic shoes with cushioning technology', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Shoes', 4.7);