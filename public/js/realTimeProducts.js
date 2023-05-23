const socket = io();
socket.on("connect", () => {
  console.log("Conexión establecida con el servidor de WebSocket");
});
let log = document.getElementById('productList')


  const addProd = document.getElementById('addProduct')
addProd.addEventListener("submit", e =>{
  e.preventDefault();
  if(e){
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const thumbnails = document.getElementById('thumbnails').value;
    const newProd = {title, description, category, price, code, stock, thumbnails};
    socket.emit('product', newProd);
  }
  
  const fields = ['title', 'description', 'category', 'price', 'code', 'stock', 'thumbnails'];

  fields.forEach(field => {
    document.getElementById(field).value = '';
  });
});


  const deletProduct = document.getElementById('deletProduct')
    deletProduct.addEventListener("click", e =>{
      e.preventDefault()
      if(e){
        const deletedProduct = document.getElementById('pid').value
        socket.emit('productDelete', deletedProduct)
      }
      document.getElementById('pid').value = ''
    }
    )




    socket.on('productList', (products) => {
      let productListHTML = "";
      products.forEach(prod => {
        productListHTML += `
        <tr>
          <td>${prod.id}</td>
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
    
      const productListContainer = document.getElementById('productList');
      productListContainer.innerHTML = productListHTML;
    });
