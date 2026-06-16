import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthContext } from "../context/AuthContext";
import api from "../lib/api";
import SummaryCards from "../components/dashboard/SummaryCards.tsx";
import ExpenseChart from "../components/dashboard/ExpenseChart.tsx";
import InsightCard from "../components/dashboard/InsightCard.tsx";
import TransactionTable from "../components/dashboard/TransactionTable.tsx";

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topSpendingCategory: string;
}

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchDashboard() {
    try {
      setLoading(true);

      const [summaryRes, chartRes, insightRes] = await Promise.all([
        api.get("/transactions/summary"),
        api.get("/transactions/chart"),
        api.get("/transactions/insight"),
      ]);

      setSummary(summaryRes.data.data);
      setChartData(chartRes.data.data);
      setInsight(insightRes.data.message);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  function handleLogout() {
    auth?.logout();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Finance Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Welcome back, {auth?.user?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-gray-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {summary && <SummaryCards summary={summary} />}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExpenseChart data={chartData} />
          </div>

          <InsightCard message={insight} />
        </div>

        <TransactionTable onRefresh={fetchDashboard} />
      </main>
    </div>
  );
}