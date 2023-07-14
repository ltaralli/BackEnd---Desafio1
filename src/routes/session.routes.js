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

    // Comprobar si es el usuario administrador
    if (
      req.user.email == "adminCoder@coder.com" &&
      req.user.password == "adminCod3r123"
    ) {
      req.session.user = { email: req.user.email, role: "admin" };
    } else {
      req.session.user = { email: req.user.email, role: "usuario" };
    }

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

export default sessionRouter;
