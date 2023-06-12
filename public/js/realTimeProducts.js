const socket = io();
socket.on("connect", () => {
  console.log("Conexión establecida con el servidor de WebSocket");
});
socket.on("productAddError", (error) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Ingresa un CODE diferente",
  });
});

socket.on("productAddSuccess", () => {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
  document.getElementById("price").value = "";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("thumbnails").value = "";
});

let log = document.getElementById("productList");

const addProd = document.getElementById("addProduct");
addProd.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e) {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    const thumbnails = document.getElementById("thumbnails").value;
    const newProd = {
      title,
      description,
      category,
      price,
      code,
      stock,
      thumbnails,
    };
    socket.emit("product", newProd);
  }
});

const deletProduct = document.getElementById("deletProduct");
deletProduct.addEventListener("click", (e) => {
  e.preventDefault();
  if (e) {
    const delProduct = document.getElementById("pid").value;
    socket.emit("productDelete", delProduct);
  }
  document.getElementById("pid").value = "";
});

socket.on("productDeleteError", (errorMessage) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Ingresa un CODE diferente",
  });
});

socket.on("productList", (products) => {
  let productListHTML = "";
  products.forEach((prod) => {
    productListHTML += `
        <tr>
          <td>${prod._id}</td>
          <td>${prod.title}</td>
          <td>${prod.description}</td>
          <td>${prod.category}</td>
          <td>${prod.price}</td>
          <td>${prod.code}</td>
          <td>${prod.stock}</td>
          <td>${prod.status}</td>
          <td>${prod.thumbnails}</td>
        </tr>
        `;
  });

  const productListContainer = document.getElementById("productList");
  productListContainer.innerHTML = productListHTML;
});
