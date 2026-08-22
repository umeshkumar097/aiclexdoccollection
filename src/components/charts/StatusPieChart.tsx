"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  DOCS_COMPLETE: "#3b82f6",
  UNDER_REVIEW: "#8b5cf6",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
};

const LABELS: Record<string, string> = {
  PENDING: "Pending",
  DOCS_COMPLETE: "Docs Complete",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function StatusPieChart({ statusMap }: { statusMap: Record<string, number> }) {
  const data = Object.entries(statusMap)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: LABELS[k] ?? k, value: v, color: COLORS[k] ?? "#94a3b8" }));

  if (data.length === 0) {
    return <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
