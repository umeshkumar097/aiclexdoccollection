"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    companyName: "", ownerName: "", email: "", password: "", confirmPassword: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/org-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/login?registered=1");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[420px] bg-slate-900 text-white flex-col justify-between p-12 shrink-0">
        <div>
          <p className="font-black text-2xl tracking-tight mb-2">Nexdoc</p>
          <p className="text-slate-400 text-sm">by Aiclex Solutions</p>
        </div>
        <div className="space-y-8">
          {[
            { title: "14-Day Free Trial", desc: "Full access to all Starter features. No credit card required." },
            { title: "Automated Document Collection", desc: "Send links, collect documents, verify — all in one platform." },
            { title: "Enterprise-Grade Security", desc: "Data encrypted at rest and in transit. DPDPA 2023 compliant." },
          ].map((item) => (
            <div key={item.title} className="border-l-2 border-blue-500 pl-4">
              <p className="font-bold text-white text-sm">{item.title}</p>
              <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs">
          2025-26 Aiclex Solutions Pvt. Ltd.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900">Create Your Account</h1>
            <p className="text-slate-500 text-sm mt-1">
              Start your 14-day free trial. No payment required.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Company / Organization Name" name="companyName" value={form.companyName} onChange={onChange} placeholder="ABC Recruiters Pvt. Ltd." required />
            <Field label="Your Name" name="ownerName" value={form.ownerName} onChange={onChange} placeholder="Rahul Sharma" required />
            <Field label="Work Email Address" name="email" type="email" value={form.email} onChange={onChange} placeholder="rahul@abcrecruiters.com" required />
            <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Minimum 8 characters" required />
            <Field label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="Repeat password" required />

            <button
              type="submit" disabled={loading}
              className="w-full h-13 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? "Creating Account..." : "Start Free Trial"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-center text-xs text-slate-400 mt-4">
            By signing up, you agree to our{" "}
            <Link href="/legal/terms" className="underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder, required }: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{label}</label>
      <input
        name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
      />
    </div>
  );
}
