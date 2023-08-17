import mongoose from "mongoose";

const ticketCollection = "tickets";

const TicketSchema = new mongoose.Schema({
  code: String,
  purchase_datetime: Date,
  amount: Number,
  purchaser: String,
});

export const productsModel = mongoose.model(ticketCollection, TicketSchema);
