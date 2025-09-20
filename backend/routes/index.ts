import { Router } from "express";
import authRoutes from "./authRoutes";
import landsRouter from "./landsRouter";
const routes = Router()

routes.get("/", (req, res) => {
    res.status(200).json({message : "success"})
})


routes.use("/auth",authRoutes);
routes.use("/lands", landsRouter)

export default routes;