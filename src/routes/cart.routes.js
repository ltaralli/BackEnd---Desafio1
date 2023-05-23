import { Router } from "express";
import CartManager from "../CartManager.js";

const cartRouter = Router();
const manager = new CartManager();

cartRouter.get("/:cid", async (req, res) => {
  let cid = req.params.cid;
  let cart = await manager.getCart(cid);
  if (!cart) {
    return res
      .status(404)
      .send({ status: "error", msg: "El carrito no existe" });
  }
  res.send({ status: "successful", products: cart.products });
});

cartRouter.post("/", async (req, res) => {
  try {
    let cart = await manager.createCart();
    if (!cart) {
      return res
        .status(500)
        .send({ status: "error", msg: "No se pudo crear el carrito" });
    }
    res.send({ status: "successful", msg: "Carrito creado correctamente" });
  } catch (error) {
    throw error;
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let addProduct = await manager.addProductToCart(pid, cid);
  if (!addProduct) {
    res.status(404).send({ status: "error", msg: "El producto no existe" });
  }
  try {
    res.send({
      status: "successful",
      msg: "Producto agregado al carrito correctamente",
    });
  } catch (error) {
    throw error;
  }
});

export default cartRouter;
