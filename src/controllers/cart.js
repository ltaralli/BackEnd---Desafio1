import CartServices from "../services/cart.js";
import ProductServices from "../services/products.js";
import TicketServices from "../services/ticket.js";
import logger from "../utils/logger.js";

const cartServices = new CartServices();
const ticketServices = new TicketServices();
const productServices = new ProductServices();

export const getCart = async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await cartServices.getCart(cid);

    if (!cart) {
      return res.status(404).send({
        status: "error",
        msg: "El carrito no existe",
      });
    }

    res.send({
      status: "successful",
      products: cart.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al obtener el carrito",
    });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await cartServices.getCarts();
    res.send({ status: "successful", carts });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al obtener los carritos",
    });
  }
};

export const addProductToCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const user = req.session.user.email;
  try {
    const product = await productServices.getProductById(pid);

    if (!product) {
      return res.status(404).send({
        status: "error",
        msg: "El producto no existe",
      });
    }

    if (product.owner === user && req.user.role === "premium") {
      return res.status(403).send({
        status: "error",
        msg: "No puedes agregar tu propio producto al carrito",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).send({
        status: "error",
        msg: "No hay suficiente stock para este producto",
      });
    }

    const result = await cartServices.addProductToCart(pid, cid);

    if (!result.success) {
      return res.status(404).send({
        status: "error",
        msg: result.message,
      });
    }

    return res.send({
      status: "successful",
      msg: result.message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al agregar el producto al carrito",
    });
  }
};

export const createCart = async (req, res) => {
  try {
    let cart = await cartServices.createCart();
    if (!cart) {
      return res
        .status(500)
        .send({ status: "error", msg: "No se pudo crear el carrito" });
    }
    res.send({
      status: "successful",
      cartId: cart._id,
      msg: "Carrito creado correctamente",
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProductFromCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cart = await cartServices.getCart(cid);

    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", msg: "El carrito no existe" });
    }

    const updatedCart = await cartServices.deleteProductFromCart(pid, cid);

    if (!updatedCart.success) {
      return res
        .status(404)
        .send({ status: "error", msg: updatedCart.message });
    }

    res.send({
      status: "successful",
      msg: "Producto eliminado del carrito correctamente",
      cart: updatedCart.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al eliminar el producto del carrito",
    });
  }
};

export const updateCart = async (req, res) => {
  const cid = req.params.cid;
  const products = req.body.products;

  try {
    const cart = await cartServices.getCart(cid);

    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", msg: "El carrito no existe" });
    }

    const updatedCart = await cartServices.updateCart(cid, products);

    if (!updatedCart.success) {
      return res
        .status(404)
        .send({ status: "error", msg: updatedCart.message });
    }

    res.send({
      status: "successful",
      msg: "Carrito actualizado correctamente",
      cart: updatedCart.cart,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", msg: "Error al actualizar el carrito" });
  }
};

export const updateProductQuantity = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  const updateResult = await cartServices.updateProductQuantity(
    cid,
    pid,
    quantity
  );

  if (!updateResult.success) {
    return res.status(404).send({
      status: "error",
      message: updateResult.message,
    });
  }

  res.send({
    status: "success",
    message: updateResult.message,
    cart: updateResult.cart,
  });
};

export const deleteAllProducts = async (req, res) => {
  const cid = req.params.cid;

  const deleteResult = await cartServices.deleteAllProducts(cid);

  if (!deleteResult.success) {
    return res.status(404).send({
      status: "error",
      message: deleteResult.message,
    });
  }

  res.send({
    status: "success",
    message: deleteResult.message,
  });
};

export const purchase = async (req, res) => {
  try {
    const cid = req.params.cid;
    const uid = req.session.user.email;
    const { productsToPurchase, productsNotPurchase } =
      await cartServices.verifyPurchase(cid);
    if (productsToPurchase.length === 0) {
      return res.status(400).send({
        status: "error",
        message: productsToPurchase.message,
      });
    }

    const resultPurchase = await cartServices.processPurchase(
      productsToPurchase
    );

    const ticket = await ticketServices.createTicket(uid, productsToPurchase);

    const resultUpdateCart = await cartServices.updateCart(
      cid,
      productsNotPurchase
    );

    return res.send({
      message: "Compra realizada exitosamente.",
      payload: ticket,
      newCart: resultUpdateCart,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Error en el proceso de compra. ${error}` });
  }
};
