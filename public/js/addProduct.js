document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const cidElement = document.querySelector(".cartID");
  const cid = cidElement.textContent.trim(); // Obtiene solo el texto y elimina espacios en blanco al principio y al final
  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId;
      let cartID = cidElement.value;
      addToCart(productId, cartID);
    });
  });
});

async function addToCart(productId, cid) {
  try {
    const response = await fetch(`api/cart/${cid}/product/${productId}`, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 750,
      });
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un problema al agregar el producto",
        footer: `<b>${errorData.msg}</b>`,
      });
      console.error(errorData);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getCartIdFromServer() {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
    });
    const data = await response.json();
    let contenedorID = document.getElementsByClassName("cart-id")[0];
    contenedorID.innerHTML = `<a href="/carts/${data.cartId}">${data.cartId}</a>`;
    return data.cartId;
  } catch (error) {
    console.error("Error al obtener el ID del carrito:", error);
    throw error;
  }
}

function getCartId() {
  let cartId = localStorage.getItem("cartId");
  if (!cartId) {
    return getCartIdFromServer()
      .then(function (cartId) {
        localStorage.setItem("cartId", cartId);
        return cartId;
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hubo un problema al generar el carrito",
        });
        console.error(error);
        throw error;
      });
  }
  let contenedorID = document.getElementsByClassName("cart-id")[0];
  contenedorID.innerHTML = `<a href="/carts/${cartId}">CARRITO</a>`;
  return Promise.resolve(cartId);
}
