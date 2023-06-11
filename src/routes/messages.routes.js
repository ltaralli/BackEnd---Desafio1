import { Router } from "express";

const messagesRouter = Router();

messagesRouter.get("/", (req, res) => {
  res.send({ status: "ok" });
});

export default messagesRouter;
