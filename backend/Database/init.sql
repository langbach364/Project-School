CREATE DATABASE IF NOT EXISTS SHOP;
USE SHOP;

CREATE TABLE IF NOT EXISTS Users (
    user_id     INT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(100) UNIQUE,
    password    VARCHAR(1000),
    email       VARCHAR(100) UNIQUE,
    number_phone INT UNIQUE
);

CREATE TABLE IF NOT EXISTS Infomation (
    user_id     INT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(100) UNIQUE,
    number_phone INT,
    email       VARCHAR(100) UNIQUE,
    full_name   VARCHAR(100),
    created_at  DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Define_categories (
    category_name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS Brands (
    brand_name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS Defind_actives (
    is_active   INT PRIMARY KEY,
    active_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Coupons (
    coupon_id VARCHAR(100) PRIMARY KEY,
    brand_name VARCHAR(100),
    category_name VARCHAR(100),
    discount INT,
    FOREIGN KEY (category_name) REFERENCES Define_categories(category_name) ON DELETE CASCADE,
    FOREIGN KEY (brand_name) REFERENCES Brands(brand_name)
);

CREATE TABLE IF NOT EXISTS total_coupons(
    brand_name VARCHAR(100) PRIMARY KEY,
    category_name VARCHAR(100),
    coupon_quantity INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Products (
    product_id   VARCHAR(100) PRIMARY KEY,
    product_name VARCHAR(100),
    description  VARCHAR(100),
    price        INT,
    category     VARCHAR(100),
    brand        VARCHAR(100),
    quantity     INT,
    created_at   DATETIME,
    image        VARCHAR(100),
    FOREIGN KEY (category) REFERENCES Define_categories(category_name) ON DELETE CASCADE,
    FOREIGN KEY (brand) REFERENCES Brands(brand_name)
);

CREATE TABLE IF NOT EXISTS Products_evaluation (
    product_id VARCHAR(100) PRIMARY KEY,
    evaluation FLOAT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE IF NOT EXISTS Buy_oders (
    order_id     VARCHAR(100) PRIMARY KEY,
    order_date   DATETIME,
    total_amount INT,
    is_active    INT,
    user_id      INT,
    product_id   VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (is_active) REFERENCES Defind_actives(is_active)
);

CREATE TABLE IF NOT EXISTS Product_ratings (
    product_id VARCHAR(100),
    user_id    INT,
    rating     FLOAT,
    comment    VARCHAR(100),
    created_at DATETIME,
    PRIMARY KEY (product_id, user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE USER IF NOT EXISTS 'root'@'172.21.0.7' IDENTIFIED BY '@ztegc4df9f4e';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'172.21.0.7' WITH GRANT OPTION;
