import { Router } from "express";
import { transactionInitController, transactionViewController } from "../controllers/transactionController";

const transaction = Router()

transaction.post("/seller", transactionInitController)
transaction.get("/buyer", transactionViewController)

export default transaction