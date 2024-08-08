import categories, { updateCategories } from '../javascript/list-object/list_categories.js';

function handleCategories(event) {
    if (event) {
        event.preventDefault();
    }
    var namelist = "Define_categories";
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
            updateCategories(responseData.data.data);
            console.log("Dữ liệu mới đã được cập nhật:", categories);
        } else {
            console.error("Cấu trúc dữ liệu không đúng:", responseData);
        }
    })
    .catch(error => {
        console.error("Có lỗi xảy ra:", error);
    });
}

document.addEventListener('DOMContentLoaded', handleCategories);

export { handleCategories };
