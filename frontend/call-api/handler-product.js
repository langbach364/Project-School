import products, { updateProducts } from '../javascript/list-object/list_products.js';

export function handleProducts() {
    return new Promise((resolve, reject) => {
        var namelist = "Products";
        var data = {
            nameList: namelist,
            attribute: "*"
        };

        axios.post("https://api.langbach.io.vn/get_data", JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            var responseData = response.data;
            console.log("Phản hồi từ API sản phẩm:", responseData);
            if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
                updateProducts(responseData.data.data);
                console.log("Dữ liệu sản phẩm mới đã được cập nhật:", products);
                resolve(products);
            } else {
                console.error("Cấu trúc dữ liệu sản phẩm không đúng:", responseData);
                reject("Cấu trúc dữ liệu không đúng");
            }
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
            reject(error);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleProducts().then(() => {
        // Kích hoạt sự kiện để thông báo rằng sản phẩm đã được cập nhật
        window.dispatchEvent(new CustomEvent('productsLoaded'));
    }).catch(error => {
        console.error("Không thể tải sản phẩm:", error);
    });
});
