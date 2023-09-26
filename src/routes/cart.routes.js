import { Router } from "express";
import {
  getCart,
  getCarts,
  addProductToCart,
  createCart,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  deleteAllProducts,
  purchase,
} from "../controllers/cart.js";

const cartRouter = Router();

cartRouter.get("/:cid", getCart);
cartRouter.get("/", getCarts);
cartRouter.post("/:cid/product/:pid", addProductToCart);
cartRouter.post("/", createCart);
cartRouter.put("/:cid", updateCart);
cartRouter.put("/:cid/product/:pid", updateProductQuantity);
cartRouter.delete("/:cid/product/:pid", deleteProductFromCart);
cartRouter.delete("/:cid", deleteAllProducts);
cartRouter.post("/:cid/purchase", purchase);

export default cartRouter;
