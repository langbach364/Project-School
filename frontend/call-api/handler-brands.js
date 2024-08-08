import brands, { updateBrands } from '../javascript/list-object/list_brands.js';

function handleBrands(event) {
    if (event) {
        event.preventDefault();
    }
    var namelist = "Brands";
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
        console.log("Phản hồi từ API:", responseData);
        if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
            updateBrands(responseData.data.data);
            console.log("Dữ liệu mới đã được cập nhật:", brands);
        } else {
            console.error("Cấu trúc dữ liệu không đúng:", responseData);
        }
    })
    .catch(error => {
        console.error("Có lỗi xảy ra:", error);
    });
}

document.addEventListener('DOMContentLoaded', handleBrands);

export { handleBrands };
