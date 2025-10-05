const checkbox = document.getElementById("skidka");
const discountField = document.getElementById("discount-field");
const loader = document.querySelector(".loader");

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    discountField.style.display = "block";
    loader.style.display = "none";
  } else {
    discountField.style.display = "none";
    loader.style.display = "block";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const table = document.getElementById("productTable");
  const tableBody = document.getElementById("tableBody");
  const skidka = document.getElementById("skidka");
  const discountField = document.getElementById("discount-field");

  skidka.addEventListener("change", () => {
    if (skidka.checked) {
      discountField.style.display = "block";
      loader.style.display = "none";
    } else {
      discountField.style.display = "none";
      loader.style.display = "block";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("nomi").value;
    const image = document.getElementById("rasm").value || "./icon1.svg";
    const price = parseFloat(document.getElementById("narx").value);
    const quantity = parseInt(document.getElementById("soni").value);
    const discountChecked = skidka.checked;
    const discount = discountChecked
      ? parseInt(document.getElementById("sale").value) || 0
      : 0;

    if (!name || !price || !quantity) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    let total = price * quantity;
    if (discount > 0) {
      total = total - (total * discount) / 100;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td><img src="${image}" alt="${name}" width="70" height="50"></td>
            <td>${price.toLocaleString()} UZS</td>
            <td>${quantity}</td>
            <td>${discount}%</td>
            <td>${total.toLocaleString()} UZS</td>
            <td>
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-xmark"></i></button>
            </td>
          `;

    tableBody.appendChild(row);

    table.style.display = "table";
    loader.style.display = "block";

    form.reset();
    discountField.style.display = "none";

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("O'chirishni hohlaysizmi?")) {
        row.remove();
      }
    });
  });
});
