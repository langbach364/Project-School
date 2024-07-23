import { resetCartCount } from "./share-data/cart.js";
import coupons from "./list-object/list_coupon.js";
import { handleCoupons } from "../call-api/handler-coupon.js";

$(document).ready(function () {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  const cartSummary = $("#cart-summary");
  const categorySelect = $("#category-select");
  const brandSelect = $("#brand-select");
  const couponSelect = $("#coupon-select");

  function calculateTotals() {
    const totals = {};
    let overallTotal = 0;
    let overallQuantity = 0;

    Object.values(cartItems).forEach((item) => {
      const key = `${item.brand}_${item.category}`;
      if (!totals[key]) {
        totals[key] = {
          brand: item.brand,
          category: item.category,
          total: 0,
          quantity: 0,
          discountedTotal: 0,
          discountApplied: false,
        };
      }
      const itemTotal = item.price * item.quantity;
      totals[key].total += itemTotal;
      totals[key].quantity += item.quantity;
      totals[key].discountedTotal += itemTotal;
      overallTotal += itemTotal;
      overallQuantity += item.quantity;
    });

    return { totals, overallTotal, overallQuantity };
  }

  function updateCartSummary(totals) {
    let detailsHTML = '<ul class="uk-list uk-list-divider">';
    Object.values(totals).forEach((item) => {
      const originalPrice = item.total.toLocaleString();
      const discountedPrice = item.discountedTotal.toLocaleString();
      const discountPercentage = (
        ((item.total - item.discountedTotal) / item.total) *
        100
      ).toFixed(0);

      detailsHTML += `
        <li>
          <div class="uk-grid-small" uk-grid>
            <div class="uk-width-expand">
              <h4 class="uk-margin-remove">${item.brand} - ${item.category}</h4>
              <p class="uk-text-small uk-margin-remove-top">${
                item.quantity
              } sản phẩm</p>
            </div>
            <div class="uk-width-auto">
              <span class="uk-text-muted" style="${
                item.discountApplied ? "text-decoration: line-through;" : ""
              }">
                ${originalPrice} VND
              </span>
              ${
                item.discountApplied
                  ? `
                <br>
                <span class="uk-text-success uk-text-bold">
                  ${discountedPrice} VND
                  <span class="uk-label uk-label-success uk-margin-small-left">-${discountPercentage}%</span>
                </span>
              `
                  : ""
              }
            </div>
          </div>
        </li>
      `;
    });
    detailsHTML += "</ul>";
    $("#cart-details .uk-accordion-content").html(detailsHTML);

    const totalOriginal = Object.values(totals).reduce(
      (acc, item) => acc + item.total,
      0
    );
    const totalDiscounted = Object.values(totals).reduce(
      (acc, item) => acc + item.discountedTotal,
      0
    );
    const totalQuantity = Object.values(totals).reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    let totalHTML = `
      <div id="total-amount-content" class="uk-text-right">
        <p class="uk-text-lead"><strong>Tổng cộng:</strong> ${totalQuantity} sản phẩm</p>
        <p class="uk-text-medium ${
          totalOriginal !== totalDiscounted ? "uk-text-muted" : ""
        }">
          <span ${
            totalOriginal !== totalDiscounted
              ? 'style="text-decoration: line-through;"'
              : ""
          }>
            ${totalOriginal.toLocaleString()} VND
          </span>
        </p>
        ${
          totalOriginal !== totalDiscounted
            ? `
          <p class="uk-text-large uk-text-success">
            <strong>${totalDiscounted.toLocaleString()} VND</strong>
            <span class="uk-label uk-label-success uk-margin-small-left">
              -${(
                ((totalOriginal - totalDiscounted) / totalOriginal) *
                100
              ).toFixed(0)}%
            </span>
          </p>
        `
            : ""
        }
      </div>
    `;
    $("#cart-total .uk-accordion-content").html(totalHTML);

    UIkit.update();
  }

  function updateSelectBoxes() {
    const categories = new Set();
    const brands = new Set();

    Object.values(cartItems).forEach((item) => {
      categories.add(item.category);
      brands.add(item.brand);
    });

    updateSelect(categorySelect, Array.from(categories));
    updateSelect(brandSelect, Array.from(brands));
  }

  function updateSelect(selectElement, options) {
    selectElement.empty().append(new Option("Chọn", ""));
    options
      .sort()
      .forEach((option) => selectElement.append(new Option(option, option)));
  }

  function updateCouponSelect() {
    const selectedCategory = categorySelect.val();
    const selectedBrand = brandSelect.val();

    couponSelect.empty().append(new Option("Chọn mã giảm giá", ""));

    if (selectedCategory && selectedBrand) {
      const brandCoupons = coupons.get(selectedBrand);
      if (brandCoupons) {
        brandCoupons.forEach((coupon) => {
          if (coupon.category_name === selectedCategory) {
            couponSelect.append(
              new Option(
                `${coupon.code} (Giảm ${coupon.discount}%)`,
                coupon.code
              )
            );
          }
        });
      }
    }
  }

  function applyCoupon() {
    const selectedCoupon = couponSelect.val();
    const selectedCategory = categorySelect.val();
    const selectedBrand = brandSelect.val();

    const brandCoupons = coupons.get(selectedBrand);
    const coupon = brandCoupons
      ? brandCoupons.find(
          (c) =>
            c.code === selectedCoupon && c.category_name === selectedCategory
        )
      : null;

    if (coupon) {
      const { totals, overallTotal, overallQuantity } = calculateTotals();
      const key = `${selectedBrand}_${selectedCategory}`;

      if (totals[key]) {
        totals[key].discountedTotal =
          totals[key].total * (1 - coupon.discount / 100);
        totals[key].discountApplied = true;
      }

      const discountAmount = totals[key]
        ? totals[key].total - totals[key].discountedTotal
        : 0;
      const finalTotal = overallTotal - discountAmount;

      $("#discount-message")
        .text(
          `Áp dụng mã giảm giá thành công! Bạn được giảm ${
            coupon.discount
          }% cho ${selectedBrand} - ${selectedCategory} (${discountAmount.toLocaleString()} VND)`
        )
        .css("color", "green");

      updateCartDisplay(totals, finalTotal, overallQuantity);
    } else {
      $("#discount-message")
        .text("Mã giảm giá không hợp lệ!")
        .css("color", "red");
    }
  }

  function updateCartDisplay(totals, overallTotal, overallQuantity) {
    updateCartSummary(totals);
    $("#total-amount").html(
      `Tổng cộng: ${overallQuantity} sản phẩm, ${overallTotal.toLocaleString()} VND`
    );
  }

  function initializeCheckout() {
    if (Object.keys(cartItems).length > 0) {
      const { totals, overallTotal, overallQuantity } = calculateTotals();
      updateCartDisplay(totals, overallTotal, overallQuantity);
      updateSelectBoxes();
    } else {
      cartSummary.html(
        '<div class="uk-alert-warning" uk-alert><p>Giỏ hàng trống</p></div>'
      );
    }
  }

  $(document).on(
    "change",
    "#category-select, #brand-select",
    updateCouponSelect
  );
  couponSelect.on("change", applyCoupon);

  $("#checkout-form").on("submit", function (e) {
    e.preventDefault();
    UIkit.notification({ message: "Đặt hàng thành công!", status: "success" });
    localStorage.removeItem("cartItems");
    resetCartCount();
    setTimeout(() => {
      window.location.href = "product.html";
    }, 2000);
  });

  $("#selected-bank").on("click", function () {
    $("#bank-options").toggle();
  });

  $("#bank-options").on("click", "div", function () {
    const selectedBank = $(this).data("value");
    const selectedLogo = $(this).data("logo");
    const selectedText = $(this).find("span").text();

    $("#selected-bank img").attr("src", selectedLogo);
    $("#selected-bank span").text(selectedText);
    $("#bank-options").hide();

    updateBankOptions(selectedBank);

    $("#qr-section").toggle(selectedBank !== "VCB");
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".custom-select-container").length) {
      $("#bank-options").hide();
    }
  });

  function updateBankOptions(selectedBank) {
    const bankOptions = [
      { value: "MoMo", logo: "../image/momo.jpg", text: "MoMo" },
      { value: "VCB", logo: "../image/vcb.png", text: "Vietcombank" },
    ];

    const filteredOptions = bankOptions.filter(
      (bank) => bank.value !== selectedBank
    );

    const bankOptionsContainer = $("#bank-options").empty();

    filteredOptions.forEach((bank) => {
      bankOptionsContainer.append(`
        <div data-value="${bank.value}" data-logo="${bank.logo}">
          <img src="${bank.logo}" alt="${bank.text}">
          <span>${bank.text}</span>
        </div>
      `);
    });
  }

  updateBankOptions("MoMo");
  initializeCheckout();

  handleCoupons().then(() => {
    console.log("Updated List of Coupons:", coupons);
    updateCouponSelect();
  });

  window.addEventListener("storage", function (e) {
    if (e.key === "cartItems") {
      cartItems = JSON.parse(e.newValue) || {};
      initializeCheckout();
    }
  });

  window.addEventListener("couponsUpdated", function (event) {
    console.log("Coupons updated event received:", event.detail);
    updateCouponSelect();
  });
});
