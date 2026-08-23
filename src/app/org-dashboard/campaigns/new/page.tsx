"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const PRESET_DOCS = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Driving License",
  "Voter ID",
  "Resume / CV",
  "10th Marksheet",
  "12th Marksheet",
  "Graduation Degree",
  "Post-Graduation Degree",
  "Experience Letter",
  "Relieving Letter",
  "Offer Letter",
  "Salary Slip",
  "Bank Statement",
  "Cancelled Cheque",
  "Photograph",
  "Signature",
  "Police Verification Certificate",
];

export default function NewCampaignPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName]             = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline]     = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [customDoc, setCustomDoc]   = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const orgId = (session?.user as any)?.orgId;

  const toggleDoc = (doc: string) => {
    setSelectedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const addCustomDoc = () => {
    const trimmed = customDoc.trim();
    if (trimmed && !selectedDocs.includes(trimmed)) {
      setSelectedDocs((prev) => [...prev, trimmed]);
      setCustomDoc("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Campaign name is required."); return; }
    if (selectedDocs.length === 0) { setError("Select at least one required document."); return; }
    if (!orgId) { setError("Session expired. Please sign in again."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/org/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, name, description, requiredDocs: selectedDocs, deadline }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/org-dashboard/campaigns/${data.campaign.id}?created=1`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/org-dashboard" className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">New Campaign</h1>
            <p className="text-slate-500 text-sm mt-0.5">Create a document collection campaign and share the link.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <h2 className="font-bold text-slate-900">Campaign Details</h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Campaign Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. August 2025 Hiring Drive"
                required
                className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Description <span className="text-slate-400 font-normal normal-case">(Optional — shown to candidates)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Please upload the following documents for your onboarding process."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Deadline <span className="text-slate-400 font-normal normal-case">(Optional)</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="h-12 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Document Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Required Documents</h2>
              {selectedDocs.length > 0 && (
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {selectedDocs.length} selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              {PRESET_DOCS.map((doc) => {
                const selected = selectedDocs.includes(doc);
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => toggleDoc(doc)}
                    className={`h-10 px-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {selected && <span className="mr-1.5">&#10003;</span>}
                    {doc}
                  </button>
                );
              })}
            </div>

            {/* Custom doc */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Add Custom Document</label>
              <div className="flex gap-3">
                <input
                  value={customDoc}
                  onChange={(e) => setCustomDoc(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomDoc(); } }}
                  placeholder="e.g. NOC from Previous Employer"
                  className="flex-1 h-10 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={addCustomDoc}
                  className="h-10 px-4 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Selected list */}
            {selectedDocs.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Selected Documents (in order)</p>
                <div className="space-y-2">
                  {selectedDocs.map((doc, idx) => (
                    <div key={doc} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}</span>
                        <span className="text-sm font-semibold text-slate-700">{doc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleDoc(doc)}
                        className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-13 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? "Creating Campaign..." : "Create Campaign and Get Link"}
          </button>
        </form>

      </div>
    </div>
  );
}
