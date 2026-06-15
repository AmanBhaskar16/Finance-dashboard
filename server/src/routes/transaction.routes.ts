import { Router } from "express";
import {
  addTransaction,
  getTransactions,
  getSummary,
  getInsight
} from "../controllers/transaction.controller";

const router = Router();

router.post("/", addTransaction);
router.get("/", getTransactions);
router.get("/summary", getSummary);
router.get("/insight", getInsight);

export default router;