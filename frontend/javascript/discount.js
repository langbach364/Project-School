import brands from "./list-object/list_brands.js";
import categories from "./list-object/list_categories.js";
import coupons from "./list-object/list_coupon.js";
import { getCartCount } from "./share-data/cart.js";
import { handleCoupons } from "../call-api/handler-coupon.js";
import { handleCategories } from "../call-api/handler-categories.js";
import { handleBrands } from "../call-api/handler-brands.js";

document.addEventListener("DOMContentLoaded", function () {
  const brandFilter = document.getElementById("brand-filter");
  const categoryFilter = document.getElementById("category-filter");
  const discountSection = document.querySelector(".discount-section");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const paginationContainer = document.getElementById("pagination-container");
  const resultCount = document.getElementById("result-count");

  function renderOptions(map, elementId) {
    const selectElement = document.getElementById(elementId);
    selectElement.innerHTML = '<option value="*">Tất cả</option>';
    map.forEach((value, key) => {
      if (key !== "*") {
        selectElement.appendChild(new Option(value, key));
      }
    });
  }

  function handleSearchAndFilter() {
    const searchTerm = searchInput.value.trim();
    const selectedBrand = brandFilter.value;
    const selectedCategory = categoryFilter.value;

    const matchedCoupons = Array.from(coupons.entries()).flatMap(
      ([brand, couponsArray]) =>
        couponsArray
          .filter(
            (coupon) =>
              (selectedBrand === "*" || brand === selectedBrand) &&
              (selectedCategory === "*" ||
                coupon.category_name === selectedCategory) &&
              coupon.code.includes(searchTerm)
          )
          .map((coupon) => ({ ...coupon, brand }))
    );

    displayDiscountCards(matchedCoupons, searchTerm);
  }

  function displayDiscountCards(matchedCoupons, searchTerm = "") {
    const groupedCoupons = matchedCoupons.reduce((acc, coupon) => {
      const key = `${coupon.brand}-${coupon.category_name}-${coupon.discount}`;
      if (!acc[key]) {
        acc[key] = { ...coupon, codes: [coupon.code] };
      } else {
        acc[key].codes.push(coupon.code);
      }
      return acc;
    }, {});

    const groupedCouponsArray = Object.values(groupedCoupons);

    $("#pagination-container").pagination({
      dataSource: groupedCouponsArray,
      pageSize: 6,
      callback: function (data, pagination) {
        discountSection.innerHTML = data
          .map((coupon) => createDiscountCard(coupon, searchTerm))
          .join("");
        AOS.refresh();
      },
    });

    if (resultCount) {
      resultCount.textContent = `Tìm thấy ${groupedCouponsArray.length} kết quả`;
    }
  }

  function createDiscountCard(coupon, searchTerm) {
    return `
            <div class="discount-card" data-aos="fade-up">
                <div class="discount-card-info">
                    <h3>${coupon.brand}</h3>
                    <p class="category">Danh mục: ${coupon.category_name}</p>
                    <p class="discount">Giảm giá: ${coupon.discount}%</p>
                </div>
                <div class="discount-card-actions">
                    <button class="buy-now">Get now</button>
                </div>
                <div class="discount-codes">
                    <h5>Mã giảm giá:</h5>
                    <ul>
                        ${coupon.codes
                          .map(
                            (code) => `
                            <li class="${
                              searchTerm && code.includes(searchTerm)
                                ? "highlight"
                                : ""
                            }">${code}</li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        `;
  }

  async function loadInitialData() {
    try {
      await Promise.all([handleCoupons(), handleCategories(), handleBrands()]);
      renderOptions(brands, "brand-filter");
      renderOptions(categories, "category-filter");
      displayDiscountCards(
        Array.from(coupons.entries()).flatMap(([brand, couponsArray]) =>
          couponsArray.map((coupon) => ({ ...coupon, brand }))
        )
      );
    } catch (error) {
      console.error("Không thể tải dữ liệu:", error);
    }
  }

  function setupEventListeners() {
    searchButton.addEventListener("click", handleSearchAndFilter);
    searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") handleSearchAndFilter();
    });

    window.addEventListener("couponsUpdated", () => {
      displayDiscountCards(
        Array.from(coupons.entries()).flatMap(([brand, couponsArray]) =>
          couponsArray.map((coupon) => ({ ...coupon, brand }))
        )
      );
    });
    window.addEventListener("categoriesUpdated", () => {
      renderOptions(categories, "category-filter");
      displayDiscountCards(
        Array.from(coupons.entries()).flatMap(([brand, couponsArray]) =>
          couponsArray.map((coupon) => ({ ...coupon, brand }))
        )
      );
    });
    window.addEventListener("brandsUpdated", () => {
      renderOptions(brands, "brand-filter");
      displayDiscountCards(
        Array.from(coupons.entries()).flatMap(([brand, couponsArray]) =>
          couponsArray.map((coupon) => ({ ...coupon, brand }))
        )
      );
    });
  }

  function updateCartDisplay() {
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = getCartCount();
    });
  }

  loadInitialData();
  setupEventListeners();
  updateCartDisplay();
  AOS.init();
});

function updateCartIcon() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  const itemCount = Object.keys(cartItems).length;
  $(".cart-count").text(itemCount);
}

updateCartIcon();

$(document).on("click", ".checkout-btn", function (e) {
  e.preventDefault();
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  window.location.href = "../html/checkout.html";
});

console.log("Brands:", brands);
console.log("Categories:", categories);
console.log("Coupons:", coupons);
