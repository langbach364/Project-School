export let products = [];

function updateProducts(newProducts) {
  if (newProducts && newProducts.data && Array.isArray(newProducts.data)) {
    products = [...newProducts.data];
  } else {
    products = [];
  }
}

export function handleProducts() {
  return new Promise((resolve, reject) => {
    var namelist = "Products";
    var data = {
      nameList: namelist,
      attribute: "*",
    };
    
    axios
      .post("https://api.langbach.io.vn/get_data", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        var responseData = response.data;
        console.log("Phản hồi từ API sản phẩm:", responseData);
        if (responseData && responseData.data) {
          updateProducts(responseData.data);
          console.log(
            "Dữ liệu sản phẩm mới đã được cập nhật:",
            responseData.data
          );
          resolve(responseData.data);
        } else {
          console.error("Cấu trúc dữ liệu sản phẩm không đúng:", responseData);
          reject("Cấu trúc dữ liệu không đúng");
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm:", error);
        reject(error);
      });
  });
}

export function handleDeleteProduct(productId) {
  return new Promise((resolve, reject) => {
    const data = {
      nameList: "Products",
      attribute: "product_id",
      primaryKey: productId,
    };
    
    axios
      .post("https://api.langbach.io.vn/delete_data", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData && responseData.success) {
          console.log("Xóa sản phẩm thành công:", responseData.status);
          resolve();
        } else {
          console.error("Xóa sản phẩm thất bại:", responseData.status);
          reject("Xóa sản phẩm thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi xóa sản phẩm:", error);
        reject(error);
      });
  });
}

export function handleAddProduct(productData) {
  return new Promise((resolve, reject) => {
    const data = {
      nameList: "Products",
      data: productData,
    };
    console.log("Dữ liệu sản phẩm để thêm:", data);
    console.log("Dữ liệu sản phẩm để thêm:", JSON.stringify(data));
    axios
      .post("https://api.langbach.io.vn/insert_data", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data && response.data.success) {
          console.log("Thêm sản phẩm thành công");
          resolve(response.data);
        } else {
          reject("Thêm sản phẩm thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi thêm sản phẩm:", error);
        reject(error);
      });
  });
}

export function handleAddImage(imageFile, productId) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("product_id", productId);

    axios
      .post("https://api.langbach.io.vn/upload_image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Ảnh đã được tải lên thành công:", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải ảnh lên:", error);
        reject(error);
      });
  });
}

export function handleUpdateProduct(productData) {
  return new Promise((resolve, reject) => {
    const data = {
      nameList: "Products",
      data: productData,
      condition: "product_id",
    };

    axios
      .post("https://api.langbach.io.vn/update_data", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data && response.data.success) {
          console.log("Cập nhật sản phẩm thành công");
          resolve(response.data);
        } else {
          reject("Cập nhật sản phẩm thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        reject(error);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handleProducts()
    .then(() => {
      window.dispatchEvent(new CustomEvent("productsLoaded"));
    })
    .catch((error) => {
      console.error("Không thể tải sản phẩm:", error);
    });
});
