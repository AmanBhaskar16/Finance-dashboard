import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.ts";
import {createTransaction,getTransactions,getTransactionById,updateTransaction,deleteTransaction} from "../controllers/transaction.controller.ts";

const router = Router();

router.use(authenticate);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;