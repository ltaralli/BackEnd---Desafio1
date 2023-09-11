import { Router } from "express";
import { changeRole } from "../controllers/users.js";

const usersRouter = Router();

usersRouter.get("/premium/:uid", changeRole);

export default usersRouter;
