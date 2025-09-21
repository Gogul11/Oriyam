import { Request, Response } from "express";
import { db } from "../db/connection";
import { land } from "../db/schema/land";

export const addLandContoller = async (
    req : Request,
    res : Response
) => {
    try {
        const formData = {...req.body, status : true}
        await db.insert(land).values(formData)
        return res.status(200).json({success : "hi"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error registering user" });
    }
}