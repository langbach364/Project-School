USE SHOP;

DELIMITER $

-- Trigger cho INSERT
CREATE TRIGGER after_coupon_insert
AFTER INSERT ON Coupons
FOR EACH ROW
BEGIN
    INSERT INTO total_coupons (brand_name, category_name, coupon_quantity)
    VALUES (NEW.brand_name, NEW.category_name, 1)
    ON DUPLICATE KEY UPDATE coupon_quantity = coupon_quantity + 1;
END;$

-- Trigger cho DELETE
CREATE TRIGGER after_coupon_delete
AFTER DELETE ON Coupons
FOR EACH ROW
BEGIN
    UPDATE total_coupons
    SET coupon_quantity = coupon_quantity - 1
    WHERE brand_name = OLD.brand_name AND category_name = OLD.category_name;
    
    DELETE FROM total_coupons
    WHERE brand_name = OLD.brand_name AND category_name = OLD.category_name AND coupon_quantity <= 0;
END;$

-- Trigger cho UPDATE
CREATE TRIGGER after_coupon_update
BEFORE UPDATE ON Coupons
FOR EACH ROW
BEGIN
    -- Kiểm tra và thêm category_name mới vào Define_categories nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM Define_categories WHERE category_name = NEW.category_name) THEN
        INSERT INTO Define_categories (category_name) VALUES (NEW.category_name);
    END IF;

    -- Kiểm tra và thêm brand_name mới vào Brands nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM Brands WHERE brand_name = NEW.brand_name) THEN
        INSERT INTO Brands (brand_name) VALUES (NEW.brand_name);
    END IF;

    IF OLD.brand_name != NEW.brand_name OR OLD.category_name != NEW.category_name THEN
        -- Giảm số lượng ở bản ghi cũ
        UPDATE total_coupons
        SET coupon_quantity = coupon_quantity - 1
        WHERE brand_name = OLD.brand_name AND category_name = OLD.category_name;
        
        -- Tăng số lượng ở bản ghi mới
        INSERT INTO total_coupons (brand_name, category_name, coupon_quantity)
        VALUES (NEW.brand_name, NEW.category_name, 1)
        ON DUPLICATE KEY UPDATE coupon_quantity = coupon_quantity + 1;
        
        -- Xóa bản ghi cũ nếu số lượng = 0
        DELETE FROM total_coupons
        WHERE brand_name = OLD.brand_name AND category_name = OLD.category_name AND coupon_quantity <= 0;
    END IF;
END;$

-- Trigger để tự động tạo mã coupon_id cho bảng Coupons
CREATE TRIGGER before_coupon_insert
BEFORE INSERT ON Coupons
FOR EACH ROW
BEGIN
    DECLARE unique_id BOOLEAN DEFAULT FALSE;
    DECLARE new_coupon_id VARCHAR(100);

    -- Kiểm tra và thêm category_name vào Define_categories nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM Define_categories WHERE category_name = NEW.category_name) THEN
        INSERT INTO Define_categories (category_name) VALUES (NEW.category_name);
    END IF;

    -- Kiểm tra và thêm brand_name vào Brands nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM Brands WHERE brand_name = NEW.brand_name) THEN
        INSERT INTO Brands (brand_name) VALUES (NEW.brand_name);
    END IF;

    -- Tạo mã coupon_id duy nhất
    WHILE NOT unique_id DO
        SET new_coupon_id = CONCAT(
            LPAD(CONV(FLOOR(RAND() * 1000000), 10, 36), 6, '0')
        );

        -- Kiểm tra xem mã coupon_id đã tồn tại chưa
        IF NOT EXISTS (SELECT 1 FROM Coupons WHERE coupon_id = new_coupon_id) THEN
            SET unique_id = TRUE;
        END IF;
    END WHILE;

    SET NEW.coupon_id = new_coupon_id;
END;$

-- Trigger để tự động thêm category_name vào Define_categories nếu chưa tồn tại
CREATE TRIGGER before_product_insert_update
BEFORE INSERT ON Products
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Define_categories WHERE category_name = NEW.category) THEN
        INSERT INTO Define_categories (category_name) VALUES (NEW.category);
    END IF;
END;$

-- Trigger để tự động thêm category_name vào Define_categories nếu chưa tồn tại khi cập nhật
CREATE TRIGGER before_product_update
BEFORE UPDATE ON Products
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Define_categories WHERE category_name = NEW.category) THEN
        INSERT INTO Define_categories (category_name) VALUES (NEW.category);
    END IF;
END;$

-- Trigger để tự động tạo mã product_id cho bảng Products
CREATE TRIGGER before_product_insert
BEFORE INSERT ON Products
FOR EACH ROW
BEGIN
    DECLARE unique_id BOOLEAN DEFAULT FALSE;
    DECLARE new_product_id VARCHAR(100);

    WHILE NOT unique_id DO
        SET new_product_id = CONCAT(
            LPAD(CONV(FLOOR(RAND() * 1000000), 10, 36), 6, '0')
        );

        IF NOT EXISTS (SELECT 1 FROM Products WHERE product_id = new_product_id) THEN
            SET unique_id = TRUE;
        END IF;
    END WHILE;

    SET NEW.product_id = new_product_id;
END;$


-- Trigger để tự động thêm brand_name vào Brands nếu chưa tồn tại khi cập nhật
CREATE TRIGGER before_product_insert_update_brand
BEFORE INSERT ON Products
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Brands WHERE brand_name = NEW.brand) THEN
        INSERT INTO Brands (brand_name) VALUES (NEW.brand);
    END IF;
END;$

CREATE TRIGGER before_product_update_brand
BEFORE UPDATE ON Products
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Brands WHERE brand_name = NEW.brand) THEN
        INSERT INTO Brands (brand_name) VALUES (NEW.brand);
    END IF;
END;$

-- Trigger cho bảng Users
-- Trigger khi thêm mới user
CREATE TRIGGER insert_user_info
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
    INSERT INTO Infomation (user_id, username, number_phone, email, created_at)
    VALUES (NEW.user_id, NEW.username, NEW.number_phone, NEW.email, NOW());
END;$

DELIMITER ;
