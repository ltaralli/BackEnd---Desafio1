import { Router } from "express";
import ProductManager from "../ProductManager.js";
import { validateAddProduct } from "../utils/index.js";
const productsRouter = Router();

const manager = new ProductManager()



productsRouter.get('/', async (req, res) => {
    try {
        let limit = req.query.limit;
        let products = await manager.getProducts()
    
        if (limit) {
            let limitQuery = products.reverse().slice(0, limit);
            return res.send(limitQuery);
        }
        res.render('index', products)
        res.send(products);
    } catch (error) {
        throw error;
    }
    

})

productsRouter.get('/:pid', async (req, res) => {
    let pid = req.params.pid;
    let product = await manager.getProductById(pid)
    if (!product) {
        return res.status(400).send({status: "error", error: "Producto inexistente"})
    }
    res.send(product)
})

productsRouter.post('/', async (req, res) => {
    let product = req.body;
    if (!validateAddProduct(product)) {
        res.status(400).send({ status: 'error', msg: 'Por favor, completá todos los datos' });
    } else {
        try {
            await manager.addProduct(product);
            res.status(200).send({ status: 'success', msg: 'Producto agregado exitosamente' });
        } catch (error) {
            res.status(400).send({ status: 'error', msg: `El código ${product.code} ya fue ingresado, por favor ingresa otro diferente` });
        }
    }
});



productsRouter.put('/:pid', async (req, res) => {
    let pid = req.params.pid;
    let fields = req.body
    let updatedProduct = await manager.updateProduct(pid, fields)
    if(!updatedProduct){
        res.status(404).send({status: 'error', msg: 'El producto no existe'})
    }
    try {
        res.send({ status: 'successful', msg: 'Producto modificado correctamente'})
    } catch (error) {
        throw error;
    }
  })


  productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const deletedProduct = await manager.deleteProduct(pid);
    if (!deletedProduct) {
      res.status(404).send({status: 'error', msg: 'El producto no existe'});
    } else {
      res.send({status: 'successful', msg: 'Producto eliminado correctamente'});
    }
  });
  
 

export default productsRouter;
