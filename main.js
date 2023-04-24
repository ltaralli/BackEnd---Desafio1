class ProductManager{
    constructor(){
        this.products = []
        this.index = 0
    }

    getProducts = () => {
        return this.products
    }

    getProductsById = () => {

    }

    getProductById = (id) => {
        const product = this.products.find(product => product.id === id)
        if (!product) return console.log(`No se encontró ningún producto con el id: ${id}`)
        return product
    }


    addProduct = (title, description, price, thumbnail, code, stock) => {
        this.index++
        const id = this.index
        
        const product = {id, title, description, price, thumbnail, code, stock}
        
        const siExiste = this.products.some(product => product.code === code)
        if (siExiste) return console.log("El código ya fue ingresado, por favor ingresa otro diferente")
        
        if (!title || !description || !price || !thumbnail || !code || !stock) return console.log("Por favor, completa todos los datos")

        this.products.push(product)
    }
}

const manager = new ProductManager()


// TESTEO DE FUNCIONAMIENTO

manager.addProduct('producto prueba' , 'Este es un producto de prueba', 200, 'sin imagen', 'abc123', 25 )

console.log(manager.getProducts())

console.log('--------------------------')

manager.addProduct('producto prueba' , 'Este es un producto de prueba', 200, 'sin imagen', 'abc123', 25 )

console.log('--------------------------')

manager.getProductById(3)

console.log('--------------------------')