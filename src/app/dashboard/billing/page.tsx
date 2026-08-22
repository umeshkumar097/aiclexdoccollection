"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const PLANS = [
  {
    key: "STARTER",
    name: "Starter",
    price: 4999,
    features: ["2 Admin Users", "100 Candidates / Month", "5 GB Storage", "3 Campaigns", "Email Notifications", "Standard Support"],
  },
  {
    key: "PROFESSIONAL",
    name: "Professional",
    price: 7999,
    features: ["10 Admin Users", "500 Candidates / Month", "25 GB Storage", "Unlimited Campaigns", "WhatsApp Button", "Custom Branding", "AI Document Validation", "Audit Logs", "Priority Support (24hr)"],
    highlighted: true,
  },
  {
    key: "ENTERPRISE",
    name: "Enterprise",
    price: 14999,
    features: ["Unlimited Users", "Unlimited Candidates", "Unlimited Storage", "All Professional Features", "Custom SMTP / Resend", "API Access", "Custom Domain", "Dedicated Account Manager", "First Access to New Features"],
  },
];

const STATUS_COLOR: Record<string, string> = {
  TRIAL: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  GRACE: "bg-orange-100 text-orange-800",
  EXPIRED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default function BillingPage() {
  const { data: session } = useSession();
  const [org, setOrg] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In full implementation, orgId comes from session
    // For now we show the plan comparison
    setLoading(false);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Billing and Subscription</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your plan, view invoices, and update payment details.</p>
      </div>

      {/* Current Status Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-5 mb-10 flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-900">Trial Plan — 14 Days Remaining</p>
          <p className="text-sm text-slate-500 mt-1">Upgrade before your trial ends to maintain uninterrupted access.</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">TRIAL</span>
      </div>

      {/* Plan Comparison */}
      <h2 className="text-lg font-bold text-slate-900 mb-5">Choose a Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`rounded-2xl border p-6 flex flex-col ${
              plan.highlighted
                ? "border-blue-600 shadow-lg shadow-blue-100 bg-white"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.highlighted && (
              <div className="mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
              </div>
            )}
            <p className="font-black text-slate-900 text-lg">{plan.name}</p>
            <div className="my-4">
              <span className="text-4xl font-black text-slate-900">
                Rs. {plan.price.toLocaleString("en-IN")}
              </span>
              <span className="text-slate-500 text-sm"> / month</span>
            </div>
            <p className="text-xs text-slate-400 mb-5">+ 18% GST applicable</p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500 font-bold mt-0.5">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full h-12 rounded-xl font-bold text-sm transition-colors ${
                plan.highlighted
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border border-slate-300 hover:bg-slate-50 text-slate-700"
              }`}
              onClick={() => alert(`Cashfree integration will activate ${plan.name} plan.`)}
            >
              Upgrade to {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Invoice Section */}
      <h2 className="text-lg font-bold text-slate-900 mb-5">Invoices</h2>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-8 text-center text-slate-400">
          <p className="font-semibold text-slate-600">No invoices yet</p>
          <p className="text-sm mt-1">Invoices will appear here after your first subscription payment.</p>
        </div>
      </div>

      {/* Cancel Section */}
      <div className="mt-10 border border-red-200 rounded-2xl px-6 py-5">
        <h3 className="font-bold text-slate-900 mb-1">Cancel Subscription</h3>
        <p className="text-sm text-slate-500 mb-4">
          Your account will remain active until the end of the current billing period.
          All data will be retained for 30 days after cancellation.
        </p>
        <button className="px-5 h-10 border border-red-300 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors">
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
