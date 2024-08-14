import products from "./list-object/list_products.js";
import brands from "./list-object/list_brands.js";
import categories from "./list-object/list_categories.js";
import { updateCartUI } from "./share-data/cart.js";
import { handleCategories } from "../call-api/handler-categories.js";
import { handleBrands } from "../call-api/handler-brands.js";
import { handleCoupons } from "../call-api/handler-coupon.js";
import { handleProducts } from "../call-api/handler-product.js";

function renderOptions(map, elementId) {
  const selectElement = document.getElementById(elementId);
  if (!selectElement) return;

  selectElement.innerHTML = "<option value='*'>Tất cả</option>";

  map.forEach((value, key) => {
    if (key !== "*") {
      const option = new Option(value, key);
      selectElement.appendChild(option);
    }
  });
}

function renderProducts(data) {
  const productHTML = data
    .map(
      ([key, product]) => `
    <div class="product-item ${product.class} col-md-3 mb-4" data-key="${key}">
      <div class="card">
        <div class="card-body">
          <img src="${product.image}" class="card-img" alt="${product.name}">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Thương hiệu: ${product.brand}</p>
          <p class="card-text">Danh mục: ${product.category}</p>
          <p class="card-text">Giá: ${product.price.toLocaleString()} VND</p>
          <button class="uk-button uk-button-primary add-to-cart" data-key="${key}">Thêm vào giỏ hàng</button>
          <button class="uk-button uk-button-primary" data-key="${key}">Đánh Giá</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
  $(".grid").html(productHTML);
  $(".grid").isotope("reloadItems").isotope({ sortBy: "original-order" });
}

function applyPagination(data) {
  $("#pagination-container").pagination({
    dataSource: data,
    pageSize: 8,
    callback: function (data) {
      renderProducts(data);
      AOS.refresh();
    },
  });
}

function filterProducts() {
  const brand = $("#brand").val();
  const category = $("#category").val();
  const price = $("#price").val();
  const search = $("#main-search").val().toLowerCase();

  const filteredProducts = Array.from(products.entries()).filter(
    ([, product]) => {
      let priceMatch = true;
      if (price === "low") {
        priceMatch = product.price < 1000000;
      } else if (price === "medium") {
        priceMatch = product.price >= 1000000 && product.price <= 5000000;
      } else if (price === "high") {
        priceMatch = product.price > 5000000;
      }

      return (
        product.name.toLowerCase().includes(search) &&
        (brand === "*" || product.brand === brands.get(brand)) &&
        (category === "*" || product.category === categories.get(category)) &&
        (price === "*" || priceMatch)
      );
    }
  );

  applyPagination(filteredProducts);
}

function loadInitialProducts() {
  Promise.all([handleProducts(), handleCategories(), handleBrands()])
    .then(() => {
      renderOptions(categories, "category");
      renderOptions(brands, "brand");
      const selectedCategory = localStorage.getItem("selectedCategory");
      if (selectedCategory) {
        const categorySelect = document.getElementById("category");
        categorySelect.value = selectedCategory;
      }
      applyPagination(Array.from(products.entries()));
      localStorage.removeItem("selectedCategory");
    })
    .catch((error) => {
      console.error("Không thể tải dữ liệu:", error);
    });
}

function initializeEventListeners() {
  $("#search-button").on("click", filterProducts);

  $(".grid").on("click", ".add-to-cart", function (e) {
    e.preventDefault();
    const key = $(this).data("key");
    const product = products.get(key);
    if (product && !$(this).data("processing")) {
      $(this).data("processing", true);
      // Gọi hàm addToCart từ cart.js
      const quantity = window.addToCart(product);
      updateCartUI();
      toastr.success(
        `Đã thêm sản phẩm ${product.name} vào giỏ hàng với số lượng ${quantity}`
      );
      $(this).data("processing", false);
    }
  });
}

function initializePriceOptions() {
  const prices = new Map([
    ["*", "Tất cả"],
    ["low", "Dưới 1 triệu"],
    ["medium", "1 triệu - 5 triệu"],
    ["high", "Trên 5 triệu"],
  ]);

  renderOptions(prices, "price");
}

function renderStars(rating) {
  let starsHTML = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<i class="fas fa-star"></i>';
    } else if (i === fullStars && hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>';
    } else {
      starsHTML += '<i class="far fa-star"></i>';
    }
  }
  return starsHTML;
}

$(document).ready(function () {
  initializePriceOptions();

  $(".grid")
    .imagesLoaded()
    .then(() => {
      $(".grid").isotope({
        itemSelector: ".product-item",
        layoutMode: "fitRows",
      });
    });

  loadInitialProducts();
  initializeEventListeners();
  AOS.init();
});

window.addEventListener("categoriesUpdated", (event) => {
  renderOptions(event.detail, "category");
});

window.addEventListener("brandsUpdated", (event) => {
  renderOptions(event.detail, "brand");
});

window.addEventListener("couponsUpdated", (event) => {
  console.log("Mã giảm giá đã được cập nhật:", event.detail);
});

$(document).on("click", ".uk-button-primary:not(.add-to-cart)", function () {
  UIkit.modal("#productDetailModal").show();
});

let currentRating = 0;

$(document).on("click", ".star i", function() {
  currentRating = $(this).data("value");
  $(".rating-value").text(`Đánh giá: ${currentRating} sao`);
  $(".star i").removeClass("active");
  $(".star i").each(function() {
    if ($(this).data("value") <= currentRating) {
      $(this).addClass("active");
    }
  });
});

const randomNames = ["bản test"];

function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}



window.addComment = function() {
  const userName = getRandomName();
  const comment = $("#comment-input").val().trim();
  const rating = currentRating; // Sử dụng giá trị rating chính xác

  if (comment !== "" && rating > 0) {
    const commentHTML = `
      <div class="comment">
        <p><strong>${userName}</strong></p>
        <p><strong>Đánh giá:</strong> ${renderStars(rating)}</p>
        <p>${comment}</p>
      </div>
    `;
    $("#comments-list").append(commentHTML);
    
    // Reset form
    $("#comment-input").val("");
    currentRating = 0;
    $(".rating-value").text("Đánh giá: 0 sao");
    $(".star i").removeClass("active");
    
    $("#comments-list").show();
  } else {
    alert("Vui lòng đánh giá sao và viết bình luận trước khi gửi.");
  }
};

$(document).on("mouseover", ".star i", function() {
  const value = $(this).data("value");
  highlightStars(value);
});

$(document).on("mouseout", ".star i", function() {
  if (!currentRating) {
    $(".star i").removeClass("active hover");
  } else {
    highlightStars(currentRating);
  }
});

$(document).on("click", ".star i", function() {
  currentRating = $(this).data("value");
  $(".rating-value").text(`Đánh giá: ${currentRating} sao`);
  highlightStars(currentRating);
});

function highlightStars(value) {
  $(".star i").removeClass("active hover");
  $(".star i").each(function() {
    if ($(this).data("value") <= value) {
      $(this).addClass("hover");
    }
  });
}
