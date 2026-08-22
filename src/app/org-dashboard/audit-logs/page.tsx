"use client";
import { useEffect, useState } from "react";

const ACTION_BADGE: Record<string, string> = {
  CANDIDATE_APPROVED: "bg-green-100 text-green-800",
  CANDIDATE_REJECTED: "bg-red-100 text-red-800",
  DOCUMENT_UPLOADED: "bg-blue-100 text-blue-800",
  USER_ADDED: "bg-purple-100 text-purple-800",
  USER_REMOVED: "bg-orange-100 text-orange-800",
  CAMPAIGN_CREATED: "bg-slate-100 text-slate-700",
  LOGIN: "bg-slate-100 text-slate-700",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/org/audit-logs?orgId=REPLACE_WITH_ORG_ID&page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.upgrade) { setUpgradeRequired(true); return; }
        setLogs(d.logs ?? []);
        setTotal(d.total ?? 0);
        setPages(d.pages ?? 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (upgradeRequired) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-8 text-center">
          <p className="font-bold text-slate-900 text-lg mb-2">Audit Logs — Professional Plan Required</p>
          <p className="text-slate-500 text-sm mb-5">
            Audit logs are available on the Professional plan and above. Upgrade to access a full
            history of all actions performed within your organization.
          </p>
          <a
            href="/dashboard/billing"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors"
          >
            View Upgrade Options
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 text-sm mt-1">
          Complete activity history — {total.toLocaleString()} total records.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Details</th>
              <th className="px-6 py-3 text-left">IP Address</th>
              <th className="px-6 py-3 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array(10).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(5).fill(0).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  No activity logged yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${ACTION_BADGE[log.action] ?? "bg-slate-100 text-slate-600"}`}>
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{log.user_id ?? "System"}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-mono">{log.ip_address ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(log.created_at).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 h-8 text-xs font-semibold border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-4 h-8 text-xs font-semibold border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
