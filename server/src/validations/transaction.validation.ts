import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive(),

  category: z.string().trim().min(1).max(50),

  type: z.enum(["income","expense"]),

  date: z.string().date(),

  note: z.string().trim().max(300).optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();