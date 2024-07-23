var brands = new Map([]);

export function updateBrands(data) {
  brands.clear();
  brands.set("*", "Tất cả");
  if (Array.isArray(data)) {
      data.forEach(item => {
          if (item && item.brand_name) {
              brands.set(item.brand_name, item.brand_name);
          }
      });
      console.log("Thương hiệu đã được cập nhật:", brands);
      window.dispatchEvent(new CustomEvent('brandsUpdated', { detail: brands }));
  } else {
      console.error("Dữ liệu không phải là mảng:", data);
  }
}

export default brands;
