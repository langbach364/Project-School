CREATE DATABASE IF NOT EXISTS SHOP;
USE SHOP;

CREATE TABLE IF NOT EXISTS Users (
    user_id     INT PRIMARY KEY,
    username    VARCHAR(500) UNIQUE,
    password    VARCHAR(500),
    email       VARCHAR(500) UNIQUE,
    full_name   VARCHAR(500),
    created_at  DATETIME
);

CREATE TABLE IF NOT EXISTS Define_categories (
    categories_id   INT PRIMARY KEY,
    categories_name VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Products (
    product_id   VARCHAR(500) PRIMARY KEY,
    product_name VARCHAR(500),
    description  VARCHAR(500),
    price        INT,
    quantity     INT,
    created_at   DATETIME,
    category_id  INT,
    user_id      INT,
    FOREIGN KEY (category_id) REFERENCES Define_categories(categories_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Defind_actives (
    is_active   INT PRIMARY KEY,
    active_name VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Buy_oders (
    order_id     VARCHAR(500) PRIMARY KEY,
    order_date   DATETIME,
    total_amount INT,
    is_active    INT,
    user_id      INT,
    product_id   VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (is_active) REFERENCES Defind_actives(is_active)
);

CREATE TABLE IF NOT EXISTS Sale_oders (
    order_id     VARCHAR(500) PRIMARY KEY,
    order_date   DATETIME,
    total_amount INT,
    is_active    INT,
    user_id      INT,
    product_id   VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (is_active) REFERENCES Defind_actives(is_active)
);

CREATE TABLE IF NOT EXISTS Product_ratings (
    product_id VARCHAR(500),
    user_id    INT,
    rating     FLOAT,
    comment    VARCHAR(500),
    created_at DATETIME,
    PRIMARY KEY (product_id, user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);