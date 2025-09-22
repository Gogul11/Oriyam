import { Request, Response } from "express";
import { db } from "../db/connection";
import { transaction } from "../db/schema/transaction";

export const transactionController = async (
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