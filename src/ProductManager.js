import fs from 'fs';
import express  from 'express';


class ProductManager{
    constructor(){
        this.path = 'products.json'
        this.index = 0
    }
    

    async getProducts() {
       const content = await fs.promises.readFile(this.path)
       const products = JSON.parse(content)
       return products; 
    }


    async getProductById(id){
        const products = await this.getProducts();
        const product = products.find(product => product.id === parseInt(id))
        if (!product) {
            console.log(`No se encontró ningún producto con el id: ${id}`)
        }
        return product
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
           
            return console.log(`No se encontró ningún producto con el id: ${id}`)
        }
    }
    
     async deleteProduct(id){
         const products = await this.getProducts();
         const index = products.filter(product => product.id !== id )
         await fs.promises.writeFile(this.path, JSON.stringify(index));
        return index
     }
}

export default ProductManager;
