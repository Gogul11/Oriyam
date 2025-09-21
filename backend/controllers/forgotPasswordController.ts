import { Request, Response } from "express";
import {
  requestEmailOTP,
  verifyEmailOTP,
  resetPasswordWithEmail,
} from "../services/forgotPasswordService";

export const requestOTPHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await requestEmailOTP(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOTPHandler = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyEmailOTP(email, otp);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const result = await resetPasswordWithEmail(email, newPassword);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
