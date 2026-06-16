import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Item {
  category: string;
  total: number;
}

interface Props {
  data: Item[];
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ea580c",
  "#9333ea",
  "#0891b2",
];

export default function ExpenseChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">
        Expenses by Category
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              outerRadius={110}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}