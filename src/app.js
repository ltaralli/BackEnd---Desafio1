import express from "express";
import ProductManager from "./ProductManager.js";
const app = express();

app.use(express.urlencoded({extended: true}));

const manager = new ProductManager()


app.get('/products', async (req, res) => {
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

app.get('/products/:id', async (req, res) => {
    let id = req.params.id;
    let product = await manager.getProductById(id)
    res.send(product)
    console.log(product)
})


const server = app.listen(8080, () => console.log('Corriendo en el puerto: 8080'))