"use client";
import { useEffect, useState } from "react";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const ORG_ID = "REPLACE_WITH_ORG_ID";

  const fetchKeys = () => {
    setLoading(true);
    fetch(`/api/org/api-keys?orgId=${ORG_ID}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.upgrade) { setUpgradeRequired(true); return; }
        setKeys(d.keys ?? []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchKeys(); }, []);

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/org/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId: ORG_ID, name: newKeyName.trim() }),
    });
    const data = await res.json();
    if (data.key) { setNewKey(data.key); fetchKeys(); setNewKeyName(""); }
    setCreating(false);
  };

  const revokeKey = async (keyId: string) => {
    await fetch("/api/org/api-keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyId }),
    });
    fetchKeys();
  };

  if (upgradeRequired) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-8 text-center">
          <p className="font-bold text-slate-900 text-lg mb-2">API Access — Enterprise Plan Required</p>
          <p className="text-slate-500 text-sm mb-5">
            API access and programmatic key management are available on the Enterprise plan.
          </p>
          <a href="/dashboard/billing" className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700">
            View Upgrade Options
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">API Keys</h1>
        <p className="text-slate-500 text-sm mt-1">
          Programmatic access to your Nexdoc organization data.
          Keys are shown only once on creation — store them securely.
        </p>
      </div>

      {newKey && (
        <div className="mb-6 bg-green-50 border border-green-300 rounded-2xl p-5">
          <p className="font-bold text-green-800 text-sm mb-2">New API Key — Copy it now. It will not be shown again.</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-white border border-green-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 break-all">
              {newKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(newKey); }}
              className="h-10 px-4 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700"
            >
              Copy
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="mt-3 text-xs text-green-700 underline">
            I have saved this key — dismiss
          </button>
        </div>
      )}

      {/* Create Key */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <p className="font-bold text-slate-900 mb-4">Create New API Key</p>
        <div className="flex gap-3">
          <input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Production Integration)"
            className="flex-1 h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={createKey}
            disabled={creating || !newKeyName.trim()}
            className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
          >
            {creating ? "Creating..." : "Generate Key"}
          </button>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Key Prefix</th>
              <th className="px-6 py-3 text-left">Last Used</th>
              <th className="px-6 py-3 text-left">Created</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : keys.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No API keys created yet.</td></tr>
            ) : (
              keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-800">{k.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">{k.key_prefix}...</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{k.last_used ? new Date(k.last_used).toLocaleDateString("en-IN") : "Never"}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(k.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => revokeKey(k.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold"
                    >
                      Revoke
                    </button>
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
