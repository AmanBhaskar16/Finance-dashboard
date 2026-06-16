import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "../../lib/api";

const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: {
    id: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string;
    note?: string;
  } | null;
}

export default function TransactionModal({
  open,
  onClose,
  onSuccess,
  transaction,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      category: "",
      type: "expense",
      date: "",
      note: "",
    } ,
  });

  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        date: transaction.date.slice(0, 10),
        note: transaction.note || "",
      });
    } else {
      reset({
        amount: 0,
        category: "",
        type: "expense",
        date: "",
        note: "",
      });
    }
  }, [transaction, reset]);

  async function onSubmit(data: TransactionForm) {
    try {
      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, data);
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", data);
        toast.success("Transaction added");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount
            </label>

            <input
              type="number"
              {...register("amount")}
              className="w-full rounded-xl border px-4 py-3"
            />

            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <input
              {...register("category")}
              placeholder="Food, Salary, Travel..."
              className="w-full rounded-xl border px-4 py-3"
            />

            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Type
            </label>

            <select
              {...register("type")}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Date
            </label>

            <input
              type="date"
              {...register("date")}
              className="w-full rounded-xl border px-4 py-3"
            />

            {errors.date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Note
            </label>

            <textarea
              rows={3}
              {...register("note")}
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Optional note..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : transaction
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}