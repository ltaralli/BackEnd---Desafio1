import { Router } from "express";
import ProductManager from "../ProductManager.js";
const productsRouter = Router();

const manager = new ProductManager()


productsRouter.get('/', async (req, res) => {
    try {
        let limit = req.query.limit;
        let products = await manager.getProducts()
    
        if (limit) {
            let limitQuery = products.slice(0, limit);
            return res.send(limitQuery);
        }
        res.send(products);
    } catch (error) {
        console.log(error)
    }
    

})

productsRouter.get('/:id', async (req, res) => {
    let id = req.params.id;
    let product = await manager.getProductById(id)
    if (!product) {
        return res.status(400).send({status: "error", error: "Producto inexistente"})
    }
    res.send(product)
})



export default productsRouter;
