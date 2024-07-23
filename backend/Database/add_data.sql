SET NAMES utf8mb4;
USE SHOP;

-- Cập nhật Define_categories
INSERT INTO Define_categories (category_name) VALUES 
('Điện thoại'), ('Máy tính'), ('Máy tính bảng'), ('Phụ kiện'), 
('Thiết bị âm thanh'), ('Thiết bị thông minh'), ('Màn hình'), ('Máy in');

-- Cập nhật Brands
INSERT INTO Brands (brand_name) VALUES 
('Apple'), ('Samsung'), ('Sony'), ('Dell'), ('HP'), 
('Lenovo'), ('Asus'), ('Acer'), ('Xiaomi');

-- Cập nhật Coupons
INSERT INTO Coupons (brand_name, category_name, discount) VALUES
( 'Apple', 'Điện thoại', 10),
( 'Apple', 'Điện thoại', 15),
('Samsung', 'Máy tính bảng', 15),
('Samsung', 'Máy tính bảng', 20),
('Sony', 'Thiết bị âm thanh', 20),
('Sony', 'Thiết bị âm thanh', 25),
('Dell', 'Máy tính', 12),
('Dell', 'Máy tính', 18),
('HP001', 'HP', 'Máy in', 18),
('HP002', 'HP', 'Máy in', 22),
('APPLE003', 'Apple', 'Điện thoại', 12)

-- Cập nhật Products
INSERT INTO Products (product_id, product_name, description, price, category, brand, quantity, created_at) VALUES 
('P001', 'iPhone 13', 'Điện thoại thông minh mới nhất từ Apple', 25000000, 'Điện thoại', 'Apple', 100, NOW()),
('P002', 'Samsung Galaxy Tab S7', 'Máy tính bảng cao cấp', 15000000, 'Máy tính bảng', 'Samsung', 80, NOW()),
('P003', 'Sony WH-1000XM4', 'Tai nghe chống ồn cao cấp', 8000000, 'Thiết bị âm thanh', 'Sony', 120, NOW()),
('P004', 'Dell XPS 13', 'Laptop mỏng nhẹ cao cấp', 30000000, 'Máy tính', 'Dell', 60, NOW()),
('P005', 'HP LaserJet Pro', 'Máy in laser chất lượng cao', 5000000, 'Máy in', 'HP', 40, NOW());
