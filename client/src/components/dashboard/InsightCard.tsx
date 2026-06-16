interface Props {
  message: string;
}

export default function InsightCard({
  message,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Spending Insight
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {message}
      </p>
    </div>
  );
}