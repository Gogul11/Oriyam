import { Router } from "express";
import authRoutes from "./authRoutes";
import landsRouter from "./landsRouter";
import { verifyToken } from "../middleware/verify";
import profileRoutes from "./profileRoutes";
import forgotPasswordRoutes from "./forgotPasswordRoutes";
import interestRoutes from "./interestRoutes";
import transaction from "./transaction";

const routes = Router();

routes.get("/", (req, res) => {
    res.status(200).json({ message: "success" });
});

routes.use("/profile", profileRoutes);
routes.use("/auth", authRoutes);
routes.use("/lands", verifyToken, landsRouter);
routes.use("/forgot-password", forgotPasswordRoutes);
routes.use("/interests", interestRoutes);
routes.use("/transactions", verifyToken,transaction)

export default routes;
