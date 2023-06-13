import { cartsModel } from "./db/model/carts.model.js";

class CartManager {
  constructor() {
    this.model = cartsModel;
  }

  async getCarts() {
    let carts;
    try {
      carts = await this.model.find();
    } catch (error) {
      throw error;
    }
    return carts;
  }

  async getCart(id) {
    let cart;
    try {
      cart = await this.model.findOne({ _id: id });
      if (!cart) {
        console.log(`No se encontró ningún carrito con el id: ${id}`);
      }
    } catch (error) {
      throw error;
    }
    return cart;
  }

  async addProductToCart(pid, cid, quantity = 1) {
    try {
      const filter = { _id: cid };
      const update = {
        $inc: {
          [`products.$[elem].quantity`]: quantity,
        },
      };
      const options = {
        arrayFilters: [{ "elem.id": pid }],
      };

      const updatedCart = await this.model.updateOne(filter, update, options);

      if (updatedCart.modifiedCount === 0) {
        return {
          success: false,
          message: "Carrito no encontrado",
        };
      }

      const cart = await this.model.findById(cid);
      return {
        success: true,
        message: "Producto agregado al carrito",
        cart,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error al agregar el producto al carrito",
      };
    }
  }

  async createCart() {
    try {
      const newCart = {
        products: [],
      };
      const createdCart = await this.model.create(newCart);
      return createdCart;
    } catch (error) {
      throw error;
    }
  }
}
export default CartManager;
