$(document).ready(function () {
  function checkScreenSize() {
    if ($(window).width() <= 960) {
      // Ẩn các phần tử trong uk-navbar-center và uk-navbar-right
      $(".uk-navbar-center").hide();
      $(".uk-navbar-right").hide();

      // Hiển thị icon menu
      $(".menu-icon").show();
    } else {
      // Hiển thị các phần tử trong uk-navbar-center và uk-navbar-right
      $(".uk-navbar-center").show();
      $(".uk-navbar-right").show();

      // Ẩn icon menu
      $(".menu-icon").hide();
    }
  }

  // Kiểm tra kích thước màn hình khi tải trang và khi thay đổi kích thước
  checkScreenSize();
  $(window).resize(checkScreenSize);

  // Thêm sự kiện click cho icon menu
  $(".menu-icon").click(function () {
    const $dropdown = $(".uk-navbar-dropdown");
    $dropdown.toggleClass("uk-open animate__animated animate__fadeInDown");

    const $main = $("main");
    if ($dropdown.hasClass("uk-open")) {
      const $menuIcon = $(".menu-icon");
      const rect = $menuIcon[0].getBoundingClientRect();
      $dropdown.css({
        top: `${rect.bottom}px`,
        left: "auto",
        right: `${$(window).width() - rect.right}px`,
      });

      // Đẩy phần main xuống với hiệu ứng
      $main.css("margin-top", `${$dropdown.outerHeight()}px`);
      $main.addClass("transition-margin");
    } else {
      // Reset lại margin-top của main với hiệu ứng
      $main.css("margin-top", "0");
      $main.addClass("transition-margin");
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const layout = document.getElementById('layout');
  if (layout) {
      document.title = layout.getAttribute('data-title');
      const homeActive = layout.getAttribute('data-home-active');
      const productActive = layout.getAttribute('data-product-active');
      const blogActive = layout.getAttribute('data-blog-active');
      const contactActive = layout.getAttribute('data-contact-active');

      if (homeActive) document.querySelector('a[href="./home.html"]').classList.add(homeActive);
      if (productActive) document.querySelector('a[href="./product.html"]').classList.add(productActive);
      if (blogActive) document.querySelector('a[href="./blog.html"]').classList.add(blogActive);
      if (contactActive) document.querySelector('a[href="./contact.html"]').classList.add(contactActive);
  }
});
