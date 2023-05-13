import express from "express";

import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));



app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter)

const server = app.listen(8080, () => console.log('Corriendo en el puerto: 8080'))