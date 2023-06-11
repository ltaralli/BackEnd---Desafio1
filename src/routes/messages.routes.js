import { Router } from "express";

const messagesRouter = Router();

messagesRouter.get("/", (req, res) => {
  res.render("chat", { status: "ok" });
});

export default messagesRouter;
