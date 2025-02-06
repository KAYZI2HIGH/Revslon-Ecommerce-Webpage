import { products } from "./products.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const productsContainer = document.getElementById("products-container");
const cartDiv = document.getElementById("cart");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsDiv = document.getElementById("cart-items");
const cartTotalDiv = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const categoryButtons = document.querySelectorAll(".categories button");
const backdropBackground = document.querySelector(".backdrop");

const displayProducts = (category) => {
  productsContainer.innerHTML = "";
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="details">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class='addtocartbtn' product-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });

  document.querySelectorAll(".addtocartbtn").forEach((button) => {
    button.addEventListener("click", (e) => {
      addToCart(e.target.getAttribute("product-id"));
      document.querySelector(".message").classList.replace("hidden", "visible");
      const timer = setTimeout(() => {
        document
          .querySelector(".message")
          .classList.replace("visible", "hidden");
      }, 1500);
      if (timer) clearTimeout(timer);
    });
  });
};

categoryButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    displayProducts(e.target.getAttribute("data-category"));
  });
});

const addToCart = (productId) => {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateCart();
};

const updateCartCount = () => {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
};

cartBtn.addEventListener("click", () => {
  cartDiv.classList.add("open");
  backdropBackground.classList.add("open");
});

const updateCart = () => {
  cartItemsDiv.innerHTML = "";
  cartTotalDiv.textContent = `Total: $${cart
    .reduce((total, item) => {
      const product = products.find((p) => p.id === item.id);
      return total + (product?.price ?? 0) * item.quantity;
    }, 0)
    .toFixed(2)}`;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <div class='detail-container'>
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h4>${product?.name}</h4>
        <p>${item.quantity} x $${product?.price}</p>
      </div>
    </div>
    <button class='remove-btn' product-id='${product.id}'>Remove</button>
    `;
    cartItemsDiv.appendChild(div);
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      removeFromCart(e.target.getAttribute("product-id"));
    });
  });
};

closeCartBtn.addEventListener("click", () => {
  cartDiv.classList.remove("open");
  backdropBackground.classList.remove("open");
});

backdropBackground.addEventListener("click", () => {
  cartDiv.classList.remove("open");
  backdropBackground.classList.remove("open");
});

checkoutBtn.addEventListener("click", () => {
  alert("Proceeding to checkout...");
});

const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateCart();
};

displayProducts("all");
updateCartCount();
updateCart();
