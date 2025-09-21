// profileRoutes.ts
import { Router } from "express";
import { getProfile } from "../controllers/profileController";
import { verifyToken } from "../middleware/verify";

const router = Router();

router.get("/", verifyToken, getProfile);

export default router;