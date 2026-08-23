"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  PENDING:       "bg-yellow-100 text-yellow-800",
  DOCS_COMPLETE: "bg-blue-100 text-blue-800",
  UNDER_REVIEW:  "bg-purple-100 text-purple-800",
  APPROVED:      "bg-green-100 text-green-800",
  REJECTED:      "bg-red-100 text-red-800",
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [campaign, setCampaign] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const created = searchParams.get("created") === "1";

  useEffect(() => {
    if (!id) return;
    fetch(`/api/org/campaigns/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          setCampaign(d.campaign);
          setCandidates(d.candidates ?? []);
        }
        setLoading(false);
      });
  }, [id]);

  const copyLink = () => {
    const url = `${window.location.origin}/apply/${campaign?.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;
  if (!campaign) return <div className="p-8 text-red-500">Campaign not found.</div>;

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/apply/${campaign.slug}`;

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Success Banner */}
      {created && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
          <p className="font-bold text-green-800">Campaign created successfully.</p>
          <p className="text-sm text-green-600 mt-1">Copy the link below and share it with your candidates.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/org-dashboard" className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{campaign.name}</h1>
            {campaign.description && <p className="text-slate-500 text-sm mt-1">{campaign.description}</p>}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${campaign.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
          {campaign.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Share Link */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <p className="font-bold text-slate-900 mb-3">Candidate Link</p>
        <p className="text-slate-500 text-sm mb-4">
          Share this link with candidates. They can upload documents directly without logging in.
        </p>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 break-all">
            {shareUrl}
          </code>
          <button
            onClick={copyLink}
            className={`h-11 px-5 font-bold text-sm rounded-xl transition-colors shrink-0 ${
              copied
                ? "bg-green-600 text-white"
                : "bg-slate-900 hover:bg-slate-700 text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Required Documents */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <p className="font-bold text-slate-900 mb-3">Required Documents ({(campaign.required_docs as string[]).length})</p>
        <div className="flex flex-wrap gap-2">
          {(campaign.required_docs as string[]).map((doc: string) => (
            <span key={doc} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold">
              {doc}
            </span>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="font-bold text-slate-900">Candidates ({candidates.length})</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Documents</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Submitted</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <p className="font-semibold text-slate-500 mb-1">No candidates yet.</p>
                  <p className="text-sm">Share the link above to start collecting documents.</p>
                </td>
              </tr>
            ) : (
              candidates.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-800">{c.name ?? "Anonymous"}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{c.email ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{c._count?.documents ?? 0} / {(campaign.required_docs as string[]).length}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_BADGE[c.status] ?? ""}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/org-dashboard/review/${c.id}`}
                      className="text-blue-600 hover:underline text-xs font-semibold"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
