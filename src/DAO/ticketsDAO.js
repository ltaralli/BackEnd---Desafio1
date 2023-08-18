import { calculateTotalAmount, generateUniqueCode } from "../utils/index.js";
import { ticketsModel } from "./db/model/tickets.model.js";

class TicketsManager {
  constructor() {
    this.model = ticketsModel;
  }

  async createTicket(uid, productsToPurchase) {
    try {
      const totalAmount = calculateTotalAmount(productsToPurchase);
      const code = generateUniqueCode();

      const ticketData = {
        code,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: uid,
      };
      const createdTicket = await this.model.create(ticketData);
      return createdTicket;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Ocurrió un error al crear el ticket: ${error}`,
      };
    }
  }
}

export default TicketsManager;
