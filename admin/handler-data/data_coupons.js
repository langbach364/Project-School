import {
  coupons,
  handleCoupons,
  handleDeleteCoupon,
  handleAddCoupon,
  handleUpdateCoupon,
} from "../call-api/handler-coupons.js";

let updateModal;
let modal;

function displayCoupons(coupons) {
  console.log("Đang hiển thị danh sách mã giảm giá:", coupons);
  const tableBody = document.getElementById("coupon-table-body");
  tableBody.innerHTML = "";

  coupons.forEach((coupon) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${coupon.coupon_id}</td>
    <td>${coupon.brand_name}</td>
    <td>${coupon.category_name}</td>
    <td>${coupon.discount}</td>
    <td>
      <button class="btn btn-danger delete-btn" data-couponid="${coupon.coupon_id}"><i class="bi bi-x-lg"></i></button>
      <button class="btn btn-warning update-btn" data-couponid="${coupon.coupon_id}"><i class="bi bi-pencil"></i></button>
    </td>
  `;

    row.querySelector(".delete-btn").addEventListener("click", function () {
      const couponId = this.getAttribute("data-couponid");
      const row = this.closest("tr");
      handleDeleteCoupon(couponId)
        .then(() => {
          row.remove();
          console.log("Mã giảm giá đã được xóa khỏi giao diện");
        })
        .catch((error) => {
          console.error("Lỗi khi xóa mã giảm giá:", error);
        });
    });

    row.querySelector(".update-btn").addEventListener("click", function () {
      const couponId = this.getAttribute("data-couponid");
      const coupon = coupons.find((c) => c.coupon_id == couponId);
      if (coupon) {
        document.getElementById("update-coupon-id").value = coupon.coupon_id;
        document.getElementById("update-brand-name").value = coupon.brand_name;
        document.getElementById("update-category-name").value =
          coupon.category_name;
        document.getElementById("update-discount").value = coupon.discount;
        updateModal.show();
      }
    });

    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang đã tải xong, đang lấy dữ liệu mã giảm giá");
  modal = new bootstrap.Modal(document.getElementById('add-coupon-modal'));
  updateModal = new bootstrap.Modal(
    document.getElementById("update-coupon-modal")
  );

  handleCoupons()
    .then(() => {
      displayCoupons(coupons);
    })
    .catch((error) => {
      console.error("Không thể tải dữ liệu mã giảm giá:", error);
    });

  const addCouponBtn = document.getElementById("add-coupon-btn");
  const addCouponForm = document.getElementById("add-coupon-form");

  addCouponBtn.onclick = () => modal.show();

  addCouponForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const couponData = Object.fromEntries(formData.entries());

    handleAddCoupon(couponData)
      .then(() => {
        modal.hide();
        return handleCoupons();
      })
      .then(() => {
        displayCoupons(coupons);
        addCouponForm.reset();
      })
      .catch((error) => console.error("Lỗi khi thêm mã giảm giá:", error));
  };

  const updateCouponForm = document.getElementById("update-coupon-form");

  updateCouponForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const couponData = Object.fromEntries(formData.entries());

    handleUpdateCoupon(couponData)
      .then(() => {
        updateModal.hide();
        return handleCoupons();
      })
      .then(() => {
        displayCoupons(coupons);
        updateCouponForm.reset();
      })
      .catch((error) => console.error("Lỗi khi cập nhật mã giảm giá:", error));
  };
});
