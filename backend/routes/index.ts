import { Router } from "express";
import landRouter from "./lands";

const routes = Router()

routes.get("/", (req, res) => {
    res.status(200).json({message : "success"})
})

routes.use("/lands", landRouter)

export default routes;