import { Router } from "express";
import authRoutes from "./authRoutes";
import landsRouter from "./landsRouter";
import { verifyToken } from "../middleware/verify";
const routes = Router()

routes.get("/", (req, res) => {
    res.status(200).json({message : "success"})
})

routes.use("/profile", profileRoutes);
routes.use("/auth",authRoutes);
routes.use("/lands", verifyToken,landsRouter)

export default routes;