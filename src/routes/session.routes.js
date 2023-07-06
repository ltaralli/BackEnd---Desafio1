import express from "express";
const sessionRouter = express.Router();

sessionRouter.post("/register", async (req, res) => {
  let user = req.body;
  try {
    let userFound = await managerSession.getByEmail(user.email);
    if (userFound) {
      res.render("register-error", {});
      return;
    }
    await managerSession.createUser(user);
    res.render("login", {});
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
    res.render("products", {});
  } catch (error) {
    console.log(error);
    res.render("error", {});
  }
});

export default sessionRouter;
