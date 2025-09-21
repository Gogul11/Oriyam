// profileRoutes.ts
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { verifyToken } from "../middleware/verify";

const router = Router();

// Get user profile
router.get("/", verifyToken, getProfile);

// Update user profile
router.put("/", verifyToken, updateProfile);

export default router;
