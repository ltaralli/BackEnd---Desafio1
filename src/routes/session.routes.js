import express from "express";
import userManager from "../DAO/sessionDAO.js";
const managerSession = new userManager();
const sessionRouter = express.Router();

sessionRouter.post("/register", async (req, res) => {
  let user = req.body;
  try {
    let userFound = await managerSession.getByEmail(user.email);
    if (userFound) {
      res.render("register-error", userFound);
      return;
    }
    await managerSession.createUser(user);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.render("error", {});
  }
});

sessionRouter.post("/login", async (req, res) => {
  let user = req.body;
  try {
    let result = await managerSession.getByEmail(user.email);
    if (!result || user.password !== result.password) {
      res.render("login-error", {});
      return;
    }
    req.session.user = user.email;
    res.redirect("/products");
  } catch (error) {
    console.log(error);
    res.render("error", {});
  }
});

export default sessionRouter;
