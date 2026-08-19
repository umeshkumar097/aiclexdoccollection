"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Database, Cloud, Key, CheckCircle2, Loader2, AlertCircle, ArrowRight, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InstallWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [unlockKey, setUnlockKey] = useState("");

  const [formData, setFormData] = useState({
    purchaseCode: "",
    dbUrl: "",
    r2Access: "",
    r2Secret: "",
    r2Endpoint: "",
    r2Bucket: "",
    r2Public: "",
    adminEmail: "",
    adminPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyLicense = async () => {
    if (!formData.purchaseCode) return setError("Please enter your Envato Purchase Code.");
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/installer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyLicense", purchaseCode: formData.purchaseCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUnlockKey(data.unlock_key);
      setStep(2);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  const verifyDatabase = async () => {
    if (!formData.dbUrl) return setError("Please enter your PostgreSQL Database URL.");
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/installer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyDb", dbUrl: formData.dbUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(3);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  const verifyStorage = async () => {
    if (!formData.r2Access || !formData.r2Secret) return setError("Please fill all required storage credentials.");
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/installer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyR2", ...formData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(4);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  const handleFinalize = async () => {
    if (!formData.adminEmail || !formData.adminPassword) return setError("Please enter Admin credentials.");
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/installer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finalize", unlockKey, authSecret: "secret_" + Date.now().toString(36), ...formData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => { window.location.href = "/login"; }, 2000);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  const steps = [
    { id: 1, title: "License", desc: "Verify purchase code.", icon: Key },
    { id: 2, title: "Database", desc: "Connect PostgreSQL.", icon: Database },
    { id: 3, title: "Storage", desc: "Setup Cloudflare R2.", icon: Cloud },
    { id: 4, title: "Admin & Finish", desc: "Create admin account.", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="w-full md:w-[350px] bg-slate-900 text-white p-10 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><ShieldCheck className="w-6 h-6 text-white" /></div>
            <h1 className="text-2xl font-black tracking-tight">AICLEX Installer</h1>
          </div>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.id} className="flex gap-4 relative">
                {s.id !== steps.length && <div className={`absolute top-10 left-5 w-[2px] h-full -ml-[1px] ${step > s.id ? 'bg-blue-500' : 'bg-slate-800'}`}></div>}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 z-10 transition-colors duration-300 ${step > s.id ? "bg-blue-600 border-blue-600" : step === s.id ? "bg-slate-900 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-slate-900 border-slate-700 text-slate-500"}`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5 text-white" /> : <s.icon className="w-4 h-4" />}
                </div>
                <div className="pt-1 pb-4">
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${step >= s.id ? "text-white" : "text-slate-500"}`}>{s.title}</h3>
                  <p className={`text-xs mt-1 ${step >= s.id ? "text-slate-300" : "text-slate-600"}`}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl">
          {error && <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-700 rounded-2xl"><AlertCircle className="h-5 w-5" /><AlertDescription className="font-semibold ml-2">{error}</AlertDescription></Alert>}

          {success ? (
            <div className="text-center"><div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12" /></div><h2 className="text-3xl font-black text-slate-900 mb-3">Setup Complete!</h2></div>
          ) : (
            <Card className="border-0 shadow-2xl shadow-blue-900/5 rounded-[2rem] overflow-hidden bg-white/70 backdrop-blur-xl">
              <CardContent className="p-8 md:p-10">
                {step === 1 && (
                  <div className="space-y-8">
                    <div><h2 className="text-2xl font-black text-slate-900">Activate Your License</h2><p className="text-slate-500 mt-1">Enter your purchase code to verify ownership.</p></div>
                    <div className="space-y-4"><Label className="text-xs font-bold text-slate-700 uppercase">Envato Purchase Code *</Label>
                      <Input name="purchaseCode" placeholder="e.g., 1234abcd..." value={formData.purchaseCode} onChange={handleChange} className="h-14 bg-slate-50 border-slate-200 text-lg font-mono rounded-2xl px-6" />
                    </div>
                    <Button onClick={verifyLicense} disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg"><>{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Continue"}</></Button>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-8">
                    <div><h2 className="text-2xl font-black text-slate-900">Database Connection</h2><p className="text-slate-500 mt-1">Connect your PostgreSQL database.</p></div>
                    <div className="space-y-4"><Label className="text-xs font-bold text-slate-700 uppercase">PostgreSQL Database URL *</Label>
                      <Input name="dbUrl" placeholder="postgresql://user:password@host/db?sslmode=require" value={formData.dbUrl} onChange={handleChange} className="h-14 bg-slate-50 border-slate-200 font-mono text-sm rounded-2xl px-6" />
                      <p className="text-[11px] text-slate-400 font-medium">Format: <code>postgresql://username:password@host:port/database</code></p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl border-slate-200 font-bold" disabled={loading}>Back</Button>
                      <Button onClick={verifyDatabase} disabled={loading} className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Connect & Create Tables"}</Button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-8">
                    <div><h2 className="text-2xl font-black text-slate-900">Storage Configuration</h2><p className="text-slate-500 mt-1">Setup Cloudflare R2 bucket credentials.</p></div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2"><Label className="text-[10px] font-bold text-slate-700 uppercase">R2 Access Key *</Label><Input name="r2Access" value={formData.r2Access} onChange={handleChange} className="h-12 rounded-xl px-4" /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-bold text-slate-700 uppercase">R2 Secret Key *</Label><Input name="r2Secret" type="password" value={formData.r2Secret} onChange={handleChange} className="h-12 rounded-xl px-4" /></div>
                      </div>
                      <div className="space-y-2"><Label className="text-[10px] font-bold text-slate-700 uppercase">R2 Endpoint URL *</Label><Input name="r2Endpoint" placeholder="https://<account_id>.r2.cloudflarestorage.com" value={formData.r2Endpoint} onChange={handleChange} className="h-12 rounded-xl px-4" /></div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2"><Label className="text-[10px] font-bold text-slate-700 uppercase">Bucket Name *</Label><Input name="r2Bucket" value={formData.r2Bucket} onChange={handleChange} className="h-12 rounded-xl px-4" /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-bold text-slate-700 uppercase">Public URL *</Label><Input name="r2Public" placeholder="https://pub-yoururl.r2.dev" value={formData.r2Public} onChange={handleChange} className="h-12 rounded-xl px-4" /></div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-14 rounded-2xl border-slate-200 font-bold" disabled={loading}>Back</Button>
                      <Button onClick={verifyStorage} disabled={loading} className="flex-[2] h-14 bg-blue-600 text-white rounded-2xl font-bold text-lg">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Test Storage"}</Button>
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-8">
                    <div><h2 className="text-2xl font-black text-slate-900">Admin Account</h2><p className="text-slate-500 mt-1">Create the default administrator account.</p></div>
                    <div className="space-y-5">
                        <div className="space-y-2"><Label className="text-xs font-bold text-slate-700 uppercase">Admin Email *</Label><Input name="adminEmail" placeholder="admin@domain.com" value={formData.adminEmail} onChange={handleChange} className="h-14 rounded-xl px-4" /></div>
                        <div className="space-y-2"><Label className="text-xs font-bold text-slate-700 uppercase">Admin Password *</Label><Input name="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} className="h-14 rounded-xl px-4" /></div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-14 rounded-2xl border-slate-200 font-bold" disabled={loading}>Back</Button>
                      <Button onClick={handleFinalize} disabled={loading} className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-emerald-600/20 shadow-lg">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Install & Finish"}</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
