"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orgId = (session?.user as any)?.orgId;

  useEffect(() => {
    if (status === "loading") return;
    if (!orgId) { setLoading(false); return; }

    fetch(`/api/org/analytics?orgId=${orgId}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, [orgId, status]);

  const stats = [
    { label: "Total Candidates", value: loading ? "..." : (data?.totalCandidates ?? 0) },
    { label: "Pending Review",   value: loading ? "..." : (data?.statusMap?.PENDING ?? 0) },
    { label: "Approved",         value: loading ? "..." : (data?.statusMap?.APPROVED ?? 0) },
    { label: "Active Campaigns", value: loading ? "..." : (data?.campaigns?.length ?? 0) },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {(session?.user as any)?.orgName
              ? `Welcome, ${(session?.user as any)?.orgName}`
              : "Overview of your organization activity."}
          </p>
        </div>
        <Link
          href="/org-dashboard/campaigns/new"
          className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          New Campaign
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-3xl font-black text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <p className="font-bold text-slate-900 mb-5">Candidate Submissions — Last 7 Days</p>
          {loading ? (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading...</div>
          ) : data?.trendData?.length ? (
            <CandidateTrendChart data={data.trendData} />
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No submissions yet.</div>
          )}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="font-bold text-slate-900 mb-5">Status Breakdown</p>
          {loading ? (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading...</div>
          ) : data?.statusMap ? (
            <StatusPieChart data={data.statusMap} />
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data yet.</div>
          )}
        </div>
      </div>

      {/* Active Campaigns + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Campaigns */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="font-bold text-slate-900">Active Campaigns</p>
            <Link href="/org-dashboard/campaigns" className="text-xs text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : !data?.campaigns?.length ? (
            <div className="text-center py-6">
              <p className="text-slate-500 text-sm mb-3">No campaigns yet. Create your first campaign.</p>
              <Link
                href="/org-dashboard/campaigns/new"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700"
              >
                New Campaign
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.campaigns.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/org-dashboard/campaigns/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.slug}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {c.count} candidates
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="font-bold text-slate-900 mb-5">Recent Activity</p>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : !data?.recentActivity?.length ? (
            <p className="text-slate-400 text-sm text-center py-6">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {data.recentActivity.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/org-dashboard/review/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{c.name ?? "Anonymous"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.campaign}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
