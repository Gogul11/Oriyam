import { Router } from "express";
import authRoutes from "./authRoutes";
import landsRouter from "./landsRouter";
import { verifyToken } from "../middleware/verify";
import profileRoutes from "./profileRoutes"
import forgotPasswordRoutes from "./forgotPasswordRoutes";
const routes = Router()

routes.get("/", (req, res) => {
    res.status(200).json({message : "success"})
})

routes.use("/profile",verifyToken, profileRoutes);
routes.use("/auth",authRoutes);
routes.use("/lands", verifyToken,landsRouter)
routes.use("/forgot-password", forgotPasswordRoutes);

export default routes;