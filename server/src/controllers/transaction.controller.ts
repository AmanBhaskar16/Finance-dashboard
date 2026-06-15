import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTransaction = async (req: AuthRequest,res: Response) => {
  try {
    const { amount, category, type, date, note } = req.body;

    if (!amount || !category || !type || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(amount),
        category,
        type,
        date: new Date(date),
        note,
        userId: req.userId!,
      },
    });

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create transaction",
    });
  }
}

export const getTransactions = async (req: AuthRequest,res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1)*limit;

    const { category ,startDate,endDate} = req.query;
    const where:any ={
      userId: req.userId,
    }

    if(category){
      where.category = String(category);
    }

    if(startDate || endDate){
      where.date = {};
      if(startDate){
        where.date.gte = new Date(String(startDate));
      }
      if(endDate){
        where.date.lte = new Date(String(endDate));
      }
    }
    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          orderBy: {
            date: "desc",
          },
          skip,
          take: limit,
        }),

        prisma.transaction.count({
          where,
        }),
      ]);

    return res.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
}

export const getTransactionById = async (req: AuthRequest,res: Response) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: String(req.params.id),
        userId: req.userId,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
    });
  }
}

export const updateTransaction = async (req: AuthRequest,res: Response) => {
  try {
    const existing = await prisma.transaction.findFirst({
      where: {
        id: String(req.params.id),
        userId: req.userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const updated = await prisma.transaction.update({
      where: {
        id: existing.id,
      },
      data: {
        ...req.body,
        ...(req.body.date ? { date: new Date(req.body.date) }: {}),
      },
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update transaction",
    });
  }
}

export const deleteTransaction = async (req: AuthRequest,res: Response) => {
  try {
    const existing = await prisma.transaction.findFirst({
      where: {
        id: String(req.params.id),
        userId: req.userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await prisma.transaction.delete({
      where: {
        id: String(existing.id),
      },
    });

    return res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
    });
  }
}

