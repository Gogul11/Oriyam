import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerUser, findUserByMobile } from "../services/authService";

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password are required" });
    }

    const user = await findUserByMobile(mobile);
    if (!user) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in" });
  }
};
