function changeUserRole(uid) {
  fetch(`/api/users/premium/${uid}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "successful") {
        Swal.fire({
          icon: "success",
          title: "Rol cambiado exitosamente",
          text: data.msg,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.msg,
          confirmButtonText: "Cerrar",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar el rol del usuario",
        confirmButtonText: "Cerrar",
      });
    });
}
