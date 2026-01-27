import { products } from "./products.js";

const productContainer = document.getElementById("Products-page");

function productDisplay() {
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
}

productDisplay();
