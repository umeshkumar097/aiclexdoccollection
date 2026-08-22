import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const ADMIN_SECRET = new TextEncoder().encode(
  (process.env.AUTH_SECRET ?? "fallback") + "_superadmin"
);

const PLAN_LABELS: Record<string, string> = {
  TRIAL: "Trial", STARTER: "Starter", PROFESSIONAL: "Professional", ENTERPRISE: "Enterprise",
};
const STATUS_COLORS: Record<string, string> = {
  TRIAL: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  GRACE: "bg-orange-100 text-orange-800",
  EXPIRED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sa_token")?.value;
  if (!token) redirect("/admin/login");
  try { await jwtVerify(token, ADMIN_SECRET); } catch { redirect("/admin/login"); }

  const [orgs, planConfigs] = await Promise.all([
    prisma.organization.findMany({ orderBy: { created_at: "desc" }, take: 50 }),
    prisma.planConfig.findMany(),
  ]);

  const priceMap: Record<string, number> = {};
  for (const p of planConfigs) priceMap[p.plan] = p.price_monthly;

  const activeOrgs = orgs.filter((o) => o.subscription_status === "ACTIVE");
  const trialOrgs = orgs.filter((o) => o.subscription_status === "TRIAL");
  const mrr = activeOrgs.reduce((sum, o) => sum + (priceMap[o.plan] ?? 0), 0);

  const stats = [
    { label: "Total Organizations", value: orgs.length.toString() },
    { label: "Active Subscriptions", value: activeOrgs.length.toString() },
    { label: "Trial Users", value: trialOrgs.length.toString() },
    { label: "Monthly Revenue", value: `Rs. ${(mrr / 100).toLocaleString("en-IN")}` },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Platform Overview</h1>
        <p className="text-slate-500 text-sm mt-1">All organizations and revenue at a glance.</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{s.label}</p>
            <p className="text-3xl font-black text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">All Organizations</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Organization</th>
              <th className="px-6 py-3 text-left">Owner</th>
              <th className="px-6 py-3 text-left">Plan</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Candidates</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{org.name}</p>
                  <p className="text-slate-400 text-xs">{org.slug}.aiclex.in</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{org.owner_email}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-700">{PLAN_LABELS[org.plan]}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[org.subscription_status] ?? "bg-slate-100"}`}>
                    {org.subscription_status}
                  </span>
                  {org.is_suspended && (
                    <span className="ml-1 px-2 py-1 rounded-full text-xs font-bold bg-red-200 text-red-900">SUSPENDED</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600">{org.candidates_this_month}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {new Date(org.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <a href={`/admin/organizations/${org.id}`} className="text-blue-600 hover:underline font-semibold text-xs">
                    Manage
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
