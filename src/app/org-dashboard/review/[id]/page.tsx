"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  DOCS_COMPLETE: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function ReviewCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<any>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/org/candidates/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          setCandidate(d.candidate);
          if (d.candidate?.documents?.length > 0) setSelectedDoc(d.candidate.documents[0]);
        }
        setLoading(false);
      });
  }, [id]);

  const doAction = async (action: "APPROVE" | "REJECT") => {
    setActionLoading(true); setMessage("");
    const res = await fetch(`/api/org/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, note }),
    });
    const data = await res.json();
    if (data.success) {
      setCandidate((prev: any) => ({
        ...prev,
        status: action === "APPROVE" ? "APPROVED" : "REJECTED",
      }));
      setMessage(action === "APPROVE" ? "Candidate approved." : "Candidate rejected.");
    }
    setActionLoading(false);
  };

  const whatsappUrl = candidate?.phone
    ? `https://wa.me/91${candidate.phone.replace(/\D/g, "")}?text=Dear%20${encodeURIComponent(candidate.name ?? "")}%2C%20regarding%20your%20document%20submission%20on%20Nexdoc.`
    : null;

  if (loading) return <div className="p-8 text-slate-500">Loading candidate...</div>;
  if (!candidate) return <div className="p-8 text-red-500">Candidate not found.</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      {/* LEFT — Candidate List Panel */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-slate-100">
          <Link href="/org-dashboard/candidates" className="text-blue-600 text-xs font-semibold hover:underline">
            Back to Candidates
          </Link>
          <p className="font-bold text-slate-900 mt-2">{candidate.name ?? "Anonymous"}</p>
          <p className="text-xs text-slate-500">{candidate.campaign?.name}</p>
          <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_BADGE[candidate.status] ?? ""}`}>
            {candidate.status.replace("_", " ")}
          </span>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 pt-4 pb-2 text-xs font-bold text-slate-500 uppercase">Documents</p>
          {candidate.documents?.length > 0 ? (
            candidate.documents.map((doc: any) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedDoc?.id === doc.id ? "bg-blue-50 border-l-2 border-l-blue-600" : ""}`}
              >
                <p className="text-sm font-semibold text-slate-800">{doc.doc_type}</p>
                <p className="text-xs text-slate-400 mt-0.5">{doc.size_kb} KB</p>
                <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${doc.status === "VERIFIED" ? "bg-green-100 text-green-700" : doc.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {doc.status}
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-4 text-slate-400 text-sm">No documents uploaded.</p>
          )}
        </div>

        {/* Candidate Info */}
        <div className="px-4 py-4 border-t border-slate-100 space-y-1.5">
          {candidate.email && <p className="text-xs text-slate-500">{candidate.email}</p>}
          {candidate.phone && <p className="text-xs text-slate-500">{candidate.phone}</p>}
        </div>
      </div>

      {/* RIGHT — Document Viewer + Actions */}
      <div className="flex-1 flex flex-col">
        {/* Document Viewer */}
        <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
          {selectedDoc ? (
            selectedDoc.file_url.match(/\.(pdf)$/i) ? (
              <iframe src={selectedDoc.file_url} className="w-full h-full border-0" title="Document Preview" />
            ) : (
              <img
                src={selectedDoc.file_url}
                alt={selectedDoc.doc_type}
                className="max-h-full max-w-full object-contain shadow-xl rounded-lg"
              />
            )
          ) : (
            <p className="text-slate-400">Select a document from the left panel.</p>
          )}
        </div>

        {/* Action Panel */}
        <div className="bg-white border-t border-slate-200 px-6 py-4">
          {message && (
            <div className="mb-3 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
              {message}
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)..."
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => doAction("APPROVE")}
                  disabled={actionLoading || candidate.status === "APPROVED"}
                  className="h-10 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => doAction("REJECT")}
                  disabled={actionLoading || candidate.status === "REJECTED"}
                  className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  Reject
                </button>
              </div>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.844L.057 24l6.304-1.654A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374A9.869 9.869 0 012.106 12C2.106 6.53 6.53 2.106 12 2.106S21.894 6.53 21.894 12 17.47 21.894 12 21.894z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
