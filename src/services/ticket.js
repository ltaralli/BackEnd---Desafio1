import ticketManager from "../DAO/ticketsDAO.js";

export default class TicketServices {
  constructor() {
    this.dao = new ticketManager();
  }

  async createTicket(uid, productsToPurchase) {
    let result = await this.dao.createTicket(uid, productsToPurchase);
    return result;
  }
}
