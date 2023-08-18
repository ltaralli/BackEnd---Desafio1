document.addEventListener("DOMContentLoaded", function () {
  const purchaseButtons = document.querySelectorAll(".purchase-btn");
  purchaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      purchase();
    });
  });
});

async function getCartIdFromServer() {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
    });
    const data = await response.json();
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
        return cartId; // Agrega este return
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
  return cartId; // Agrega este return
}

async function purchase() {
  const cartId = await getCartId();
  console.log(cartId);
  fetch(`/api/cart/${cartId}/purchase`, {
    method: "POST",
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error al finalizar la compra");
    })
    .then(function (data) {
      Swal.fire({
        icon: "success",
        title: "Compra finalizada",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(data);
    })
    .catch(function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un problema al terminar la compra",
        footer: error,
      });
      console.error(error);
    });
}
