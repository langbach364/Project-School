CREATE DATABASE SHOP;

CREATE TABLE Users ( -- Bảng người dùng
    user_id     INT PRIMARY KEY, -- ID người dùng
    username    VARCHAR(500) UNIQUE, -- Tên đăng nhập
    password    VARCHAR(500), -- Mật khẩu
    email       VARCHAR(500) UNIQUE, -- Email
    full_name   VARCHAR(500), -- Họ và tên
    created_at  DATETIME -- Ngày tạo
);

CREATE TABLE Define_categories ( -- Bảng định nghĩa danh mục
    categories_id   INT PRIMARY KEY, -- ID danh mục
    categories_name VARCHAR(500) -- Tên danh mục
);

CREATE TABLE Products ( -- Bảng sản phẩm
    product_id   VARCHAR(500) PRIMARY KEY, -- ID sản phẩm
    product_name VARCHAR(500), -- Tên sản phẩm
    description  VARCHAR(500), -- Mô tả
    price        INT, -- Giá
    quantity     INT, -- Số lượng
    created_at   DATETIME, -- Ngày tạo
    category_id  INT, -- ID danh mục
    user_id      INT, -- ID người dùng
    FOREIGN KEY (category_id) REFERENCES Define_categories(categories_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Defind_actives ( -- Bảng định nghĩa trạng thái
    is_active   INT PRIMARY KEY, -- ID trạng thái
    active_name VARCHAR(500) -- Tên trạng thái
);

CREATE TABLE Buy_oders ( -- Bảng đơn mua hàng
    order_id     VARCHAR(500) PRIMARY KEY, -- ID đơn hàng
    order_date   DATETIME, -- Ngày đặt hàng
    total_amount INT, -- Tổng số tiền
    is_active    INT, -- ID trạng thái
    user_id      INT, -- ID người dùng
    product_id   VARCHAR(500), -- ID sản phẩm
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (is_active) REFERENCES Defind_actives(is_active)
);

CREATE TABLE Sale_oders ( -- Bảng đơn bán hàng
    order_id     VARCHAR(500) PRIMARY KEY, -- ID đơn hàng
    order_date   DATETIME, -- Ngày đặt hàng
    total_amount INT, -- Tổng số tiền
    is_active    INT, -- ID trạng thái
    user_id      INT, -- ID người dùng
    product_id   VARCHAR(500), -- ID sản phẩm
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (is_active) REFERENCES Defind_actives(is_active)
);

CREATE TABLE Product_ratings ( -- Bảng đánh giá sản phẩm
    product_id VARCHAR(500), -- ID sản phẩm
    user_id    INT, -- ID người dùng
    rating     FLOAT, -- Đánh giá
    comment    VARCHAR(500), -- Bình luận
    created_at DATETIME, -- Ngày tạo
    PRIMARY KEY (product_id, user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

SELECT * FROM Users;

DELETE FROM Users;
