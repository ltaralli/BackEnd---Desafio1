const socket = io();
socket.on("connect", () => {
  console.log("Conexión establecida con el servidor de WebSocket");
});
let log = document.getElementById('productList')

const addProd = document.getElementById('addProd')
addProd.addEventListener("click", e =>{
  if(e){
    const title = document.getElementById('title').value 
    const description = document.getElementById('description').value
    const category = document.getElementById('category').value
    const price = document.getElementById('price').value
    const code = document.getElementById('code').value
    const stock = document.getElementById('stock').value
    const thumbnails = document.getElementById('thumbnails').value
    const newProduct = {title, description, category, price, code, stock, thumbnails}
    socket.emit('product', newProduct)
  }
})

const deletProduct = document.getElementById('deletProduct')
deletProduct.addEventListener("click", e=>{
  if(e){
    const productID = document.getElementById('pid').value
    socket.emit('productDelete', productID)
  }
})

socket.on('productList', (products) => {
  console.log(products)
  let productListHTML = "";
  products.forEach(prod => {
    productListHTML += `<p> ========= </p>
    ${prod.id}<br/>
    ${prod.title}<br/>
    ${prod.description}<br/>
    ${prod.category}<br/>
    ${prod.price}<br/>
    ${prod.code}<br/>
    ${prod.stock}<br/>
    ${prod.thumbnails}<br/>
    ${prod.status}<br/>
    

    
    
    
    
    
    `
    
  });
  });
