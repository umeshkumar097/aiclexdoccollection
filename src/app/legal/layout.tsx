import Link from "next/link";

const COMPANY = {
  name: "Aiclex Solutions Private Limited",
  trading: "AICLEX Technologies",
  product: "Nexdoc",
  cin: "U62099UW2026PTC254970",
  gstin: "09ABGCA0151N1ZL",
  dpiit: "DIPP271379",
  corporate: "Gaur City Mall, Greater Noida – 201318",
  registered: "E58, Sector 3, Noida, UP – 201301",
  email: "legal@aiclex.in",
  year: "2025-26",
};

export { COMPANY };

const NAV_LINKS = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/refund", label: "Refund Policy" },
  { href: "/legal/cookie", label: "Cookie Policy" },
  { href: "/legal/dpa", label: "Data Processing Agreement" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 sticky top-0 bg-white z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-slate-900 tracking-tight">
            Nexdoc
            <span className="text-slate-400 font-normal text-sm ml-2">by Aiclex Solutions</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-slate-900 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="font-bold text-slate-900 mb-3">Aiclex Solutions Private Limited</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Trading as AICLEX Technologies.<br />
                DPIIT Recognized Startup (DIPP271379).
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-3">Offices</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-2">
                <span className="font-semibold text-slate-700">Corporate:</span><br />
                Gaur City Mall, Greater Noida – 201318
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                <span className="font-semibold text-slate-700">Registered:</span><br />
                E58, Sector 3, Noida, UP – 201301
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-3">Legal Pages</p>
              <ul className="space-y-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 space-y-1">
            <p className="text-xs text-slate-500">
              {COMPANY.year} &copy; All rights reserved by Aiclex Solutions Pvt. Ltd. (Trading as AICLEX&#8482; Technologies)
            </p>
            <p className="text-xs text-slate-400">
              CIN: {COMPANY.cin} &nbsp;|&nbsp; GSTIN: {COMPANY.gstin} &nbsp;|&nbsp; DPIIT Recognized Startup ({COMPANY.dpiit})
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
