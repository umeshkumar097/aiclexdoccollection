"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyForm({
  campaignSlug,
  requiredDocs,
  brandColor,
  orgName,
}: {
  campaignSlug: string;
  requiredDocs: string[];
  brandColor: string;
  orgName: string;
}) {
  const router = useRouter();
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your full name."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignSlug, name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/c/${data.token}`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* What to expect */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="font-semibold text-slate-800 text-sm mb-3">You will need to upload {requiredDocs.length} document{requiredDocs.length !== 1 ? "s" : ""}:</p>
        <div className="space-y-2">
          {requiredDocs.map((doc, i) => (
            <div key={doc} className="flex items-center gap-3 text-sm text-slate-600">
              <span
                className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                style={{ backgroundColor: brandColor }}
              >
                {i + 1}
              </span>
              {doc}
            </div>
          ))}
        </div>
      </div>

      {/* Entry Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <p className="font-bold text-slate-900 mb-1">Enter your details to begin</p>
        <p className="text-slate-500 text-sm mb-5">
          {orgName} needs your basic information before you can upload documents.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Rahul Kumar"
              className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Email <span className="text-slate-400 font-normal normal-case">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Phone <span className="text-slate-400 font-normal normal-case">(Optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-white font-bold rounded-xl text-sm transition-opacity hover:opacity-90 disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            style={{ backgroundColor: brandColor }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Please wait...
              </>
            ) : (
              "Continue to Upload Documents"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
