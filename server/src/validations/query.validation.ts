import { z } from "zod";

export const transactionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  category: z.string().trim().optional(),

  type: z.enum(["income", "expense"]).optional(),

  startDate: z.string().date().optional(),

  endDate: z.string().date().optional(),

  sortBy: z.enum(["date","amount","category","createdAt",]).default("date"),

  order: z.enum(["asc", "desc"]).default("desc"),
});