import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import handlebars from "express-handlebars";
import homeRouter from "./routes/home.routes.js";
import { Server } from "socket.io";
import realTimeRoutes from "./routes/realTime.routes.js";
import ProductManager from "./ProductManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", homeRouter);
app.use("/realtimeproducts", realTimeRoutes);

const server = app.listen(8080, () =>
  console.log("Corriendo en el puerto: 8080")
);

const io = new Server(server);
const manager = new ProductManager();

io.on("connection", async (socket) => {
  const products = await manager.getProducts();
  io.emit("productList", products);
  socket.on("message", (data) => {
    io.emit("log", data);
  });
  socket.on("product", async (newProd) => {
    const result = await manager.addProduct(newProd);
    if (result.error) {
      // Si hay un error, envía el mensaje de error al cliente
      socket.emit("productAddError", result.error);
    } else {
      // Si no hay error, obtén la lista actualizada de productos y envíala al cliente
      const products = await manager.getProducts();
      io.emit("productList", products);
      socket.emit("productAddSuccess"); // Envía una señal de éxito al cliente
    }
  });

  socket.on("productDelete", async (deletedProduct) => {
    try {
      let pid = await manager.deleteProduct(deletedProduct);
      const products = await manager.getProducts();
      io.emit("productList", products);
    } catch (error) {
      socket.emit("productDeleteError", error.message); // Enviar mensaje de error al cliente
    }
  });
});
