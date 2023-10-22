import { Router } from "express";
import {
  getProducts,
  getChat,
  getProductsRealTime,
  getProductsViews,
  getCart,
  login,
  register,
  profile,
  logout,
  failRegister,
  failLogin,
  getTicketByOrder,
  getProductsMocks,
  loggerTest,
  forgotPass,
  resetPass,
} from "../controllers/views.js";
import { authMiddleware, isAdmin, isUser } from "../middlewares/auth.js";
import { auth } from "../utils/jwt.js";
// import { forgotPassword, resetPaswoord } from "../controllers/session.js";

const viewsRouter = Router();
const sessionRouter = Router();

viewsRouter.get("/", getProducts);
viewsRouter.get("/chat", auth, isUser, getChat);
viewsRouter.get("/realtimeproducts", auth, isAdmin, getProductsRealTime);
viewsRouter.get("/products", auth, getProductsViews);
viewsRouter.get("/carts/:cid", getCart);
viewsRouter.get("/carts/:cid/:tcode", getTicketByOrder);
viewsRouter.get("/login", login);
viewsRouter.get("/register", register);
viewsRouter.get("/profile", auth, profile);
viewsRouter.get("/logout", logout);
viewsRouter.get("/failregister", failRegister);
viewsRouter.get("/faillogin", failLogin);
viewsRouter.get("/mockingproducts", getProductsMocks);
viewsRouter.get("/loggerTest", loggerTest);
viewsRouter.get("/forgot-password", forgotPass);
viewsRouter.get("/reset-password", resetPass);
export default viewsRouter;
