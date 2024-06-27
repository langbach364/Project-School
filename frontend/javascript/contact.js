import products from './list_products.js';

document.addEventListener('DOMContentLoaded', function() {
    const discountSection = document.querySelector('.discount-section');

    // Tạo một đối tượng để lưu các chương trình giảm giá
    const discounts = {};

    // Hàm tạo mã giảm giá ngẫu nhiên
    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Duyệt qua các sản phẩm và tạo các chương trình giảm giá cho các thương hiệu
    products.forEach((product, key) => {
        const brand = product.brand;
        const category = product.category;
        const price = product.price;

        // Tạo khóa cho thương hiệu
        if (!discounts[brand]) {
            discounts[brand] = {};
        }

        // Tạo khóa cho danh mục
        if (!discounts[brand][category]) {
            discounts[brand][category] = {
                brand: brand,
                category: category,
                ranges: []
            };
        }

        // Thêm các khoảng giá và chương trình giảm giá tương ứng
        if (price < 1000000) {
            discounts[brand][category].ranges.push({
                range: 'Dưới 1 triệu',
                discount: 'Giảm 10%',
                priceRange: 'under-1',
                codes: Array.from({ length: 20 }, () => generateRandomCode(8)) // Tạo 20 mã giảm giá ngẫu nhiên
            });
        } else if (price >= 1000000 && price < 5000000) {
            discounts[brand][category].ranges.push({
                range: 'Từ 1 triệu đến 5 triệu',
                discount: 'Giảm 15%',
                priceRange: '1-5',
                codes: Array.from({ length: 20 }, () => generateRandomCode(8)) // Tạo 20 mã giảm giá ngẫu nhiên
            });
        } else if (price >= 5000000 && price < 10000000) {
            discounts[brand][category].ranges.push({
                range: 'Từ 5 triệu đến 10 triệu',
                discount: 'Giảm 20%',
                priceRange: '5-10',
                codes: Array.from({ length: 20 }, () => generateRandomCode(8)) // Tạo 20 mã giảm giá ngẫu nhiên
            });
        } else {
            discounts[brand][category].ranges.push({
                range: 'Trên 10 triệu',
                discount: 'Giảm 25%',
                priceRange: 'above-10',
                codes: Array.from({ length: 20 }, () => generateRandomCode(8)) // Tạo 20 mã giảm giá ngẫu nhiên
            });
        }
    });

    // Hiển thị các chương trình giảm giá trên trang
    const discountBrandsContainer = document.createElement('div');
    discountBrandsContainer.classList.add('discount-brands-container');
    discountSection.appendChild(discountBrandsContainer);

    for (const brand in discounts) {
        const discountBrand = document.createElement('div');
        discountBrand.classList.add('discount-brand');
        discountBrand.innerHTML = `<h3>${brand}</h3>`;

        const discountCategoriesContainer = document.createElement('div');
        discountCategoriesContainer.classList.add('discount-categories-container');

        for (const category in discounts[brand]) {
            const discount = discounts[brand][category];
            const discountCategory = document.createElement('div');
            discountCategory.classList.add('discount-category');
            discountCategory.innerHTML = `<h4>${discount.category}</h4>`;

            const discountCardsContainer = document.createElement('div');
            discountCardsContainer.classList.add('discount-cards-container');

            // Sử dụng Set để theo dõi các mức giá đã hiển thị
            const displayedPriceRanges = new Set();

            discount.ranges.forEach(range => {
                if (!displayedPriceRanges.has(range.priceRange)) { // Chỉ hiển thị nếu mức giá chưa được hiển thị
                    const discountCard = document.createElement('div');
                    discountCard.classList.add('discount-card');
                    discountCard.innerHTML = `
                        <h4>${range.range}</h4>
                        <p>${range.discount}</p>
                        <button class="buy-now" onclick="redirectToProduct('${discount.brand}', '${range.priceRange}')">Mua Ngay</button>
                        <div class="discount-codes">
                            <h5>Mã giảm giá:</h5>
                            <ul>
                                ${range.codes.map(code => `<li>${code}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                    discountCardsContainer.appendChild(discountCard);
                    displayedPriceRanges.add(range.priceRange); // Đánh dấu mức giá đã được hiển thị
                }
            });

            discountCategory.appendChild(discountCardsContainer);
            discountCategoriesContainer.appendChild(discountCategory);

            // Thêm sự kiện click để mở/đóng danh mục
            discountCategory.querySelector('h4').addEventListener('click', function() {
                // Đóng tất cả các danh mục khác trong cùng thương hiệu
                discountCategoriesContainer.querySelectorAll('.discount-category').forEach(category => {
                    if (category !== discountCategory) {
                        category.classList.remove('active');
                    }
                });
                // Mở hoặc đóng danh mục hiện tại
                discountCategory.classList.toggle('active');
            });
        }

        discountBrand.appendChild(discountCategoriesContainer);
        discountBrandsContainer.appendChild(discountBrand);

        // Thêm sự kiện click để mở/đóng thương hiệu
        discountBrand.querySelector('h3').addEventListener('click', function() {
            // Đóng tất cả các thương hiệu khác
            document.querySelectorAll('.discount-brand').forEach(brand => {
                if (brand !== discountBrand) {
                    brand.classList.remove('active');
                }
            });
            // Mở hoặc đóng thương hiệu hiện tại
            discountBrand.classList.toggle('active');
        });
    }
});

function redirectToProduct(brand, priceRange) {
    const url = new URL('./product.html', window.location.origin);
    url.searchParams.append('brand', brand);
    url.searchParams.append('priceRange', priceRange);
    window.location.href = url;
}
