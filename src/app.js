import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import handlebars from 'express-handlebars';
import homeRouter from "./routes/home.routes.js";
import { Server } from "socket.io";
import realTimeRoutes from "./routes/realTime.routes.js";
import ProductManager from "./ProductManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/', homeRouter)
app.use('/realtimeproducts', realTimeRoutes)

const server = app.listen(8080, () => console.log('Corriendo en el puerto: 8080'));

const io = new Server(server);
const manager = new ProductManager()

io.on('connection', async socket =>{
    console.log("Nuevo usuario conectado")
    const products = await manager.getProducts()
    io.emit("productList", products)
    socket.on("message", data =>{
        io.emit("log", data)
    })
    socket.on("product", async newProd =>{
        console.log(`LO QUE LLEGA DEL SOCKET: ${newProd.title} ${newProd.code}`)
        let newProduct = await manager.addProduct(newProd)
        console.log(`LO QUE se almacena del addProducts: ${newProduct}`)
        const products = await manager.getProducts()
        console.log(`LO QUE SE OBTIERNE DE GETPRODUCTS: ${products}`)
        io.emit("productList", products)
    })
    socket.on("productDelete", async deletedProduct =>{
        console.log(deletedProduct)
        let pid = await manager.deleteProduct(deletedProduct)
        const products = await manager.getProducts()
        io.emit("productList", products)

    })
})
