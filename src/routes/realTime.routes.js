import { Router } from "express";
import ProductManager from "../ProductManager.js";
import { validateAddProduct } from "../utils/index.js";
const realTimeRouter = Router();
const manager = new ProductManager()
import { io } from "../app.js";


realTimeRouter.post('/', async (req, res) => {
    try {
      const product= req.body;
      io.emit('newProduct', product);
      manager.addProduct(product)

    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });

realTimeRouter.get('/', async (req, res) => {
    try {
      let limit = req.query.limit;
      let products = await manager.getProducts();
        res.render('realtimeproducts', { products: products });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });


export default realTimeRouter