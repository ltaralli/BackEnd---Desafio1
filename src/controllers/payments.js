import PaymentServices from "../services/payments.js";

const paymentServices = new PaymentServices();

export const paymentsIntents = async (req, res) => {
  const body = req.body;

  if (!body)
    return res
      .status(404)
      .send({
        status: error,
        msg: "No se encontraron productos en el carrito",
      });
};
