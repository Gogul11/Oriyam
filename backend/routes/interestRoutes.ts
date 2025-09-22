import { Router } from "express";
import { getInterests, getUserInterests } from "../controllers/interestController";

const router = Router();

// Existing: fetch interests for a land
router.get("/:landId", getInterests);

// 🔹 New: fetch interests made by a user
router.get("/user/:userId", getUserInterests);

export default router;