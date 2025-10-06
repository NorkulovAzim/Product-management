const checkbox = document.getElementById("skidka");
const discountField = document.getElementById("discount-field");
const loader = document.querySelector(".loader");
const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const tableBody = document.getElementById("tableBody");
const cartCount = document.getElementById("cartCount");

const cart = document.getElementById("cart");
const openCartBtn = document.getElementById("side-bar-btn");
const closeCartBtn = document.querySelector(".cart-close-btn");
const cartMenu = document.querySelector(".cart-menu");
const priceBar = document.querySelector(".price-bar p");
const priceTotal = document.querySelector(".price-bar span");
const countSpan = document.querySelector("#side-bar-btn span");

let cartItems = [];

function saveToLocalStorage() {
  const rows = [];
  tableBody.querySelectorAll("tr").forEach((row) => {
    const cells = row.querySelectorAll("td");
    rows.push({
      image: cells[0].querySelector("img").src,
      price: cells[1].textContent,
      quantity: cells[2].textContent,
      discount: cells[3].textContent,
      total: cells[4].textContent,
    });
  });
  localStorage.setItem("products", JSON.stringify(rows));
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function loadFromLocalStorage() {
  const saved = JSON.parse(localStorage.getItem("products")) || [];
  const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

  saved.forEach((p) =>
    addRow(p.image, p.price, p.quantity, p.discount, p.total)
  );

  cartItems = savedCart;
  renderCart();

  if (saved.length > 0) table.style.display = "table";
}

function addRow(image, price, quantity, discount, total) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><img src="${image}" width="70" height="50"></td>
    <td>${price}</td>
    <td>${quantity}</td>
    <td>${discount}</td>
    <td>${total}</td>
    <td>
      <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
      <button class="delete-btn"><i class="fa-solid fa-xmark"></i></button>
    </td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    if (confirm("O‘chirishni hohlaysizmi?")) {
      row.remove();
      saveToLocalStorage();
      cartCounter();
      renderCart();
    }
  });

  row.querySelector(".edit-btn").addEventListener("click", () => {
    document.getElementById("nomi").focus();
    row.remove();
    saveToLocalStorage();
    cartCounter();
    renderCart();
  });

  tableBody.appendChild(row);
}

checkbox.addEventListener("change", () => {
  discountField.style.display = checkbox.checked ? "block" : "none";
  loader.style.display = checkbox.checked ? "none" : "block";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("nomi").value;
  const image = document.getElementById("rasm").value || "./icon1.svg";
  const price = parseFloat(document.getElementById("narx").value);
  const quantity = parseInt(document.getElementById("soni").value);
  const discountChecked = checkbox.checked;
  const discount = discountChecked
    ? parseInt(document.getElementById("sale").value) || 0
    : 0;

  if (!name || !price || !quantity) {
    alert("Iltimos, barcha maydonlarni to‘ldiring!");
    return;
  }

  let total = price * quantity;
  if (discount > 0) total -= (total * discount) / 100;

  addRow(
    image,
    `${price.toLocaleString()} UZS`,
    quantity,
    `${discount}%`,
    `${total.toLocaleString()} UZS`
  );

  const existing = cartItems.find((item) => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({ name, image, price, quantity, discount, total });
  }

  renderCart();
  saveToLocalStorage();
  table.style.display = "table";
  form.reset();
  discountField.style.display = "none";
  loader.style.display = "block";
  cartCounter();

  saveToLocalStorage();
  table.style.display = "table";
  form.reset();
  discountField.style.display = "none";
  loader.style.display = "block";

  cartCounter();
});

function renderCart() {
  cartMenu.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    total += item.total;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" width="50"  alt="">
      <div>
        <p>${item.name}</p>
        <span>${item.quantity} x ${item.price.toLocaleString()} UZS</span>
      </div>
      <button class="btn shop-close-btn" data-index="${index}">
        <i class="fas fa-close"></i>
      </button>
    `;

    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.padding = "10px 0";
    cartMenu.appendChild(div);
  });

  priceBar.textContent = `${cartItems.length} Product${
    cartItems.length > 1 ? "s" : ""
  }`;
  priceTotal.textContent = `${total.toLocaleString()} UZS`;

  document.querySelectorAll(".shop-close-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.closest("button").dataset.index;
      cartItems.splice(index, 1);
      renderCart();
      saveToLocalStorage();
      cartCounter();
    });
  });
}

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

function cartCounter() {
  const cartIcon = document.querySelector("#side-bar-btn span");
  const totalItems = document.querySelectorAll("#tableBody tr").length;
  cartIcon.textContent = totalItems;
}

document.addEventListener("DOMContentLoaded", () => {
  cartCounter();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

openCartBtn.addEventListener("click", () => {
  cart.classList.add("show");
});

closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("show");
});
