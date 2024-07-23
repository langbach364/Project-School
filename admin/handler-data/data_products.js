import {
  products,
  handleProducts,
  handleDeleteProduct,
  handleAddProduct,
  handleAddImage,
  handleUpdateProduct
} from "../call-api/handler-products.js";

let updateModal;

function displayProducts(products) {
  console.log("Đang hiển thị danh sách sản phẩm:", products);
  const tableBody = document.getElementById("product-table-body");
  tableBody.innerHTML = "";

  if (!Array.isArray(products)) {
    console.error("Dữ liệu sản phẩm không phải là mảng:", products);
    return;
  }

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${product.product_id}</td>
    <td>${product.product_name}</td>
    <td>${product.brand}</td>
    <td>${product.price}</td>
    <td>${product.category}</td>
    <td>
      <button class="btn btn-danger delete-btn" data-productid="${product.product_id}"><i class="bi bi-x-lg"></i></button>
      <button class="btn btn-primary add-image-btn" data-productid="${product.product_id}"><i class="bi bi-upload"></i></button>
      <button class="btn btn-warning update-btn" data-productid="${product.product_id}"><i class="bi bi-pencil"></i></button>
    </td>
  `;
  
    row.querySelector(".delete-btn").addEventListener("click", function () {
      const productId = this.getAttribute("data-productid");
      const row = this.closest('tr');
      handleDeleteProduct(productId)
        .then(() => {
          row.remove();
          console.log("Sản phẩm đã được xóa khỏi giao diện");
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
        });
    });

    row.querySelector(".add-image-btn").addEventListener("click", function() {
      const productId = this.getAttribute("data-productid");
      handleAddImageToProduct(productId);
    });

    row.querySelector(".update-btn").addEventListener("click", function() {
      const productId = this.getAttribute("data-productid");
      const product = products.find(p => p.product_id == productId);
      if (product) {
        document.getElementById("update-product-id").value = product.product_id;
        document.getElementById("update-product-name").value = product.product_name;
        document.getElementById("update-product-brand").value = product.brand;
        document.getElementById("update-product-price").value = product.price;
        document.getElementById("update-product-category").value = product.category;
        updateModal.show();
      }
    });

    tableBody.appendChild(row);
  });
}

function handleAddImageToProduct(productId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    handleAddImage(file, productId)
      .then(() => {
        console.log("Ảnh đã được thêm vào sản phẩm có ID:", productId);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm ảnh vào sản phẩm:", error);
      });
  };
  input.click();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang đã tải xong, đang lấy dữ liệu sản phẩm");
  updateModal = new bootstrap.Modal(document.getElementById('update-product-modal'));

  handleProducts()
    .then(() => {
      displayProducts(products);
    })
    .catch((error) => {
      console.error("Không thể tải dữ liệu sản phẩm:", error);
    });

  const addProductBtn = document.getElementById("add-product-btn");
  const addProductForm = document.getElementById("add-product-form");
  const modal = new bootstrap.Modal(document.getElementById('add-product-modal'));

  addProductBtn.onclick = () => modal.show();

  addProductForm.onsubmit = (e) => {
    e.preventDefault();
    const productData = {
      product_name: document.getElementById("product-name").value,
      brand: document.getElementById("product-brand").value,
      price: document.getElementById("product-price").value,
      category: document.getElementById("product-category").value,
    };
  
    handleAddProduct(productData)
      .then(() => {
        console.log("Sản phẩm đã được thêm thành công");
        modal.hide();
        return handleProducts();
      })
      .then(() => {
        displayProducts(products);
        addProductForm.reset();
      })
      .catch(error => {
        console.error("Lỗi khi thêm sản phẩm:", error);
      });
  };
  

  const updateProductForm = document.getElementById("update-product-form");

  updateProductForm.onsubmit = (e) => {
    e.preventDefault();
    const productData = {
      product_id: document.getElementById("update-product-id").value,
      product_name: document.getElementById("update-product-name").value,
      brand: document.getElementById("update-product-brand").value,
      price: document.getElementById("update-product-price").value,
      category: document.getElementById("update-product-category").value,
    };

    handleUpdateProduct(productData)
      .then(() => {
        updateModal.hide();
        return handleProducts();
      })
      .then(() => {
        displayProducts(products);
        updateProductForm.reset();
      })
      .catch(error => console.error("Lỗi khi cập nhật sản phẩm:", error));
  };
});

window.addEventListener('categoryDeleted', function(event) {
  const deletedCategory = event.detail;
  handleProducts()
      .then(() => {
          displayProducts(products.filter(product => product.category !== deletedCategory));
      })
      .catch((error) => {
          console.error("Không thể cập nhật danh sách sản phẩm sau khi xóa danh mục:", error);
      });
});