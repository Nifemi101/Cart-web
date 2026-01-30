import { products } from "./products.js";

const productContainer = document.getElementById("Products-page");
const cartItemsContainer = document.getElementById("cart-items");

// getting cart from localStorage
function getCartFromStorage() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

// Saving cart to localStorage
function saveCartToStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Display products on products page
function productDisplay() {
  if (!productContainer) return;
  
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productHtml = `
    <div class="product-img">
        <div class="image-container">
          <img src="${product.Image}" alt="${product.name}">
          
          <button class="add-to-cart" data-id="${product.id}">
          <span class="material-symbols-outlined">
           add_shopping_cart
          </span>
          </button>
        </div>
        
        <p class="">${product.category}</p>
        <h3 class="">${product.name}</h3>
        <p class="">$${product.price.toFixed(2)}</p>
      </div>
    `;

    productContainer.insertAdjacentHTML("beforeend", productHtml);
  });

  // Add event listeners to add-to-cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

// Add product to cart
function addToCart(event) {
  const productId = parseInt(event.currentTarget.getAttribute("data-id"));
  const product = products.find((p) => p.id === productId);

  let cart = getCartFromStorage();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCartToStorage(cart);
  alert(`${product.name} added to cart!`);
}

// Display cart items on cart page
function displayCartItems() {
  if (!cartItemsContainer) return;

  const cart = getCartFromStorage();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="index.html">Continue shopping</a></p>';
    updateCartSummary(0);
    return;
  }

  cart.forEach((item) => {
    const cartItemHtml = `
      <div class="cart-item">
        <div class="item-image">
          <img src="${item.Image}">
        </div>
        <div class="item-details">
          <h3 class= "name">${item.name}</h3>
          <p class="category">${item.category}</p>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="item-quantity">
          <button class="qty-btn minus" data-id="${item.id}">-</button>
          <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="qty-input">
          <button class="qty-btn plus" data-id="${item.id}">+</button>
        </div>
        <div class="item-total">
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button class="remove-btn" data-id="${item.id}">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;
    cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHtml);
  });

  // Add event listeners for quantity buttons and remove buttons
  document.querySelectorAll(".minus").forEach((btn) => {
    btn.addEventListener("click", decreaseQuantity);
  });
  document.querySelectorAll(".plus").forEach((btn) => {
    btn.addEventListener("click", increaseQuantity);
  });
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", updateQuantity);
  });
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", removeFromCart);
  });

  updateCartSummary(cart);
}

// Increase quantity
function increaseQuantity(event) {
  const productId = parseInt(event.currentTarget.getAttribute("data-id"));
  let cart = getCartFromStorage();
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += 1;
    saveCartToStorage(cart);
    displayCartItems();
  }
}

// Decrease quantity
function decreaseQuantity(event) {
  const productId = parseInt(event.currentTarget.getAttribute("data-id"));
  let cart = getCartFromStorage();
  const item = cart.find((item) => item.id === productId);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    saveCartToStorage(cart);
    displayCartItems();
  }
}

// Update quantity
function updateQuantity(event) {
  const productId = parseInt(event.target.getAttribute("data-id"));
  const newQuantity = parseInt(event.target.value);
  if (newQuantity < 1) return;

  let cart = getCartFromStorage();
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCartToStorage(cart);
    displayCartItems();
  }
}

// Remove item from cart
function removeFromCart(event) {
  const productId = parseInt(event.currentTarget.getAttribute("data-id"));
  let cart = getCartFromStorage();
  cart = cart.filter((item) => item.id !== productId);
  saveCartToStorage(cart);
  displayCartItems();
}


function updateCartSummary(cart) {
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!subtotalElement) return;

  let subtotal = 0;
  if (Array.isArray(cart)) {
    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
  }

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

if (window.location.pathname.includes("cart.html")) {
  displayCartItems();
} else {
  productDisplay();
}
