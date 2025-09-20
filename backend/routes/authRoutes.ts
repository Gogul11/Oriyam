import { loginController } from "../controllers/authController";
import { registerController } from "../controllers/authController";

import express from "express";
const router = express.Router();

router.post("/login",loginController);
router.post("/register",registerController);

export default router;