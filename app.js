import express from "express";
import handlebars from "express-handlebars";
import ifEqHelper from "./src/helpers/handlebars-helpers.js";
import { multiplyHelper, calculateTotal } from "./src/helpers/cartHelper.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import ProductManager from "./src/DAO/productsDAO.js";
import MessagesManager from "./src/DAO/messagesDAO.js";
import cartRouter from "./src/routes/cart.routes.js";
import productsRouter from "./src/routes/products.routes.js";
import viewsRouter from "./src/routes/views.routes.js";
import sessionRouter from "./src/routes/session.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import config from "./src/config/config.js";

// VARIABLES DE ENTORNO
const PORT = config.port;
const mongoURL = config.mongoUrl;
const sessionSecret = config.sessionSecret;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine(
  "handlebars",
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      if_eq: ifEqHelper,
      multiply: multiplyHelper,
      calculateTotal: calculateTotal,
    },
  })
);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoURL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 250,
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();

app.use(passport.initialize());
app.use(passport.session());

app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/session", sessionRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () =>
  console.log(`Corriendo en el puerto: ${server.address().port}`)
);

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Error de conexión:", error);
});

db.once("open", () => {
  console.log("Conexión exitosa a la base de datos.");
});

const io = new Server(server);
const manager = new ProductManager();
const managerMsg = new MessagesManager();
const message = [];

io.on("connection", async (socket) => {
  console.log("nuevo cliente conectado");
  const products = await manager.getProducts();
  io.emit("productList", products);
  socket.on("product", async (newProd) => {
    const resultAdd = await manager.addProduct(newProd);
    if (resultAdd.error) {
      socket.emit("productAddError", resultAdd.error);
    } else {
      const productsGet = await manager.getProducts();
      io.emit("productList", productsGet);
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

  socket.on("messages", async (data) => {
    let msgSend;
    try {
      msgSend = await managerMsg.addMessage(data);
      message.unshift(data);
      io.emit("messageLogs", message);
    } catch (error) {
      throw error;
    }
  });
});
