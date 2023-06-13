import mongoose, { mongo } from "mongoose";

const cartsCollection = "carts";

const CartsSchema = new mongoose.Schema({
  products: {
    type: Array,
    required: true,
  },
});

export const cartsModel = mongoose.model(cartsCollection, CartsSchema);
