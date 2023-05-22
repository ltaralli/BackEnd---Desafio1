import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import handlebars from 'express-handlebars';
import homeRouter from "./routes/home.routes.js";
import { Server } from "socket.io";
import realTimeRoutes from "./routes/realTime.routes.js";

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

io.on('connection', socket =>{
    console.log("nuevo cliente conectado")
})


export { io };