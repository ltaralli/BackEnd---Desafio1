import express from "express";
import userManager from "../DAO/sessionDAO.js";
import passport from "passport";

const managerSession = new userManager();
const sessionRouter = express.Router();

sessionRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

sessionRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) return res.render("login-error", {});
    req.session.user = { email: req.user.email };
    res.redirect("/products");
  }
);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

sessionRouter.get("/current", async (req, res) => {
  let user = req.session.user;
  let result;
  try {
    result = await managerSession.getUser(user.email);
    if (!result) {
      return res.status(400).send({
        status: "error",
        error: "No se encuentra el usuario en la session",
      });
    }
  } catch (error) {
    console.log(error);
  }
  return res.send({ status: "success", payload: result });
});

export default sessionRouter;
