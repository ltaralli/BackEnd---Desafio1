import mongoose, { mongo } from "mongoose";
import { productsModel } from "./products.model.js";

const cartsCollection = "carts";

const CartsSchema = new mongoose.Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

export const cartsModel = mongoose.model(cartsCollection, CartsSchema);
