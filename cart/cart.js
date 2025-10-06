const tableBody = document.getElementById("tableBody");
let cartItems = [];

function loadFromLocalStorage() {
  cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  renderTable();
}

function saveToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function renderTable() {
  tableBody.innerHTML = "";
  let totalSum = 0;

  cartItems.forEach((item) => {
    totalSum += item.total;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.image}" width="60" height="50" /></td>
      <td>${item.price.toLocaleString()} UZS</td>
      <td>${item.quantity}</td>
      <td>${item.discount}%</td>
      <td>${item.total.toLocaleString()} UZS</td>
      <td>
        <a href="https://payme.uz/">
        <img src="./payme-01.png" alt="Payme" width="100" height="80" /></a>
      </td>
      <td>
        <button class="delete-btn"><i class="fa-solid fa-xmark"></i></button>
      </td>

    `;

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("O‘chirishni hohlaysizmi?")) {
        deleteItem(item.name);
      }
    });

    tableBody.appendChild(row);
  });

  if (cartItems.length > 0) {
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
      <td colspan="4" style="text-align:right; font-weight:600;">Jami summa:</td>
      <td colspan="2" style="font-weight:600;">${totalSum.toLocaleString()} UZS</td>
    `;
    tableBody.appendChild(totalRow);
  }
}

function deleteItem(name) {
  cartItems = cartItems.filter((item) => item.name !== name);
  saveToLocalStorage();
  renderTable();
}

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
