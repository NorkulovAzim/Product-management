const checkbox = document.getElementById("skidka");
const discountField = document.getElementById("discount-field");
const loader = document.querySelector(".loader");
const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const tableBody = document.getElementById("tableBody");
const cartCount = document.getElementById("cartCount");

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
}

function loadFromLocalStorage() {
  const saved = JSON.parse(localStorage.getItem("products")) || [];
  saved.forEach((p) =>
    addRow(p.image, p.price, p.quantity, p.discount, p.total)
  );
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
    }
  });

  row.querySelector(".edit-btn").addEventListener("click", () => {
    document.getElementById("nomi").focus();
    row.remove();
    saveToLocalStorage();
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

  saveToLocalStorage();
  table.style.display = "table";
  form.reset();
  discountField.style.display = "none";
  loader.style.display = "block";
});

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);


