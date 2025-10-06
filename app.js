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

function toNumber(val) {
  return Number(val) || 0;
}

function saveToLocalStorage() {
  const rows = [];
  tableBody.querySelectorAll("tr").forEach((row) => {
    const cells = row.querySelectorAll("td");
    rows.push({
      image: cells[0].querySelector("img").src,
      price: cells[1].innerHTML,
      quantity: cells[2].innerHTML,
      discount: cells[3].innerHTML,
      total: cells[4].innerHTML,
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

  cartItems = savedCart.map((it) => ({
    name: it.name,
    image: it.image,
    price: toNumber(it.price),
    quantity: toNumber(it.quantity),
    discount: toNumber(it.discount),
    total: toNumber(it.total),
  }));

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
      const productName = row
        .querySelector("td:nth-child(2)")
        .textContent.trim();

      row.remove();

      cartItems = cartItems.filter((item) => item.name !== productName);

      saveToLocalStorage();
      renderCart();
      cartCounter();
    }
  });

  row.querySelector(".edit-btn").addEventListener("click", () => {
    const productName = row.querySelector("td:nth-child(2)").textContent.trim();
    document.getElementById("nomi").focus();
    row.remove();

    cartItems = cartItems.filter((item) => item.name !== productName);

    saveToLocalStorage();
    renderCart();
    cartCounter();
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
    cartItems.push({
      name,
      image,
      price: Number(price),
      quantity: Number(quantity),
      discount: Number(discount),
      total: Number(total),
    });
  }

  renderCart();
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
    const itemTotal = toNumber(item.total);
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" width="50"  alt="">
      <div>
        <p>${item.name}</p>
        <span>${toNumber(item.quantity)} x ${Number(
      item.price
    ).toLocaleString()} UZS</span>
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

  priceBar.textContent = `${cartItems.length} Mahsulot(lar)${
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

  cartCounter();
}

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

function cartCounter() {
  const cartIcon = document.querySelector("#side-bar-btn span");
  const totalItems = document.querySelectorAll("#tableBody tr").length;
  if (cartIcon) cartIcon.textContent = totalItems;
}

document.addEventListener("DOMContentLoaded", () => {
  cartCounter();
});

openCartBtn.addEventListener("click", () => {
  cart.classList.add("show");
});

closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("show");
});
