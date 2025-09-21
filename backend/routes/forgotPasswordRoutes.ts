import { Router } from "express";
import { requestOTPHandler,verifyOTPHandler,resetPasswordHandler } from "../controllers/forgotPasswordController"

const router = Router();

router.post("/request-otp", requestOTPHandler);
router.post("/verify-otp", verifyOTPHandler);
router.post("/reset", resetPasswordHandler);

export default router;
