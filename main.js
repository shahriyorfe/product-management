"use strict";
// main.ts
let selectedIndex = null;
const products = {
    productList: JSON.parse(localStorage.getItem("products") || "[]"),
    proName: null,
    price: null,
    tax: null,
    total: null,
    submitBtn: null,
    searchInput: null,
    tableBody: null,
    init() {
        this.proName = document.getElementById("title");
        this.price = document.getElementById("price");
        this.tax = document.getElementById("tax");
        this.total = document.getElementById("total");
        this.submitBtn = document.getElementById("submit-btn");
        this.searchInput = document.querySelector(".product-table input[placeholder='Search']");
        this.tableBody = document.querySelector(".product-table tbody");
        this.submitBtn.addEventListener("click", () => {
            if (selectedIndex === null) {
                this.addProduct();
            }
            else {
                this.saveProduct();
            }
        });
        this.searchInput.addEventListener("input", () => {
            this.searchProduct();
        });
        this.renderTable();
    },
    saveToStorage() {
        localStorage.setItem("products", JSON.stringify(this.productList));
    },
    getProductFromInput() {
        const title = this.proName.value.trim();
        const price = parseFloat(this.price.value.trim()) || 0;
        const tax = parseFloat(this.tax.value.trim()) || 0;
        const total = price + tax;
        this.total.value = total.toString();
        const id = selectedIndex === null
            ? this.productList.length > 0
                ? this.productList[this.productList.length - 1].id + 1
                : 1
            : this.productList[selectedIndex].id;
        return { id, title, price, tax, total };
    },
    addProduct() {
        const product = this.getProductFromInput();
        if (!product.title)
            return alert("Title majburiy!");
        this.productList.push(product);
        this.saveToStorage();
        this.renderTable();
        this.clearInputs();
    },
    clearInputs() {
        this.proName.value = "";
        this.price.value = "";
        this.tax.value = "";
        this.total.value = "";
        selectedIndex = null;
        this.submitBtn.textContent = "Submit";
    },
    renderTable(filteredList = null) {
        const list = filteredList || this.productList;
        this.tableBody.innerHTML = "";
        if (list.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="6" class="text-center text-danger">Bunday element mavjud emas</td>`;
            this.tableBody.appendChild(row);
            return;
        }
        list.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.tax}</td>
        <td>${product.total}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="products.editProduct(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="products.deleteProduct(${index})">Delete</button>
        </td>
      `;
            this.tableBody.appendChild(row);
        });
    },
    editProduct(index) {
        const product = this.productList[index];
        this.proName.value = product.title;
        this.price.value = product.price.toString();
        this.tax.value = product.tax.toString();
        this.total.value = product.total.toString();
        selectedIndex = index;
        this.submitBtn.textContent = "Save";
    },
    saveProduct() {
        const updated = this.getProductFromInput();
        if (!updated.title)
            return alert("Bo'sh qatorlarni to'ldiring!");
        this.productList[selectedIndex] = updated;
        this.saveToStorage();
        this.renderTable();
        this.clearInputs();
    },
    deleteProduct(index) {
        if (confirm("Haqiqatan ham ushbu mahsulotni o‘chirmoqchimisiz?")) {
            this.productList.splice(index, 1);
            this.saveToStorage();
            this.renderTable();
            this.clearInputs();
        }
    },
    searchProduct() {
        const term = this.searchInput.value.trim().toLowerCase();
        const filtered = this.productList.filter((product) => product.title.toLowerCase().includes(term));
        this.renderTable(filtered);
    },
};
window.addEventListener("DOMContentLoaded", () => {
    products.init();
});
