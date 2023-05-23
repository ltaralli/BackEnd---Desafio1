import { Router } from "express";
import ProductManager from "../ProductManager.js";
const realTimeRouter = Router();
const manager = new ProductManager();

realTimeRouter.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await manager.getProducts();
    if (limit) {
      let limitedProducts = products.slice(0, limit);
      res.render("realTimeProducts", { products: limitedProducts });
    } else {
      res.render("realTimeProducts", { products: products });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

export default realTimeRouter;
