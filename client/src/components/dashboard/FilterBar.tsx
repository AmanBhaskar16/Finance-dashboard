import { useState } from "react";

export interface FilterValues {
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  sortBy: "date" | "amount" | "category";
  order: "asc" | "desc";
}

interface Props {
  onApply: (filters: FilterValues) => void;
}

export default function FilterBar({ onApply }: Props) {
  const [filters, setFilters] = useState<FilterValues>({
    category: "",
    type: "",
    startDate: "",
    endDate: "",
    sortBy: "date",
    order: "desc",
  });

  function handleChange(
    key: keyof FilterValues,
    value: string
  ) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleReset() {
    const resetFilters: FilterValues = {
      category: "",
      type: "",
      startDate: "",
      endDate: "",
      sortBy: "date",
      order: "desc",
    };

    setFilters(resetFilters);
    onApply(resetFilters);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-5">
        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) =>
            handleChange("category", e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) =>
            handleChange("type", e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Start Date */}
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            handleChange("startDate", e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        {/* End Date */}
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            handleChange("endDate", e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value as FilterValues["sortBy"])}
          className="rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="category">Sort: Category</option>
        </select>

        {/* Order */}
        <select
          value={filters.order}
          onChange={(e) => handleChange("order", e.target.value as FilterValues["order"])}
          className="rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onApply(filters)}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 cursor-pointer"
          >
            Apply
          </button>

          <button
            onClick={handleReset}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}