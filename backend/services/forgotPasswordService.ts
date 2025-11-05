import { db } from "../db/connection";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/users";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

type OTPRecord = {
  otp: string;
  expiresAt: number;
  verified: boolean;
};

const otpStore: Record<string, OTPRecord> = {};

const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailOTP = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
  console.log(`Sent OTP ${otp} to ${to}`);
};

export const requestEmailOTP = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error("User not found");

  const otp = generateOTP();
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    verified: false,
  };

  await sendEmailOTP(email, otp);
  return { message: "OTP sent to registered email" };
};

export const verifyEmailOTP = async (email: string, otp: string) => {
  const record = otpStore[email];
  if (!record) throw new Error("OTP not requested");
  if (Date.now() > record.expiresAt) throw new Error("OTP expired");
  if (record.otp !== otp) throw new Error("Invalid OTP");

  otpStore[email].verified = true;
  return { message: "OTP verified" };
};

export const resetPasswordWithEmail = async (email: string, newPassword: string) => {
  const record = otpStore[email];
  if (!record || !record.verified) throw new Error("OTP verification required");

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));

  delete otpStore[email]; 
  return { message: "Password reset successful" };
};
