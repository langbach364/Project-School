let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
let cartCount = Math.max(0, parseInt(localStorage.getItem('cartCount')) || 0);

function updateCartState() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartCount', cartCount);
}

export function updateCartUI() {
    $(".uk-badge.cart-count").text(cartCount);
}

export function resetCartCount() {
    cartCount = 0;
    cartItems = {};
    updateCartState();
    updateCartUI();
}

export function showCartModal() {
    let cartItemsHtml = "";
    let totalAmount = 0;

    Object.values(cartItems).forEach(item => {
        totalAmount += item.total;
        cartItemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.brand}</td>
                <td>${item.category}</td>
                <td>${item.price.toLocaleString()} VND</td>
                <td>
                    <input type="number" class="uk-input quantity-input" data-name="${item.name}" value="${item.quantity}" min="1">
                </td>
                <td class="item-total">${item.total.toLocaleString()} VND</td>
                <td>
                    <button class="uk-button uk-button-danger remove-btn remove-from-cart" data-name="${item.name}">Xóa</button>
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
}

export function updateTotalAmount() {
    const totalAmount = Object.values(cartItems).reduce((sum, item) => sum + item.total, 0);
    $(".total-amount").text(totalAmount.toLocaleString() + " VND");
}

export function addToCart(product) {
    if (!cartItems[product.name]) {
        cartItems[product.name] = {
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            quantity: 1,
            total: product.price,
        };
    } else {
        cartItems[product.name].quantity++;
        cartItems[product.name].total = cartItems[product.name].quantity * cartItems[product.name].price;
    }
    cartCount++;
    updateCartState();
    return cartItems[product.name].quantity;
}

export function removeFromCart(productName) {
    if (cartItems[productName]) {
        cartCount = Math.max(0, cartCount - cartItems[productName].quantity);
        delete cartItems[productName];
        updateCartState();
        updateCartUI();
    }
}

export function updateCartItemQuantity(productName, newQuantity) {
    if (cartItems[productName]) {
        newQuantity = Math.max(0, Math.floor(newQuantity));
        const difference = newQuantity - cartItems[productName].quantity;
        cartCount = Math.max(0, cartCount + difference);
        
        if (newQuantity === 0) {
            delete cartItems[productName];
        } else {
            cartItems[productName].quantity = newQuantity;
            cartItems[productName].total = cartItems[productName].quantity * cartItems[productName].price;
        }
        
        updateCartState();
        updateCartUI();
        updateTotalAmount();
    }
}

export function clearCart() {
    cartItems = {};
    cartCount = 0;
    updateCartState();
    updateCartUI();
}

export function getCartCount() {
    return cartCount;
}

export function initializeCartEventListeners() {
    UIkit.util.on("#cartModal", "beforeshow", showCartModal);

    $(document).on("change", ".quantity-input", function () {
        const productName = $(this).data("name");
        const newQuantity = parseInt($(this).val());
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updateCartItemQuantity(productName, newQuantity);
            showCartModal();
        } else {
            $(this).val(1);
            updateCartItemQuantity(productName, 1);
            showCartModal();
        }
    });

    $(document).on("click", ".remove-from-cart", function () {
        const productName = $(this).data("name");
        removeFromCart(productName);
        showCartModal();
    });

    $(document).on("click", ".checkout-btn", function (e) {
        e.preventDefault();
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        window.location.href = "../html/checkout.html";
    });
}

updateCartUI();
initializeCartEventListeners();
export { cartItems };
