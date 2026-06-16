import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  Tag,
} from "lucide-react";
import type { Summary } from "../../pages/Dashboard";

interface Props {
  summary: Summary;
}

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Income",
      value: `₹${summary.totalIncome.toLocaleString("en-IN")}`,
      icon: ArrowUpCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Expense",
      value: `₹${summary.totalExpense.toLocaleString("en-IN")}`,
      icon: ArrowDownCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Net Balance",
      value: `₹${summary.netBalance.toLocaleString("en-IN")}`,
      icon: Landmark,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Top Category",
      value: summary.topSpendingCategory || "-",
      icon: Tag,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`rounded-xl p-3 ${card.bg}`}
              >
                <Icon
                  className={card.color}
                  size={22}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}