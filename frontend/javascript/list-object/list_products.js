var products = new Map();

export function updateProducts(data) {
    products.clear();
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item && item.product_id) {
                products.set(item.product_id, {
                    name: item.product_name,
                    description: item.description,
                    price: item.price,
                    category: item.category,
                    brand: item.brand,
                    quantity: item.quantity,
                    image: "/javascript/" + item.image,
                });
            }
        });
        console.log("Sản phẩm đã được cập nhật:", products);
        window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
    } else {
        console.error("Dữ liệu không phải là mảng:", data);
    }
}

export default products;
