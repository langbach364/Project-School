import products from "./list_products.js";
import brands from "./list_brands.js";
import categories from "./list_categories.js";

$(document).ready(function () {
  // Khởi tạo giỏ hàng
  var cartItems = {};
  var cartCount = 0;

  // Hàm hiển thị modal giỏ hàng
  function showCartModal() {
    let cartItemsHtml = "";
    let totalAmount = 0;

    $.each(cartItems, function (index, item) {
      totalAmount += item.total;
      cartItemsHtml += `
              <tr>
                  <td>${item.name}</td>
                  <td>${item.brand}</td>
                  <td>${item.category}</td>
                  <td>${item.price.toLocaleString()} VND</td>
                  <td>
                      <input type="number" id="quantity_product" class="uk-input quantity-input" data-name="${
                        item.name
                      }" value="${item.quantity}" min="0">
                  </td>
                  <td class="item-total">${item.total.toLocaleString()} VND</td>
                  <td>
                      <button class="uk-button uk-button-danger remove-btn remove-from-cart" data-name="${
                        item.name
                      }">Xóa</button>
                  </td>
              </tr>
          `;
    });

    cartItemsHtml += `
          <tr>
              <td colspan="6"><strong>Tổng cộng</strong></td>
              <td><strong class="total-amount">${totalAmount.toLocaleString()} VND</strong></td>
          </tr>
      `;

    $(".cart-items").html(cartItemsHtml);
    UIkit.modal("#cartModal").show();

    // Điều chỉnh kích thước ô nhập số lượng khi modal hiển thị
    $(".quantity-input").each(function () {
      adjustQuantityInputWidth(this);
    });
  }

  // Hàm cập nhật tổng số tiền
  function updateTotalAmount() {
    var totalAmount = 0;
    $.each(cartItems, function (index, item) {
      totalAmount += item.total;
    });
    $(".total-amount").text(totalAmount.toLocaleString() + " VND");
  }

  // Hàm điều chỉnh kích thước ô nhập số lượng
  function adjustQuantityInputWidth(input) {
    const valueLength = input.value.length;
    const minWidth = 60; // Kích thước tối thiểu
    const charWidth = 10; // Kích thước trung bình của mỗi ký tự
    const newWidth = Math.max(minWidth, valueLength * charWidth);
    input.style.width = newWidth + "px";
  }

  // Sự kiện click vào biểu tượng giỏ hàng
  UIkit.util.on("#cartModal", "beforeshow", function () {
    showCartModal();
  });

  // Sự kiện thay đổi số lượng sản phẩm trong giỏ hàng
  $(document).on("change", ".quantity-input", function () {
    var productName = $(this).data("name");
    var newQuantity = $(this).val();
    cartItems[productName].quantity = newQuantity;
    cartItems[productName].total =
      cartItems[productName].quantity * cartItems[productName].price;

    var newTotal = cartItems[productName].total.toLocaleString() + " VND";
    $(this).closest("tr").find(".item-total").text(newTotal);

    updateTotalAmount();

    // Điều chỉnh kích thước ô nhập số lượng
    adjustQuantityInputWidth(this);
  });

  // Sự kiện xóa sản phẩm khỏi giỏ hàng
  $(document).on("click", ".remove-from-cart", function () {
    var productName = $(this).data("name");
    delete cartItems[productName];

    // Cập nhật lại số lượng sản phẩm trong giỏ hàng
    cartCount--;
    $(".uk-badge.cart-count").text(cartCount);

    // Hiển thị lại giỏ hàng
    showCartModal();
  });

  // Sự kiện thanh toán
  $(document).on("click", ".checkout-btn", function () {
    alert("Thanh toán thành công!");
    cartItems = {};
    cartCount = 0;
    $(".uk-badge.cart-count").text(cartCount);
    UIkit.modal("#cartModal").hide();
  });

  // Hàm hiển thị thông báo sản phẩm
  function showProductToast(productName, message) {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: "toast-custom-position", // Sử dụng lớp CSS tùy chỉnh
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "3000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };

    toastr.success(message, productName);
  }

  // List giá
  var prices = new Map([
    ["*", "Tất cả"],
    ["low", "Dưới 1 triệu"],
    ["medium", "1 triệu - 5 triệu"],
    ["high", "Trên 5 triệu"],
  ]);

  // Hàm này dùng để hiển thị các tùy chọn lên giao diện
  function renderOptions(map, elementId) {
    const selectElement = document.getElementById(elementId);
    selectElement.innerHTML = "";
    map.forEach((value, key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = value;
      selectElement.appendChild(option);
    });
  }

  // Hiển thị các tùy chọn
  renderOptions(brands, "brand");
  renderOptions(categories, "category");
  renderOptions(prices, "price");

  // Khởi tạo Isotope sau khi tất cả hình ảnh đã được tải
  var $grid = $(".grid").imagesLoaded(function () {
    $grid.isotope({
      itemSelector: ".product-item",
      layoutMode: "fitRows",
    });
  });

  // Hàm này dùng để hiển thị các sản phẩm lên giao diện
  function renderProducts(data) {
    $(".grid").empty();
    data.forEach(([key, product]) => {
      $(".grid").append(`
      <div class="product-item ${
        product.class
      } col-md-3 mb-4" data-key="${key}">
        <div class="card">
          <div class="card-body">
            <img src="${product.image}" class="card-img" alt="${product.name}">
            <h3 class="card-title">${product.name}</h3>
            <p class="card-text">Thương hiệu: ${product.brand}</p>
            <p class="card-text">Danh mục: ${product.category}</p>
            <p class="card-text">Giá: ${product.price.toLocaleString()} VND</p>
            <button class="uk-button uk-button-primary add-to-cart" data-key="${key}">Thêm vào giỏ hàng</button>
            <button class="uk-button uk-button-primary" data-key="${key}">Chi tiết</button>
          </div>
        </div>
      </div>
    `);
    });
    $grid.isotope("reloadItems").isotope({ sortBy: "original-order" });
  }

  // Hàm này áp dụng phân trang dựa vào tổng số dữ liệu sản phẩm
  function applyPagination(data) {
    $("#pagination-container").pagination({
      dataSource: data,
      pageSize: 8,
      callback: function (data, pagination) {
        renderProducts(data);
        AOS.refresh(); // Làm mới AOS sau khi thêm các phần tử mới
      },
    });
  }

  applyPagination(Array.from(products.entries()));

  $("#brand, #category, #price, #main-search").on("change keyup", function () {
    filterProducts();
  });

  function filterProducts() {
    // Tạm thời vô hiệu hóa AOS
    AOS.init({ disable: true });

    // Hàm lọc sản phẩm dựa trên các tiêu chí tìm kiếm
    var brand = $("#brand").val();
    var category = $("#category").val();
    var price = $("#price").val();
    var search = $("#main-search").val().toLowerCase();

    var filteredProducts = Array.from(products.entries()).filter(function ([
      key,
      product,
    ]) {
      var name = product.name.toLowerCase();
      var matchesSearch = name.includes(search);
      var matchesBrand =
        brand === "*" || (product.brand && product.brand === brands.get(brand));
      var matchesCategory =
        category === "*" ||
        (product.category && product.category === categories.get(category));
      var matchesPrice =
        price === "*" || (product.class && product.class === price);

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    });

    applyPagination(filteredProducts);

    // Kích hoạt lại AOS
    AOS.init();
  }

  // Quản lý giỏ hàng
  $(document).on("click", ".add-to-cart", function () {
    // Xử lý sự kiện khi người dùng thêm sản phẩm vào giỏ hàng
    var key = $(this).data("key");
    var product = products.get(key);

    if (product) {
      if (!cartItems[product.name]) {
        cartItems[product.name] = {
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          quantity: 1,
          total: product.price,
        };

        cartCount++;
        $(".uk-badge.cart-count").text(cartCount);
      } else {
        cartItems[product.name].quantity++;
        cartItems[product.name].total =
          cartItems[product.name].quantity * cartItems[product.name].price;
      }

      // Gọi hàm showProductToast để hiển thị thông báo
      showProductToast(
        product.name,
        `Đã thêm sản phẩm ${product.name} vào giỏ hàng với số lượng ${
          cartItems[product.name].quantity
        }`
      );
    } else {
      console.error("Product not found for key:", key);
    }
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

  // Khởi tạo AOS
  AOS.init();
});
