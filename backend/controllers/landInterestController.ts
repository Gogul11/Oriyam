import { Request, Response } from "express";
import { db } from "../db/connection";
import { interestForm } from "../db/schema/landIntrest";

export const landInterestController = async (
    req : Request,
    res : Response
) => {
    try {
        if(!req.token){
            console.log("Please provide token from interest controller")
            return res.status(403).json({success : 'Please login again'})
        }

        const data = {...req.body, userId : req.token.id}

        await db.insert(interestForm).values(data)
    
        return res.status(200).json({success : 1, message : "Interest sent, waiting for owner reply"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in" });
    }
}