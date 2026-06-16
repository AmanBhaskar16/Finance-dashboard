import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {createTransaction,getTransactions,getTransactionById,updateTransaction,deleteTransaction, getInsight, getChart, getSummary} from "../controllers/transaction.controller";
import { validate } from "../middleware/validate.middleware";
import { validateQuery } from "../middleware/validateQuery.middleware";
import { createTransactionSchema,updateTransactionSchema } from "../validations/transaction.validation";
import {transactionQuerySchema} from "../validations/query.validation";

const router = Router();

router.use(authenticate);

router.post("/",validate(createTransactionSchema),createTransaction);
router.get("/",validateQuery(transactionQuerySchema),getTransactions);
router.get("/summary", getSummary);
router.get("/chart", getChart);
router.get("/insight", getInsight);
router.get("/:id", getTransactionById);
router.put("/:id", validate(updateTransactionSchema), updateTransaction);
router.delete("/:id",deleteTransaction);


export default router;