import fs from 'fs';

class ProductManager{
    constructor(){
        this.path = 'src/products.json'
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


    async addProduct(product) {
       try {
            const products = await this.getProducts();

            const existingProduct = products.find(p => p.code === product.code);
            if (existingProduct) {
                throw new Error('El código ya fue ingresado, por favor ingresa otro diferente');
            }

            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
       } catch (error) {
            throw error;
       }
    }
   
    getNextId(){
        return Date.now();
    }


    async updateProduct(pid, fields){
        let product = null;
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id == pid)     
            if(index == -1){
                return product;
            }

            if (fields.title) products[index].title = fields.title;
            if (fields.description) products[index].description = fields.description;
            if (fields.price) products[index].price = fields.price;
            if (fields.thumbnail) products[index].thumbnail = fields.thumbnail;
            if (fields.code) products[index].code = fields.code;
            if (fields.stock) products[index].stock = fields.stock;
            if (fields.category) products[index].category = fields.category;
            if (fields.status) products[index].status = fields.status;
            
            product = { ...products[index] };
            await fs.writeFileSync(this.path, JSON.stringify(products));
            console.log('product after:', products[index]);
        } catch (error) {
            throw error;
        }
        return product;
      }
      
      async deleteProduct(id) {
        let deletedProduct = null;
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
          deletedProduct = products.splice(index, 1)[0];
          await fs.promises.writeFile(this.path, JSON.stringify(products));
        }
        return deletedProduct;
      }

}
export default ProductManager;
