import Link from "next/link";
export const metadata = { title: "Legal | Nexdoc by Aiclex Solutions" };

const PAGES = [
  { href: "/legal/terms", title: "Terms of Service", desc: "Rules and conditions governing use of the Nexdoc platform." },
  { href: "/legal/privacy", title: "Privacy Policy", desc: "How we collect, process, and protect your personal data." },
  { href: "/legal/refund", title: "Refund and Cancellation Policy", desc: "Subscription cancellation and refund eligibility guidelines." },
  { href: "/legal/cookie", title: "Cookie Policy", desc: "Cookies used by Nexdoc and how to manage them." },
  { href: "/legal/dpa", title: "Data Processing Agreement", desc: "DPDPA-aligned agreement for enterprise customers." },
];

export default function LegalIndexPage() {
  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Legal Documents</h1>
      <p className="text-slate-500 mb-10">
        All legal policies and agreements governing the use of Nexdoc, operated by Aiclex Solutions Private Limited.
      </p>
      <div className="space-y-4">
        {PAGES.map((p) => (
          <Link key={p.href} href={p.href} className="block border border-slate-200 rounded-2xl px-6 py-5 hover:border-slate-400 hover:shadow-sm transition-all">
            <p className="font-bold text-slate-900 mb-1">{p.title}</p>
            <p className="text-sm text-slate-500">{p.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-6 text-sm text-slate-500 leading-relaxed">
        <p className="font-bold text-slate-700 mb-2">Aiclex Solutions Private Limited</p>
        <p>CIN: U62099UW2026PTC254970 &nbsp;|&nbsp; GSTIN: 09ABGCA0151N1ZL &nbsp;|&nbsp; DPIIT Recognized Startup (DIPP271379)</p>
        <p className="mt-2">Registered Office: E58, Sector 3, Noida, UP – 201301</p>
        <p>Corporate Office: Gaur City Mall, Greater Noida – 201318</p>
        <p className="mt-3 text-xs text-slate-400">
          2025-26 &copy; All rights reserved by Aiclex Solutions Pvt. Ltd. (Trading as AICLEX&#8482; Technologies)
        </p>
      </div>
    </div>
  );
}
