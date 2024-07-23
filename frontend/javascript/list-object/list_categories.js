var categories = new Map([["*", "Tất cả"]]);

export function updateCategories(data) {
  categories.clear();
  categories.set("*", "Tất cả"); // Thêm option "Tất cả"
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item && item.category_name) {
        categories.set(item.category_name, item.category_name);
      }
    });
    console.log("Danh mục đã được cập nhật:", categories);
    window.dispatchEvent(
      new CustomEvent("categoriesUpdated", { detail: categories })
    );
  } else {
    console.error("Dữ liệu không phải là mảng:", data);
  }
}

export default categories;
