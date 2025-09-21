import { Request, Response } from "express";
import { db } from "../db/connection";
import { land } from "../db/schema/land";
import { ne } from "drizzle-orm";

export const viewLandsController = async(
    req : Request,
    res : Response
) => {
    try {
        if(!req.token){
            console.log("Please login (View Lands controller)")
            return res.status(403).json({success : 'Please login again'})
        }

        const lands = await db.select().from(land).where(ne(land.userId, req.token.id))

        // lands.p

        return res.status(200).json({success : 1, lands : lands})
    } catch (error) {
        console.error("View lands", error);
        return res.status(500).json({ message: "Error in fetching lands" });
    }
}