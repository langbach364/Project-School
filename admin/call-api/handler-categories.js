export let categories = [];

export function updateCategories(newCategories) {
    categories = newCategories;
    console.log("Danh sách danh mục đã được cập nhật:", categories);
}

export function handleCategories() {
    return new Promise((resolve, reject) => {
        const data = { nameList: "Define_categories", attribute: "*" };

        axios.post("https://api.langbach.io.vn/get_data", JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log("Dữ liệu thô từ server:", response.data);
            const responseData = response.data;
            if (responseData && responseData.data) {
                let processedData;
                if (Array.isArray(responseData.data.data)) {
                    processedData = responseData.data.data;
                } else if (typeof responseData.data.data === 'object') {
                    processedData = [responseData.data.data];
                } else {
                    processedData = [];
                }
                console.log("Dữ liệu danh mục đã xử lý:", processedData);
                updateCategories(processedData);
                resolve(categories);
            } else {
                console.error("Cấu trúc dữ liệu không đúng. Dữ liệu nhận được:", responseData);
                reject("Cấu trúc dữ liệu không đúng");
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu danh mục:", error);
            reject(error);
        });
    });
}

export function handleDeleteCategory(categoryName) {
    return new Promise((resolve, reject) => {
        const data = { 
            nameList: "Define_categories", 
            attribute: "category_name", 
            primaryKey: categoryName 
        };

        axios.post("https://api.langbach.io.vn/delete_data", JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log("Dữ liệu thô từ server:", response.data);
            const responseData = response.data;
            if (responseData && responseData.success) {
                console.log("Xóa danh mục thành công:", responseData.status);
                return handleCategories();
            } else {
                console.error("Xóa danh mục thất bại:", responseData.status);
                throw new Error("Xóa danh mục thất bại");
            }
        })
        .then(() => {
            window.dispatchEvent(new CustomEvent('categoryDeleted', { detail: categoryName }));
            resolve(categories);
        })
        .catch(error => {
            console.error("Lỗi khi xóa danh mục:", error);
            reject(error);
        });
    });
}
