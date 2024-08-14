import { categories, handleCategories, handleDeleteCategory } from "../call-api/handler-categories.js";

function displayCategories(categories) {
  console.log("Đang hiển thị danh sách danh mục:", categories);
  const tableBody = document.getElementById("category-table-body");
  tableBody.innerHTML = "";

  categories.forEach((category) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${category.category_name}</td>
        <td><button class="btn btn-danger delete-btn" data-categoryname="${category.category_name}"><i class="bi bi-x-lg"></i></button></td>
    `;
    row.querySelector(".delete-btn").addEventListener("click", function () {
      const categoryName = this.getAttribute("data-categoryname");
      handleDeleteCategory(categoryName)
        .then(() => {
          reloadCategories();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa danh mục:", error);
        });
    });

    tableBody.appendChild(row);
  });
}

function reloadCategories() {
  handleCategories()
    .then(() => {
      displayCategories(categories);
    })
    .catch((error) => {
      console.error("Không thể tải lại dữ liệu danh mục:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang đã tải xong, đang lấy dữ liệu danh mục");
  reloadCategories();
});

document.querySelectorAll('.menu li').forEach(item => {
  item.addEventListener('click', function() {
    if (this.getAttribute('data-target') === 'danh-muc') {
      reloadCategories();
    }
  });
});
