"use client";
import { useEffect, useState } from "react";
import { CandidateTrendChart } from "@/components/charts/CandidateTrendChart";
import { StatusPieChart } from "@/components/charts/StatusPieChart";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  DOCS_COMPLETE: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending", DOCS_COMPLETE: "Docs Complete",
  UNDER_REVIEW: "Under Review", APPROVED: "Approved", REJECTED: "Rejected",
};

export default function OrgDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // orgId will come from session in full implementation
    // For now load with demo data structure
    fetch("/api/org/analytics?orgId=demo")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
        { label: "Total Candidates", value: data.totalCandidates },
        { label: "Pending Review", value: data.statusMap?.PENDING ?? 0 },
        { label: "Approved", value: data.statusMap?.APPROVED ?? 0 },
        { label: "Active Campaigns", value: data.campaigns?.length ?? 0 },
      ]
    : Array(4).fill({ label: "—", value: "—" });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your organization activity.</p>
        </div>
        <Link
          href="/org-dashboard/campaigns/new"
          className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
        >
          New Campaign
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl px-6 py-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-3xl font-black text-slate-900">
              {loading ? <span className="animate-pulse text-slate-200">000</span> : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Trend Chart */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <p className="font-bold text-slate-900 mb-4">Candidate Submissions — Last 7 Days</p>
          {data?.trendData ? (
            <CandidateTrendChart data={data.trendData} />
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              {loading ? "Loading..." : "No submissions in the last 7 days."}
            </div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="font-bold text-slate-900 mb-4">Status Breakdown</p>
          {data?.statusMap ? (
            <StatusPieChart statusMap={data.statusMap} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">
              {loading ? "Loading..." : "No data yet."}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Campaigns */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-bold text-slate-900">Active Campaigns</p>
            <Link href="/org-dashboard/campaigns" className="text-blue-600 text-xs font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data?.campaigns?.length > 0 ? (
              data.campaigns.map((c: any) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{c.count} candidates</p>
                  </div>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/apply/${c.slug}`;
                      navigator.clipboard.writeText(url);
                    }}
                    className="text-xs text-slate-400 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                {loading ? "Loading..." : "No campaigns yet. Create your first campaign."}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="font-bold text-slate-900">Recent Activity</p>
          </div>
          <div className="divide-y divide-slate-100">
            {data?.recentActivity?.length > 0 ? (
              data.recentActivity.map((c: any) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{c.name ?? "Anonymous"}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{c.campaign}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_BADGE[c.status] ?? ""}`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                {loading ? "Loading..." : "No recent activity."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
