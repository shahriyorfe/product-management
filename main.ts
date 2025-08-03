// main.ts

let selectedIndex: number | null = null;

interface Product {
  id: number;
  title: string;
  price: number;
  tax: number;
  total: number;
}

const products = {
  productList: JSON.parse(
    localStorage.getItem("products") || "[]"
  ) as Product[],

  proName: null as HTMLInputElement | null,
  price: null as HTMLInputElement | null,
  tax: null as HTMLInputElement | null,
  total: null as HTMLInputElement | null,
  submitBtn: null as HTMLButtonElement | null,
  searchInput: null as HTMLInputElement | null,
  tableBody: null as HTMLTableSectionElement | null,

  init(): void {
    this.proName = document.getElementById("title") as HTMLInputElement;
    this.price = document.getElementById("price") as HTMLInputElement;
    this.tax = document.getElementById("tax") as HTMLInputElement;
    this.total = document.getElementById("total") as HTMLInputElement;
    this.submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
    this.searchInput = document.querySelector(
      ".product-table input[placeholder='Search']"
    ) as HTMLInputElement;
    this.tableBody = document.querySelector(
      ".product-table tbody"
    ) as HTMLTableSectionElement;

    this.submitBtn.addEventListener("click", () => {
      if (selectedIndex === null) {
        this.addProduct();
      } else {
        this.saveProduct();
      }
    });

    this.searchInput.addEventListener("input", () => {
      this.searchProduct();
    });

    this.renderTable();
  },

  saveToStorage(): void {
    localStorage.setItem("products", JSON.stringify(this.productList));
  },

  getProductFromInput(): Product {
    const title = this.proName!.value.trim();
    const price = parseFloat(this.price!.value.trim()) || 0;
    const tax = parseFloat(this.tax!.value.trim()) || 0;
    const total = price + tax;

    this.total!.value = total.toString();

    const id =
      selectedIndex === null
        ? this.productList.length > 0
          ? this.productList[this.productList.length - 1].id + 1
          : 1
        : this.productList[selectedIndex].id;

    return { id, title, price, tax, total };
  },

  addProduct(): void {
    const product = this.getProductFromInput();
    if (!product.title) return alert("Title majburiy!");

    this.productList.push(product);
    this.saveToStorage();
    this.renderTable();
    this.clearInputs();
  },

  clearInputs(): void {
    this.proName!.value = "";
    this.price!.value = "";
    this.tax!.value = "";
    this.total!.value = "";
    selectedIndex = null;
    this.submitBtn!.textContent = "Submit";
  },

  renderTable(filteredList: Product[] | null = null): void {
    const list = filteredList || this.productList;
    this.tableBody!.innerHTML = "";

    if (list.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="6" class="text-center text-danger">Bunday element mavjud emas</td>`;
      this.tableBody!.appendChild(row);
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
      this.tableBody!.appendChild(row);
    });
  },

  editProduct(index: number): void {
    const product = this.productList[index];
    this.proName!.value = product.title;
    this.price!.value = product.price.toString();
    this.tax!.value = product.tax.toString();
    this.total!.value = product.total.toString();
    selectedIndex = index;
    this.submitBtn!.textContent = "Save";
  },

  saveProduct(): void {
    const updated = this.getProductFromInput();
    if (!updated.title) return alert("Bo'sh qatorlarni to'ldiring!");

    this.productList[selectedIndex!] = updated;
    this.saveToStorage();
    this.renderTable();
    this.clearInputs();
  },

  deleteProduct(index: number): void {
    if (confirm("Haqiqatan ham ushbu mahsulotni o‘chirmoqchimisiz?")) {
      this.productList.splice(index, 1);
      this.saveToStorage();
      this.renderTable();
      this.clearInputs();
    }
  },

  searchProduct(): void {
    const term = this.searchInput!.value.trim().toLowerCase();
    const filtered = this.productList.filter((product) =>
      product.title.toLowerCase().includes(term)
    );
    this.renderTable(filtered);
  },
};

window.addEventListener("DOMContentLoaded", () => {
  products.init();
});
