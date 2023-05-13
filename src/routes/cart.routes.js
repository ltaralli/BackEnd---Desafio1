import { Router } from "express";

const cartRouter = Router();


cartRouter.get('/', async (req, res) => {
    res.send("hola")
})



export default cartRouter;
