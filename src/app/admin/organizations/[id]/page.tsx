"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const PLAN_OPTIONS = ["TRIAL", "STARTER", "PROFESSIONAL", "ENTERPRISE"];

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/organizations/${id}`)
      .then((r) => r.json())
      .then((d) => { setOrg(d.org); setLoading(false); });
  }, [id]);

  const doAction = async (action: string, extra?: object) => {
    setActionLoading(true); setMessage("");
    const res = await fetch(`/api/admin/organizations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Action completed successfully.");
      const fresh = await fetch(`/api/admin/organizations/${id}`).then((r) => r.json());
      setOrg(fresh.org);
    } else {
      setMessage(data.error ?? "Something went wrong.");
    }
    setActionLoading(false);
  };

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;
  if (!org) return <div className="p-8 text-red-500">Organization not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <a href="/admin" className="text-blue-600 text-sm font-semibold hover:underline">Back to Dashboard</a>
      <h1 className="text-2xl font-black text-slate-900 mt-4 mb-1">{org.name}</h1>
      <p className="text-slate-500 text-sm mb-8">{org.slug}.aiclex.in</p>

      {message && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-5 mb-8">
        {[
          { label: "Owner", value: `${org.owner_name} (${org.owner_email})` },
          { label: "Plan", value: org.plan },
          { label: "Status", value: org.subscription_status },
          { label: "Suspended", value: org.is_suspended ? "Yes" : "No" },
          { label: "Candidates This Month", value: org.candidates_this_month },
          { label: "Storage Used", value: `${org.storage_used_gb} GB` },
          { label: "Users", value: org._count?.users ?? 0 },
          { label: "Campaigns", value: org._count?.campaigns ?? 0 },
          { label: "Trial Ends", value: org.trial_ends_at ? new Date(org.trial_ends_at).toLocaleDateString("en-IN") : "N/A" },
          { label: "Billing Cycle End", value: org.billing_cycle_end ? new Date(org.billing_cycle_end).toLocaleDateString("en-IN") : "N/A" },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</p>
            <p className="font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <h2 className="font-bold text-slate-900 text-base">Admin Controls</h2>

        <div className="flex items-center gap-3">
          <select
            id="planSelect"
            className="border border-slate-200 rounded-xl px-4 h-11 text-sm"
            defaultValue={org.plan}
          >
            {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            onClick={() => {
              const sel = (document.getElementById("planSelect") as HTMLSelectElement).value;
              doAction("change_plan", { plan: sel });
            }}
            disabled={actionLoading}
            className="px-5 h-11 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 disabled:opacity-60"
          >
            Change Plan
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => doAction("extend_trial")}
            disabled={actionLoading}
            className="px-5 h-11 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60"
          >
            Extend Trial by 7 Days
          </button>
          {org.is_suspended ? (
            <button
              onClick={() => doAction("unsuspend")}
              disabled={actionLoading}
              className="px-5 h-11 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-60"
            >
              Unsuspend Account
            </button>
          ) : (
            <button
              onClick={() => doAction("suspend")}
              disabled={actionLoading}
              className="px-5 h-11 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 disabled:opacity-60"
            >
              Suspend Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
