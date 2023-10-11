import { Router } from "express";
import { paymentsIntents } from "../controllers/payments.js";

const paymentsRouter = Router();

paymentsRouter.post("/payments-intents", paymentsIntents);

export default paymentsRouter;
