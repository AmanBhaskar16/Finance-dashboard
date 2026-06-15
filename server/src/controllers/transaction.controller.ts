import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const transactionSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  type: z.enum(["income", "expense"]),
  date: z.string(),
  note: z.string().optional()
});

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const data = transactionSchema.parse(req.body);

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        category: data.category,
        type: data.type,
        date: new Date(data.date),
        note: data.note
      }
    });

    res.status(201).json(transaction);
  } catch {
    res.status(400).json({ message: "Invalid transaction data" });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const { category, startDate, endDate } = req.query;

  const transactions = await prisma.transaction.findMany({
    where: {
      ...(category
        ? { category: String(category) }
        : {}),
      ...(startDate && endDate
        ? {
            date: {
              gte: new Date(String(startDate)),
              lte: new Date(String(endDate))
            }
          }
        : {})
    },
    orderBy: {
      date: "desc"
    }
  });

  res.json(transactions);
};

export const getSummary = async (_: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany();

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals: Record<string, number> = {};

  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    });

  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    null;

  res.json({
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense,
    topSpendingCategory: topCategory
  });
};

export const getInsight = async (_: Request, res: Response) => {
  const expenses = await prisma.transaction.findMany({
    where: {
      type: "expense"
    }
  });

  if (!expenses.length) {
    return res.json({
      message: "Add some expenses to receive spending insights."
    });
  }

  const totals: Record<string, number> = {};

  expenses.forEach(item => {
    totals[item.category] =
      (totals[item.category] || 0) + item.amount;
  });

  const [category, amount] = Object.entries(totals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  res.json({
    message: `Your highest spending category is "${category}" with ₹${amount.toFixed(
      2
    )} spent.`
  });
};