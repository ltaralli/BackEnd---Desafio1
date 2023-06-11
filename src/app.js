import express from "express";
import handlebars from "express-handlebars";
import ProductManager from "./DAO/productsDAO.js";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import homeRouter from "./routes/home.routes.js";
import realTimeRoutes from "./routes/realTime.routes.js";
import messagesRouter from "./routes/messages.routes.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

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
app.use("/messages", messagesRouter);

const server = app.listen(8080, () =>
  console.log("Corriendo en el puerto: 8080")
);

mongoose.connect(
  "mongodb+srv://ltaralli:coder1234@cluster0.k7b3exc.mongodb.net/ecommerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Error de conexión:", error);
});

db.once("open", () => {
  console.log("Conexión exitosa a la base de datos.");
});

// ...

// Verificar el estado de la conexión
if (mongoose.connection.readyState === 1) {
  console.log("Estás conectado a la base de datos.");
} else {
  console.log("No estás conectado a la base de datos.");
}

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
      socket.emit("productAddError", result.error);
    } else {
      const products = await manager.getProducts();
      io.emit("productList", products);
      socket.emit("productAddSuccess");
    }
  });

  socket.on("productDelete", async (delProduct) => {
    try {
      let pid = await manager.deleteProduct(delProduct);
      const products = await manager.getProducts();
      io.emit("productList", products);
    } catch (error) {
      socket.emit("productDeleteError", error.message);
    }
  });
});
