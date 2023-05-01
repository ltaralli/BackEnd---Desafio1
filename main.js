import { AsyncResource } from 'async_hooks';
import fs from 'fs';

class ProductManager{
    constructor(){
        this.path = 'products.json'
        // this.products = []
        this.index = 0
    }
    

    async getProducts() {
       const content = await fs.promises.readFile(this.path)
       const products = JSON.parse(content)
       return products; 
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        // SE GENERA EL ID
        this.index++
        const id = this.index
        // OBJETO LITERAL
        const product = {id, title, description, price, thumbnail, code, stock}
        // SE OBTIENEN LOS PRODUCTOS
        const products = await this.getProducts();
        const siExiste = products.some(product => product.code === code)
        // VALIDACIONES
        if (siExiste) return console.log("El código ya fue ingresado, por favor ingresa otro diferente")
        if (!title || !description || !price || !thumbnail || !code || !stock) return console.log("Por favor, completa todos los datos")
        // PUSHEO
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }
   

    async getProductById(id){
        const products = await this.getProducts();
        const product = products.find(product => product.id === id)
        if (!product) {
            console.log(`No se encontró ningún producto con el id: ${id}`)
        }
        return product
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock){
        const products = await this.getProducts();
    
        const index = products.findIndex(product => product.id === id )
            
        if(index !== -1){
            const updatedProduct = {
                id,
                title: title || products[index].title, 
                description: description || products[index].description, 
                price: price || products[index].price, 
                thumbnail: thumbnail || products[index].thumbnail, 
                code: code || products[index].code, 
                stock: stock || products[index].stock
            }
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            console.log(`Se han guardado los cambios del producto con id: ${id}`);
            return products[index];
        } else {
            console.log(`No se encontró ningún producto con el id: ${id}`)
        }
    }
    
    async deleteProduct(id){
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id )
        let productDeleted;
        if(index !== -1){
            productDeleted = products.splice(index, 1)[0];
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log(`Se eliminó el producto con id: ${id}`);
    }

}



// TESTEO DE FUNCIONAMIENTO

const manager = new ProductManager();

await manager.addProduct('producto prueba' , 'Este es un producto de prueba', 200, 'sin imagen', 'abc123', 25 )

console.log(await manager.getProducts());

console.log('--------------------------')

console.log('Se agregan mas productos')

await manager.addProduct('producto prueba' , 'Este es un producto de prueba', 200, 'sin imagen', 'ab', 25 )
await manager.addProduct('producto prueba2' , 'Este es un producto de prueba2', 345, 'sin imagen', 'sndoav', 2 )
await manager.addProduct('producto prueba3' , 'Este es un producto de prueba3', 2345, 'sin imagen', 'naw82943849', 5 )
await manager.addProduct('producto prueba4' , 'Este es un producto de prueba4', 345, 'sin imagen', '9283741huffsd', 29 )

console.log('--------------------------')

console.log('Se busca un producto por ID')
console.log(await manager.getProductById(3))

console.log('--------------------------')

console.log(await manager.updateProduct(1, "producto prueba modificado con funcion", "descripcion"))

console.log('--------------------------')

console.log(await manager.getProducts());

console.log('--------------------------')

console.log(await manager.deleteProduct(2));