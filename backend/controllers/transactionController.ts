import { Request, Response } from "express";
import { db } from "../db/connection";
import { transaction } from "../db/schema/transaction";
import { eq } from "drizzle-orm";

export const transactionInitController = async (
    req : Request,
    res  : Response
) => {
    try {
        if(!req.token){
            console.log("Please provide token from transaction controller")
            return res.status(403).json({success : 'Please login again'})
        }

        const formValues = {
            ...req.body,
            sellerId : req.token.id,
            sellerApproved : true
        }
        console.log(formValues)
        await db.insert(transaction).values(formValues)

        return res.status(200).json({message : "Transaction initated waiting for buyer to veriy"})

    } catch (error) {
         console.error(error);
        return res.status(500).json({ message: "Error in making transaction" });
    }
}


export const transactionViewController = async (
    req : Request,
    res : Response
) => {
    try {
        if(!req.token){
            console.log("Please provide token from transaction controller")
            return res.status(403).json({success : 'Please login again'})
        }

        const trans = await db.
                            select().
                            from(transaction).
                            where(
                                eq(req.token.id, transaction.buyerId)
                            )

        return res.status(200).json({transaction : trans})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in making transaction" });
    }
}