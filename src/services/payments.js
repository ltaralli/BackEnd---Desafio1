import Stripe from "stripe";
import config from "../config/config.js";

const key = config.backend_stripe_key;

export default class PaymentServices {
  constructor() {
    this.stripe = new Stripe(key);
  }

  createpaymentIntent = async (data) => {
    const paymentIntent = this.stripe.paymentIntents.create(data);

    return paymentIntent;
  };
}
