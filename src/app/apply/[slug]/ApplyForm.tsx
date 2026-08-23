"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyForm({
  campaignSlug,
  requiredDocs,
  brandColor,
}: {
  campaignSlug: string;
  requiredDocs: string[];
  brandColor: string;
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
      // Redirect to personal upload page
      router.push(`/c/${data.token}`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <p className="font-bold text-slate-900 mb-1">Your Details</p>
      <p className="text-slate-500 text-sm mb-5">
        Enter your details to start uploading your documents.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Rahul Kumar"
            className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": brandColor } as any}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rahul@example.com"
            className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: brandColor }}
          className="w-full h-12 text-white font-bold rounded-xl text-sm transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
        >
          {loading ? "Please wait..." : `Start Uploading — ${requiredDocs.length} Documents Required`}
        </button>
      </form>
    </div>
  );
}
