import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import api from "../../lib/api";
import FilterBar from "./FilterBar";
import type { FilterValues } from "./FilterBar";
import TransactionModal from "./TransactionModal";

interface Props {
  onRefresh: () => void;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  note?: string;
}

export default function TransactionTable({
  onRefresh,
}: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const [filters, setFilters] = useState<FilterValues>({
    category: "",
    type: "",
    startDate: "",
    endDate: "",
    sortBy: "date", 
    order: "desc" 
  });

  async function fetchTransactions(currentPage = page) {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (filters.category) {
        params.append("category", filters.category);
      }

      if (filters.type) {
        params.append("type", filters.type);
      }

      if (filters.startDate) {
        params.append("startDate", filters.startDate);
      }

      if (filters.endDate) {
        params.append("endDate", filters.endDate);
      }

      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
      }

      if (filters.order) {
        params.append("order", filters.order);
      }

      const res = await api.get(
        `/transactions?${params.toString()}`
      );

      setTransactions(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(page);
  }, [page, filters]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/transactions/${id}`);

      toast.success("Transaction deleted");

      fetchTransactions();
      onRefresh();
    } catch {
      toast.error("Failed to delete transaction");
    }
  }

  function handleEdit(tx: Transaction) {
    setEditing(tx);
    setOpen(true);
  }

  function handleCreate() {
    setEditing(null);
    setOpen(true);
  }

    return (
    <>
      <div className="space-y-5">
        {/* Filters */}
        <FilterBar
          onApply={(newFilters) => {
            setPage(1);
            setFilters(newFilters);
          }}
        />

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Transactions
              </h2>
              <p className="text-sm text-slate-500">
                Track your income and expenses.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="border-b">
                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-slate-500">
                    Note
                  </th>

                  <th className="px-5 py-3 text-center text-sm font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-500"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b last:border-none hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm">
                        {new Date(tx.date).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {tx.category}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            tx.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      <td
                        className={`px-5 py-4 font-semibold ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹
                        {tx.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="max-w-55 truncate px-5 py-4 text-sm text-slate-600">
                        {tx.note || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="rounded-lg p-2 transition hover:bg-slate-100 cursor-pointer"
                          >
                            <Pencil
                              size={17}
                              className="text-slate-700"
                            />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(tx.id)
                            }
                            className="rounded-lg p-2 transition hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2
                              size={17}
                              className="text-red-600"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        transaction={editing}
        onSuccess={() => {
          fetchTransactions();
          onRefresh();
        }}
      />
    </>
  );
}