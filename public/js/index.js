const socket = io();

socket.on('newProduct', (product) => {
    console.log('Nuevo producto:', product);
  });
