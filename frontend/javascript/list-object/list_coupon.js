const coupons = new Map();

export function updateCoupons(data) {
  coupons.clear();
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (!coupons.has(item.brand_name)) {
        coupons.set(item.brand_name, []);
      }
      coupons.get(item.brand_name).push({
        category_name: item.category_name,
        discount: item.discount,
        code: item.coupon_id,
      });
    });
    console.log("Mã giảm giá đã được cập nhật:", coupons);
    window.dispatchEvent(
      new CustomEvent("couponsUpdated", { detail: coupons })
    );
  } else {
    console.error("Dữ liệu không phải là mảng:", data);
  }
}

export default coupons;
