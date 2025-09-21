import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    token?: any;
  }
}

export const verifyToken = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    const token = await req.header('Authorization')?.split(' ')[1];

    if(!token){
        console.log("Please provide token")
        return res.status(403).json({success : 'Please login again'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        req.token = decoded
        console.log("Decoded : ", req.token)
        next()
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
}