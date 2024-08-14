export let users = [];

export function updateUsers(newUsers) {
    users = newUsers;
    console.log("Danh sách người dùng đã được cập nhật:", users);
}

export function handleUsers() {
    return new Promise((resolve, reject) => {
        const data = { nameList: "Infomation", attribute: "*" };

        axios.post("https://api.langbach.io.vn/get_data", JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log("Dữ liệu thô từ server:", response.data);
            const responseData = response.data;
            if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
                console.log("Dữ liệu người dùng đã xử lý:", responseData.data.data);
                updateUsers(responseData.data.data);
                resolve(users);
            } else {
                console.error("Cấu trúc dữ liệu không đúng. Dữ liệu nhận được:", responseData);
                reject("Cấu trúc dữ liệu không đúng");
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            reject(error);
        });
    });
}

export function handleDeleteUsers(userId) {
    return new Promise((resolve, reject) => {
        const data = { 
            nameList: "Users", 
            attribute: "user_id", 
            primaryKey: userId 
        };

        axios.post("https://api.langbach.io.vn/delete_data", JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log("Dữ liệu thô từ server:", response.data);
            const responseData = response.data;
            if (responseData && responseData.success) {
                console.log("Xóa người dùng thành công:", responseData.status);
                // Cập nhật danh sách người dùng sau khi xóa
                handleUsers().then(() => {
                    resolve(users);
                });
            } else {
                console.error("Xóa người dùng thất bại:", responseData.status);
                reject("Xóa người dùng thất bại");
            }
        })
        .catch(error => {
            console.error("Lỗi khi xóa người dùng:", error);
            reject(error);
        });
    });
}
