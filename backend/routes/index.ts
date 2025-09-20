import { Router } from "express";
import authRoutes from "./authRoutes";
const routes = Router()

routes.get("/", (req, res) => {
    res.status(200).json({message : "success"})
})


routes.use("/auth",authRoutes);

export default routes;