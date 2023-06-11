import { Router } from "express";
import ProductManager from "../DAO/productsDAO.js";
const homeRouter = Router();
const manager = new ProductManager();

homeRouter.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await manager.getProducts();
    if (limit) {
      let limitedProducts = products.slice(0, limit);
      res.render("index", { products: limitedProducts });
    } else {
      res.render("index", { products: products });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

export default homeRouter;
