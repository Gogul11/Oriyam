import { Request, Response } from "express";
import { db } from "../db/connection";
import { users } from "../db/schema/users";
import { land } from "../db/schema/land";
import { eq } from "drizzle-orm";

export const getAllUser = async (
    req : Request,
    res : Response
) => {

    try {
        
        const allUsers = await db.select().from(users)
        if(!allUsers){
            return res.status(200).json({success : 2, message : "Error in fetching users"})
        }

        return res.status(200).json({success : 1, users : allUsers})
    } catch (error : any) {
        console.error(error);
        return res.status(500).json({ message: "Error in fetching users" });
    }

}

export const getUserById = async (
    req : Request, 
    res : Response
) => {
    try {
        const userID = req.params.userId;
        const [user] = await db.select().from(users).where(eq(users.user_id, userID))
        if(!user){
            return res.status(200).json({success : 2, message : "Error in fetching user"})
        }

        return res.status(200).json({success : 1, users : user})
    } catch (error : any) {
        console.error(error);
        return res.status(500).json({ message: "Error in fetching user" });
    }
}

export const getAllLands = async (
    req : Request,
    res : Response
) => {
    try {
        
        const allLands = await db.select().from(land)
        if(!allLands){
            return res.status(200).json({success : 2, message : "Error in fetching lands"})
        }

        return res.status(200).json({success : 1, lands : allLands})
    } catch (error : any) {
        console.error(error);
        return res.status(500).json({ message: "Error in fetching lands" });
    }
}

export const getLandById = async (
    req : Request, 
    res : Response
) => {
    try {
        const landId = req.params.landId;
        const [singleLand] = await db.select().from(land).where(eq(land.landId, landId))
        if(!land){
            return res.status(200).json({success : 2, message : "Error in fetching land"})
        }

        return res.status(200).json({success : 1, land : singleLand})
    } catch (error : any) {
        console.error(error);
        return res.status(500).json({ message: "Error in fetching land" });
    }
}

export const fetchLandByUserId = async(
    req : Request,
    res : Response
) => {
    
    try {
        const {userId} = req.body
        console.log(userId)
         const userLands = await db.select().from(land).where(eq(land.userId, userId));

        if(!userLands){
            return res.status(200).json({success : 3, message : "Error in fetching land"})
        }
        if (userLands.length === 0) {
            return res.status(200).json({ success: 2, message: "No lands posted by this user" });
        }

        return res.status(200).json({ success: 1, userLands });

    } catch (error : any) {
        console.error(error);
        return res.status(500).json({ message: "Error in fetching users" });
    }
}