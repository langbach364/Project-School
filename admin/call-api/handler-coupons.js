export let coupons = [];

function updateCoupons(newCoupons) {
  coupons = newCoupons;
}

export function handleCoupons() {
  return new Promise((resolve, reject) => {
    const data = {
      nameList: "Coupons",
      attribute: "*",
      
    };

    axios.post("https://api.langbach.io.vn/get_data", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      const responseData = response.data;
      if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
        updateCoupons(responseData.data.data);
        resolve(coupons);
      } else {
        reject("Cấu trúc dữ liệu không đúng");
      }
    })
    .catch((error) => {
      console.error("Có lỗi xảy ra khi lấy dữ liệu mã giảm giá:", error);
      reject(error);
    });
  });
}

export function handleDeleteCoupon(couponId) {
  return new Promise((resolve, reject) => {
    const data = {
      nameList: "Coupons",
      attribute: "coupon_id",
      primaryKey: couponId,
    };

    axios.post("https://api.langbach.io.vn/delete_data", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      if (response.data && response.data.success) {
        resolve(response.data);
      } else {
        reject("Xóa mã giảm giá thất bại");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi xóa mã giảm giá:", error);
      reject(error);
    });
  });
}

export function handleAddCoupon(couponData) {
  return new Promise((resolve, reject) => {
    const data = {
      nameList: "Coupons",
      data: couponData,
      condition: "coupon_id",
    };

    axios.post("https://api.langbach.io.vn/insert_data", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      if (response.data && response.data.success) {
        resolve(response.data);
      } else {
        reject("Thêm mã giảm giá thất bại");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi thêm mã giảm giá:", error);
      reject(error);
    });
  });
}

export function handleUpdateCoupon(couponData) {
  return new Promise((resolve, reject) => {
    const data = {
      nameList: "Coupons",
      data: couponData,
      condition: "coupon_id",
    };

    axios.post("https://api.langbach.io.vn/update_data", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      if (response.data && response.data.success) {
        resolve(response.data);
      } else {
        reject("Cập nhật mã giảm giá thất bại");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật mã giảm giá:", error);
      reject(error);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handleCoupons()
    .then(() => {
      window.dispatchEvent(new CustomEvent("couponsLoaded"));
    })
    .catch((error) => {
      console.error("Không thể tải mã giảm giá:", error);
    });
});
