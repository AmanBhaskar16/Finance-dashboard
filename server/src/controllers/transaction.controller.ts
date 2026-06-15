import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTransaction = async (req: AuthRequest,res: Response) => {
  try {
    const { amount, category, type, date, note } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        amount,
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

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      type,
      startDate,
      endDate,
      sortBy = "date",
      order = "desc",
    } = req.query as {
      page?: number;
      limit?: number;
      category?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      order?: string;
    };

    const where: any = {
      userId: req.userId,
    };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip: (pageNumber - 1)*limitNumber,
        take: limitNumber,
        orderBy: {
          [sortBy]: order,
        },
      }),
      prisma.transaction.count({
        where,
      }),
    ]);

    return res.json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total/limitNumber),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

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

    if(!existing){
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

export const getSummary = async (req: AuthRequest,res: Response) => {
  try {
    const transactions =
      await prisma.transaction.findMany({
        where: {
          userId: req.userId,
        },
      });

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount,0);

    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount,0);

    const categoryTotals: Record<string,number> = {};

    transactions.filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    let topSpendingCategory = "No expenses";

    let highest = 0;

    for (const key in categoryTotals) {
      if(categoryTotals[key] > highest){
        highest = categoryTotals[key];
        topSpendingCategory = key;
      }
    }

    return res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        topSpendingCategory,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate summary",
    });
  }
}

export const getChart = async (req: AuthRequest,res: Response) => {
  try {
    const expenses = await prisma.transaction.findMany({
        where: {
          userId: req.userId,
          type: "expense",
        },
      });

    const totals: Record<string,number> = {};
    expenses.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

    const data = Object.entries(totals).map(([category, total]) => ({
        category,
        total,
      })
    );

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to generate chart data",
    });
  }
}

export const getInsight = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
        where: {
          userId: req.userId,
        },
      });

    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount,0);

    const expenses = transactions.filter((t) => t.type === "expense");

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount,0);

    if (expenses.length === 0) {
      return res.json({
        success: true,
        message:
          "Add some expenses to unlock insights.",
      });
    }

    const categoryTotals: Record<string,number> = {};
    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    const [topCategory, amount] = sorted[0];

    if(income > 0 && totalExpense > income){
      return res.json({
        success: true,
        message: `Your expenses exceed your income by ₹${(totalExpense -income).toFixed(2)}.`,
      });
    }

    return res.json({
      success: true,
      message: `${topCategory} accounts for ${((amount /totalExpense)*100).toFixed(1)}% of your expenses.`,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message:"Failed to generate insight",
    });
  }
}