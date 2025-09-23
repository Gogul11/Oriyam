import { Request, Response } from "express";
import { db } from "../db/connection";
import { transaction } from "../db/schema/transaction";
import { and, eq } from "drizzle-orm";
import { interestForm } from "../db/schema/landIntrest";
import { land } from "../db/schema/land";

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


export const transactionAdvanceController = async (
    req : Request,
    res : Response
) => {
    try {
        if(!req.token){
            console.log("Please provide token from transaction controller")
            return res.status(403).json({success : 'Please login again'})
        }
        const { landId, transactionId } = req.body

        const updatedTrans = await db
        .update(transaction)
        .set({
            buyerApproved: true,
            initialDepositStatus: "paid",
            lastTransactionDate :new Date()
        })
        .where(
            and(
                eq(transaction.transactionId, transactionId),
                eq(transaction.buyerId, req.token.id),
                eq(transaction.landId, landId)
            )
        )
        .returning();

        await db.delete(interestForm).where(eq(interestForm.landId, landId))

        await db.update(land).set({status : false}).where(eq(landId, land.landId))

        return res.status(200).json({message : "Advance paid successfully", transaction : updatedTrans})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in making transaction" });
    }
}


export const transactionMonthlyPayController = async (
    req : Request,
    res : Response
) => {
    try {

        if(!req.token){
            console.log("Please provide token from transaction controller")
            return res.status(403).json({success : 'Please login again'})
        }

        const { transactionId } = req.body

        const [oldTransaction] = await db
                                        .select()
                                        .from(transaction)
                                        .where(eq(transaction.transactionId, transactionId));

        console.log(oldTransaction)

        const paymentsArray = oldTransaction?.payments ?? []; 

        const lastPaidMonth = paymentsArray
            .filter(p => p.paid)       
            .map(p => p.month)          
            .reduce((max, month) => Math.max(max, month), 0);

        if(lastPaidMonth >= oldTransaction.totalMonths){
            return res.status(201).json({message : "You paid all your month dues"})
        }


        const updatedPayments = [...(oldTransaction?.payments || []), { month: lastPaidMonth+1, paid: true }];

        const [updatedTrans] = await db
            .update(transaction)
            .set({
                payments: updatedPayments,
                lastTransactionDate: new Date()
            })
            .where(eq(transaction.transactionId, transactionId))
            .returning();

        return res.status(200).json({ message: "Payment updated successfully", transaction: updatedTrans });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in making transaction" });
    }
}