import { Router } from "express";
import { transactionAdvanceController, transactionInitController, transactionMonthlyPayController, transactionViewController } from "../controllers/transactionController";

const transaction = Router()

transaction.post("/seller", transactionInitController)
transaction.get("/buyer", transactionViewController)
transaction.post("/buyer/payAdvance", transactionAdvanceController)
transaction.post("/buyer/payMonths", transactionMonthlyPayController)

export default transaction