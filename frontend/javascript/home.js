import products from "./list-object/list_products.js";
import categories from "./list-object/list_categories.js";
import coupons from "./list-object/list_coupon.js";
import {
  showCartModal,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartCount,
} from "./share-data/cart.js";
import { handleProducts } from "../call-api/handler-product.js";
import { handleCategories } from "../call-api/handler-categories.js";
import { handleCoupons } from "../call-api/handler-coupon.js";

function renderProducts(data) {
  $(".featured-products .grid").empty();
  data.forEach((product) => {
    $(".featured-products .grid").append(`
      <div class="product-item animate__animated animate__fadeIn" data-aos="fade-up">
        <a href="./product.html" class="uk-card uk-card-default uk-card-body" style="text-decoration: none;">
          <img src="${product.image}" class="uk-card-media-top" alt="${product.name}" style="color:black">
          <h3 style="color:black" class="uk-card-title">${product.name}</h3>
          <p style="color:black">Thương hiệu: ${product.brand}</p>
          <p style="color:black">Danh mục: ${product.category}</p>
          <p style="color:black">Giá: ${product.price.toLocaleString()} VND</p>
          
        </a>
      </div>
    `);
  });
  initializeSlick(".featured-products .grid");
}

function renderCategories(categories) {
  const categoryList = $(".product-categories .uk-grid-small");
  categoryList.empty();
  categories.forEach((value, key) => {
    if (key !== "*") {
      categoryList.append(`
        <div class="uk-width-1-4@m animate__animated animate__fadeIn" data-aos="fade-up">
          <a href="./product.html" class="uk-card uk-card-default uk-card-body category-card" style="text-decoration: none;">
            <h3 style="color:black" class="uk-card-title">${value}</h3>
            <p style="color:black">Khám phá các sản phẩm ${value}</p>
          </a>
        </div>
      `);
    }
  });
}

function renderCoupons(coupons) {
  const couponGrid = $(".featured-coupons .coupon-grid");
  couponGrid.empty();

  const groupedCoupons = new Map();

  coupons.forEach((couponArray, brand) => {
      couponArray.forEach(coupon => {
          const key = `${brand}-${coupon.category_name}-${coupon.discount}`;
          if (!groupedCoupons.has(key)) {
              groupedCoupons.set(key, { ...coupon, brand });
          }
      });
  });

  const sortedCoupons = Array.from(groupedCoupons.values()).sort(
      (a, b) => b.discount - a.discount
  );

  sortedCoupons.forEach((coupon) => {
      couponGrid.append(`
          <div class="coupon-item animate__animated animate__fadeIn" data-aos="fade-up">
              <div class="uk-card uk-card-default uk-card-body">
                  <h3 class="uk-card-title">${coupon.brand}</h3>
                  <p class="category">Danh mục: ${coupon.category_name}</p>
                  <p class="discount">Giảm giá: ${coupon.discount}%</p>
              </div>
          </div>
      `);
  });
  initializeSlick(".featured-coupons .coupon-grid");
}

function initializeSlick(selector) {
  $(selector)
    .not(".slick-initialized")
    .slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      prevArrow:
        '<button class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
      nextArrow:
        '<button class="slick-next"><i class="fas fa-chevron-right"></i></button>',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
}

function updateCartDisplay() {
  $(".uk-badge.cart-count").text(getCartCount());
}

$(document).ready(function () {
  Promise.all([handleProducts(), handleCategories(), handleCoupons()])
    .then(([productsData, categoriesData, couponsData]) => {
      renderProducts(Array.from(products.values()));
      renderCategories(categories);
      renderCoupons(coupons);
    })
    .catch((error) => console.error("Error loading data:", error));

  updateCartDisplay();

  UIkit.util.on("#cartModal", "beforeshow", showCartModal);

  $(document).on("click", ".add-to-cart", function () {
    const key = $(this).data("key");
    const product = products.get(key);
    if (product) {
      const quantity = addToCart(product);
      toastr.success(
        `Đã thêm sản phẩm ${product.name} vào giỏ hàng với số lượng ${quantity}`
      );
      updateCartDisplay();
    }
  });

  $(document).on("change", ".quantity-input", function () {
    const productName = $(this).data("name");
    const newQuantity = parseInt($(this).val());
    updateCartItemQuantity(productName, newQuantity);
    showCartModal();
    updateCartDisplay();
  });

  $(document).on("click", ".remove-from-cart", function () {
    const productName = $(this).data("name");
    removeFromCart(productName);
    showCartModal();
    updateCartDisplay();
  });

  $(document).on("click", ".copy-coupon", function () {
    const code = $(this).data("code");
    navigator.clipboard.writeText(code).then(() => {
      toastr.success("Đã sao chép mã giảm giá");
    });
  });

  $(document).on("click", ".view-category", function (e) {
    e.preventDefault();
    const category = $(this).data("category");
    localStorage.setItem("selectedCategory", category);
    window.location.href = `product.html?category=${category}`;
  });

  $(document).on("click", ".view-details", function () {
    const key = $(this).data("key");
    alert(`Chi tiết sản phẩm với ID: ${key}`);
  });

  $(".uk-navbar-nav > li > a").on("click", function (e) {
    if ($(this).attr("href") === "#") {
      e.preventDefault();
    }
    $(".uk-navbar-nav > li > a").removeClass("active");
    $(this).addClass("active");
    if ($(window).width() < 960) {
      $(".uk-navbar-right").removeClass("mobile-menu");
    }
  });

  AOS.init();
});

$(document).on("click", ".checkout-btn", function (e) {
  e.preventDefault();
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  window.location.href = "../html/checkout.html";
});
