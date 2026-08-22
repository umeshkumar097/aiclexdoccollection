"use client";
import { useState, useRef } from "react";

interface Props {
  candidate: { id: string; name: string | null; token: string; status: string; uploadedDocs: string[] };
  campaign: {
    name: string;
    description: string | null;
    requiredDocs: string[];
    org: { name: string; logo_url: string | null; brand_color: string };
  };
}

export default function CandidatePublicForm({ candidate, campaign }: Props) {
  const [uploads, setUploads] = useState<Record<string, File | null>>({});
  const [uploaded, setUploaded] = useState<string[]>(candidate.uploadedDocs);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleUpload = async (docType: string) => {
    const file = uploads[docType];
    if (!file) return;
    setUploading(docType); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("candidateId", candidate.id);
      fd.append("docType", docType);
      const res = await fetch("/api/org/upload-doc", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUploaded((prev) => [...prev, docType]);
      setUploads((prev) => ({ ...prev, [docType]: null }));
    } catch (err: any) {
      setError(err.message ?? "Upload failed.");
    } finally {
      setUploading(null);
    }
  };

  const allDone = campaign.requiredDocs.every((d) => uploaded.includes(d));
  const completed = campaign.requiredDocs.filter((d) => uploaded.includes(d)).length;
  const brandColor = campaign.org.brand_color ?? "#2563eb";

  if (candidate.status === "APPROVED") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Application Approved</h2>
          <p className="text-slate-500 text-sm">Your documents have been verified and approved by {campaign.org.name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Org Branded Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {campaign.org.logo_url ? (
            <img src={campaign.org.logo_url} alt={campaign.org.name} className="h-8 w-auto object-contain" />
          ) : (
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ backgroundColor: brandColor }}>
              {campaign.org.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-slate-900">{campaign.org.name}</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Campaign Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">{campaign.name}</h1>
          {campaign.description && (
            <p className="text-slate-500 text-sm mt-2">{campaign.description}</p>
          )}
          {candidate.name && (
            <p className="text-slate-600 text-sm mt-3">Hello, <strong>{candidate.name}</strong>. Please upload the required documents below.</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Progress</span>
            <span>{completed} of {campaign.requiredDocs.length} documents uploaded</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${campaign.requiredDocs.length > 0 ? (completed / campaign.requiredDocs.length) * 100 : 0}%`,
                backgroundColor: brandColor,
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Document Upload Cards */}
        <div className="space-y-4">
          {campaign.requiredDocs.map((docType) => {
            const isDone = uploaded.includes(docType);
            const file = uploads[docType];
            return (
              <div key={docType} className={`bg-white border rounded-2xl p-5 transition-colors ${isDone ? "border-green-300" : "border-slate-200"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isDone ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{docType}</p>
                  </div>
                  {isDone ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Uploaded</span>
                  ) : (
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">Required</span>
                  )}
                </div>
                {!isDone && (
                  <div className="flex items-center gap-3">
                    <input
                      ref={(el) => { inputRefs.current[docType] = el; }}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setUploads((prev) => ({ ...prev, [docType]: e.target.files?.[0] ?? null }))}
                      className="flex-1 text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold file:text-xs hover:file:bg-slate-200"
                    />
                    <button
                      onClick={() => handleUpload(docType)}
                      disabled={!file || uploading === docType}
                      className="h-9 px-4 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors"
                      style={{ backgroundColor: file && uploading !== docType ? brandColor : undefined, background: !file || uploading === docType ? "#94a3b8" : undefined }}
                    >
                      {uploading === docType ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {allDone && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl px-6 py-5 text-center">
            <p className="font-bold text-green-800">All documents uploaded successfully.</p>
            <p className="text-sm text-green-600 mt-1">{campaign.org.name} will review your submission and get in touch with you.</p>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          Secured by Nexdoc — Aiclex Solutions Private Limited
        </p>
      </div>
    </div>
  );
}
