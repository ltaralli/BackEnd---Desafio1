const socket = io();

function purchase(cid) {
  Swal.fire({
    title: "Realizar compra",
    text: "¿Quieres realizar la compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("purchase", cid);
    }
  });
}

socket.on("purchase-success", (data) => {
  window.location.href = `${data.url}`;
});

socket.on("purchase-cancel", (data) => {
  Swal.fire({
    title: "Compra cancelada",
    text: "Ocurrio un error al procesar la compra",
    icon: "cancel",
  });
});
