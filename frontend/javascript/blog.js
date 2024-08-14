// home.js

import products from "./list-object/list_products.js";
import categories from "./list-object/list_categories.js";
import coupons from "./list-object/list_coupon.js"; // Đổi từ list_coupon.js thành list_coupons.js
import { showCartModal, addToCart, removeFromCart, updateCartItemQuantity, clearCart, getCartCount } from './share-data/cart.js';

$(document).ready(function () {
  // Lấy dữ liệu sản phẩm từ products.js
  const productArray = Array.from(products.entries());

  // Hàm này dùng để hiển thị các sản phẩm lên giao diện
  function renderProducts(data) {
    $(".grid").empty();
    data.forEach(([key, product]) => {
      $(".grid").append(`
        <div class="product-item animate__animated animate__fadeIn" data-aos="fade-up">
          <div class="uk-card uk-card-default uk-card-body">
            <img src="${product.image}" class="uk-card-media-top" alt="${product.name}">
            <h3 class="uk-card-title">${product.name}</h3>
            <p>Thương hiệu: ${product.brand}</p>
            <p>Danh mục: ${product.category}</p>
            <p>Giá: ${product.price.toLocaleString()} VND</p>
            <div class="product-reviews">
              <h4>Đánh giá:</h4>
              <span class="stars">${product.reviews.stars}</span>
              <div class="reviewer">${product.reviews.reviewer}</div>
              <div class="comment">${product.reviews.text}</div>
            </div>
          </div>
        </div>
      `);
    });
    AOS.refresh(); // Làm mới AOS sau khi thêm nội dung mới
  }

  // Hiển thị tất cả sản phẩm khi trang được tải
  renderProducts(productArray);

  // Khởi tạo Slick Carousel cho sản phẩm
  $(".grid").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: '<button class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
    nextArrow: '<button class="slick-next"><i class="fas fa-chevron-right"></i></button>',
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

  // Hiển thị danh mục sản phẩm từ categories.js
  function renderCategories(categories) {
    const categoryList = $("#category-list");
    categoryList.empty();
    categories.forEach((value, key) => {
      if (key !== "*") {
        categoryList.append(`
          <div class="animate__animated animate__fadeIn" data-aos="fade-up">
            <div class="uk-card uk-card-default uk-card-body">${value}</div>
          </div>
        `);
      }
    });
    AOS.refresh(); // Làm mới AOS sau khi thêm nội dung mới
  }

  // Hiển thị các thẻ giảm giá từ coupon.js
  function renderCoupons(coupons) {
    const couponGrid = $(".coupon-grid");
    couponGrid.empty();
    coupons.forEach(([key, value]) => {
      couponGrid.append(`
        <div class="coupon-item animate__animated animate__fadeIn" data-aos="fade-up">
          <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">${value.category_name}</h3>
            <p class="quantity">Số lượng: ${value.quantity}</p>
            <p class="discount">Giảm giá: ${value.discount}%</p>
          </div>
        </div>
      `);
    });
    AOS.refresh(); // Làm mới AOS sau khi thêm nội dung mới
  }

  // Gọi hàm renderCategories và renderCoupons
  renderCategories(categories);
  renderCoupons(Array.from(coupons.entries()));

  // Khởi tạo Slick Carousel cho thẻ giảm giá
  $(".coupon-grid").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: '<button class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
    nextArrow: '<button class="slick-next"><i class="fas fa-chevron-right"></i></button>',
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

  // Cập nhật hiển thị số lượng giỏ hàng
  function updateCartDisplay() {
    $(".uk-badge.cart-count").text(getCartCount());
  }

  // Cập nhật số lượng giỏ hàng khi trang được tải
  updateCartDisplay();

  // Xử lý sự kiện mở modal giỏ hàng
  UIkit.util.on("#cartModal", "beforeshow", showCartModal);

  // Xử lý sự kiện thêm sản phẩm vào giỏ hàng
  $(document).on("click", ".add-to-cart", function () {
    const key = $(this).data("key");
    const product = products.get(key);
    if (product) {
      const quantity = addToCart(product);
      toastr.success(`Đã thêm sản phẩm ${product.name} vào giỏ hàng với số lượng ${quantity}`);
      updateCartDisplay();
    }
  });

  // Xử lý sự kiện thay đổi số lượng sản phẩm trong giỏ hàng
  $(document).on("change", ".quantity-input", function () {
    const productName = $(this).data("name");
    const newQuantity = parseInt($(this).val());
    updateCartItemQuantity(productName, newQuantity);
    showCartModal();
    updateCartDisplay();
  });

  // Xử lý sự kiện xóa sản phẩm khỏi giỏ hàng
  $(document).on("click", ".remove-from-cart", function () {
    const productName = $(this).data("name");
    removeFromCart(productName);
    showCartModal();
    updateCartDisplay();
  });

  // Thêm sự kiện click cho các mục trong thanh điều hướng
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

  AOS.init(); // Khởi tạo AOS khi trang được tải
});

function updateCartIcon() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
  const itemCount = Object.keys(cartItems).length;
  $('.cart-count').text(itemCount);
}

updateCartIcon();

$(document).on("click", ".checkout-btn", function (e) {
  console.log("Checkout button clicked");
  e.preventDefault();
  // Đảm bảo rằng cartItems được định nghĩa trong phạm vi này
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  window.location.href = '../html/checkout.html';
});
