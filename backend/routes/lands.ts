import { Router } from "express";

const landRouter = Router();

landRouter.get("/", (req, res) => {
    res.send("HI")
})

export default landRouter;