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
  let { email, password } = req.body;
  try {
    let user = await managerSession.getByEmail(email);
    if (
      (!user || password !== user.password) &&
      email !== "adminCoder@coder.com"
    ) {
      res.render("login-error", {});
      return;
    }
    let role = "usuario"; // Por defecto, el rol es "usuario"
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      role = "Admin"; // Si el correo y la contraseña coinciden, se asigna el rol de "admin"
    }
    req.session.user = { email, role }; // Guardar el correo y el rol en la sesión
    res.redirect("/products");
  } catch (error) {
    console.log(error);
    res.render("error", {});
  }
});

export default sessionRouter;
