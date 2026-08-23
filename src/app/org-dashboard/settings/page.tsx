"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
  const [emailTab, setEmailTab] = useState<"aiclex"|"smtp"|"resend">("aiclex");
  const [smtpForm, setSmtpForm] = useState({ host:"", port:"587", user:"", pass:"", from:"" });
  const [resendKey, setResendKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveEmailConfig = async () => {
    setSaving(true);
    const body =
      emailTab === "smtp"
        ? { provider: "SMTP", smtp_host: smtpForm.host, smtp_port: parseInt(smtpForm.port), smtp_user: smtpForm.user, smtp_pass: smtpForm.pass, from_email: smtpForm.from }
        : emailTab === "resend"
        ? { provider: "RESEND", resend_api_key: resendKey }
        : { provider: "AICLEX" };

    await fetch("/api/org/settings/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId: (session?.user as any)?.orgId, ...body }),
    });
    setSaved(true); setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Organization Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage branding, email configuration, and preferences.</p>
      </div>

      {/* Email Configuration */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-slate-900 mb-1">Email Notification Settings</h2>
        <p className="text-slate-500 text-sm mb-5">
          Choose how outgoing emails are sent from your organization.
          Custom SMTP and Resend configuration are available on the Enterprise plan.
        </p>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6">
          {(["aiclex", "smtp", "resend"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setEmailTab(tab)}
              className={`px-4 h-9 rounded-xl text-sm font-semibold transition-colors ${
                emailTab === tab ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab === "aiclex" ? "Nexdoc Default" : tab === "smtp" ? "Custom SMTP" : "Resend API"}
            </button>
          ))}
        </div>

        {emailTab === "aiclex" && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            Emails will be sent from <strong>noreply@nexdoc.in</strong> using the Nexdoc shared email infrastructure.
            No configuration required.
          </div>
        )}

        {emailTab === "smtp" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="SMTP Host" value={smtpForm.host} onChange={(v) => setSmtpForm({ ...smtpForm, host: v })} placeholder="smtp.gmail.com" />
              <Field label="SMTP Port" value={smtpForm.port} onChange={(v) => setSmtpForm({ ...smtpForm, port: v })} placeholder="587" />
            </div>
            <Field label="Username / Email" value={smtpForm.user} onChange={(v) => setSmtpForm({ ...smtpForm, user: v })} placeholder="hr@yourcompany.com" />
            <Field label="Password / App Password" type="password" value={smtpForm.pass} onChange={(v) => setSmtpForm({ ...smtpForm, pass: v })} placeholder="••••••••" />
            <Field label="From Email Address" value={smtpForm.from} onChange={(v) => setSmtpForm({ ...smtpForm, from: v })} placeholder="hr@yourcompany.com" />
          </div>
        )}

        {emailTab === "resend" && (
          <div className="space-y-4">
            <Field label="Resend API Key" type="password" value={resendKey} onChange={setResendKey} placeholder="re_xxxxxxxxxxxxxxxxxxxx" />
            <p className="text-xs text-slate-400">
              Get your API key from <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a>. Emails will be sent from your verified domain.
            </p>
          </div>
        )}

        {saved && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl">
            Settings saved successfully.
          </div>
        )}

        <button
          onClick={saveEmailConfig}
          disabled={saving}
          className="mt-5 h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Email Settings"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  );
}
