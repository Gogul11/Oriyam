import { Router } from "express";
import { transactionController } from "../controllers/transactionController";

const transaction = Router()

transaction.post("/seller", transactionController)

export default transaction