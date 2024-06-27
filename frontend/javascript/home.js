import products from "./list_products.js";
import categories from "./list_categories.js";
import coupons from "./list_coupon.js";

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
            <img src="${product.image}" class="uk-card-media-top" alt="${
        product.name
      }">
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
    AOS.refresh(); // Refresh AOS to apply animations to dynamically added elements
  }

  // Hiển thị tất cả sản phẩm khi trang được tải
  renderProducts(productArray);

  // Khởi tạo Slick Carousel cho sản phẩm
  $(".grid").slick({
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
    AOS.refresh(); // Refresh AOS to apply animations to dynamically added elements
  }

  // Hiển thị các sản phẩm được đánh giá cao nhất từ products.js
  function renderFeaturedProducts(products) {
    const featuredProductsList = $("#featured-products-list");
    featuredProductsList.empty();
    products.forEach(([key, value]) => {
      featuredProductsList.append(`
        <div class="animate__animated animate__fadeIn" data-aos="fade-up">
          <div class="uk-card uk-card-default uk-card-body">
            <img src="${value.image}" class="uk-card-media-top" alt="${
        value.name
      }">
            <h3 class="uk-card-title">${value.name}</h3>
            <p>Thương hiệu: ${value.brand}</p>
            <p>Danh mục: ${value.category}</p>
            <p>Giá: ${value.price.toLocaleString()} VND</p>
            <div class="product-reviews">
              <h4>Đánh giá:</h4>
              <span class="stars">${value.reviews.stars}</span>
              <div class="reviewer">${value.reviews.reviewer}</div>
              <div class="comment">${value.reviews.text}</div>
            </div>
          </div>
        </div>
      `);
    });
    AOS.refresh(); // Refresh AOS to apply animations to dynamically added elements
  }

  // Hiển thị các thẻ giảm giá từ coupon.js
  function renderCoupons(coupons) {
    const couponGrid = $(".coupon-grid");
    couponGrid.empty();
    coupons.forEach(([key, value]) => {
      couponGrid.append(`
        <div class="coupon-item animate__animated animate__fadeIn" data-aos="fade-up">
          <div class="uk-card uk-card-default uk-card-body">
            <img src="${value.image}" class="uk-card-media-top" alt="${value.category_name}">
            <h3 class="uk-card-title">${value.category_name}</h3>
            <p class="quantity">Số lượng: ${value.quantity}</p>
            <p class="discount">Giảm giá: ${value.discount}%</p>
          </div>
        </div>
      `);
    });
    AOS.refresh(); // Refresh AOS to apply animations to dynamically added elements
  }

  // Gọi hàm renderCategories, renderFeaturedProducts và renderCoupons với danh sách categories, products và coupons từ categories.js, products.js và coupon.js
  renderCategories(categories);
  renderFeaturedProducts(productArray);
  renderCoupons(Array.from(coupons.entries()));

  // Khởi tạo Slick Carousel cho thẻ giảm giá
  $(".coupon-grid").slick({
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

  // Thêm sự kiện click cho các mục trong thanh điều hướng
  $(".uk-navbar-nav > li > a").on("click", function (e) {
    // Kiểm tra nếu liên kết không phải là "#"
    if ($(this).attr("href") === "#") {
      e.preventDefault(); // Chỉ ngăn chặn hành vi mặc định nếu href là "#"
    }
    $(".uk-navbar-nav > li > a").removeClass("active");
    $(this).addClass("active");
    if ($(window).width() < 960) {
      $(".uk-navbar-right").removeClass("mobile-menu");
    }
  });
});
