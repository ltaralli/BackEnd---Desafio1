import { productsModel } from "./db/model/products.model.js";

class ProductManager {
  constructor() {
    this.model = productsModel;
  }

  async getProducts() {
    let products;
    try {
      products = await this.model.find();
    } catch (error) {
      console.log(error);
    }
    return products;
  }

  async getProductById(id) {
    let product;
    try {
      product = await this.model.findOne({ _id: id });
      if (!product) {
        console.log(`No se encontró ningún producto con el id: ${id}`);
      }
    } catch (error) {
      console.log(error);
    }
    return product;
  }
  async addProduct(product) {
    let existingProduct;
    let producto;
    try {
      existingProduct = await this.model.findOne({ code: product.code });
      if (existingProduct) {
        return {
          error: `El codigo ${product.code} ya fue ingresado, por favor ingresa otro diferente`,
        };
      }
      producto = await this.model.create(product);
    } catch (error) {
      console.log(error);
    }
    return producto;
  }

  async updateProduct(pid, fields) {
    let product;
    try {
      product = await this.model.updateOne({ _id: pid }, fields);
    } catch (error) {
      console.log(error);
    }
    return product;
  }

  async deleteProduct(pid) {
    let deletedProduct;
    try {
      deletedProduct = await this.model.deleteOne({ _id: pid });
    } catch (error) {
      console.log(error);
    }
    return deletedProduct;
  }
}

export default ProductManager;
