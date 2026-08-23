import Link from "next/link";

const FEATURES = [
  {
    title: "Custom Document Campaigns",
    desc: "Create separate collection forms for each hiring drive or onboarding program. Each campaign gets a unique shareable link.",
  },
  {
    title: "Branded Candidate Portal",
    desc: "Candidates see your company logo and brand colors — not ours. A professional experience that builds trust.",
  },
  {
    title: "Split-Screen Document Reviewer",
    desc: "View uploaded documents and approve or reject them without leaving the page. Process 50 candidates in minutes.",
  },
  {
    title: "WhatsApp Follow-Up Button",
    desc: "Send a pre-filled WhatsApp message to any candidate directly from the dashboard. No API cost, zero setup.",
  },
  {
    title: "AI Document Validation",
    desc: "Automatic checks flag blank, corrupt, or undersized files before they reach your reviewers.",
  },
  {
    title: "Audit Logs",
    desc: "Every action — approval, rejection, download, login — is permanently logged with timestamp and IP address.",
  },
  {
    title: "Bulk ZIP Download",
    desc: "Download all documents for an entire campaign as a single organized ZIP file with one click.",
  },
  {
    title: "Email and SMTP Notifications",
    desc: "Automatic emails on form submission, approval, and rejection. Enterprise clients can use their own SMTP or Resend account.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "4,999",
    desc: "For small HR teams and growing recruiters.",
    features: [
      "2 Admin Users",
      "100 Candidates per Month",
      "5 GB Document Storage",
      "3 Active Campaigns",
      "Email Notifications",
      "Bulk ZIP Download",
      "Email Support (48hr)",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "7,999",
    desc: "For mid-size HR firms and NBFCs.",
    features: [
      "10 Admin Users",
      "500 Candidates per Month",
      "25 GB Document Storage",
      "Unlimited Campaigns",
      "WhatsApp Follow-Up Button",
      "Custom Branding and Logo",
      "AI Document Validation",
      "Audit Logs",
      "Two-Factor Authentication",
      "Priority Support (24hr)",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "14,999",
    desc: "For large organizations with complex requirements.",
    features: [
      "Unlimited Users",
      "Unlimited Candidates",
      "Unlimited Storage",
      "Everything in Professional",
      "Custom SMTP or Resend Integration",
      "REST API Access",
      "Custom Domain",
      "Dedicated Account Manager",
      "First Access to New Features",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@aiclex.in",
    highlighted: false,
  },
];

const USE_CASES = [
  {
    sector: "Recruitment Agencies",
    points: [
      "Run multiple hiring campaigns simultaneously for different client companies.",
      "Each client sees their own branded portal with their logo.",
      "Download all candidate documents campaign-wise in a single ZIP.",
      "Send WhatsApp follow-ups to incomplete applications in one click.",
    ],
  },
  {
    sector: "HR and Onboarding Teams",
    points: [
      "Replace scattered WhatsApp groups and email threads with one organized portal.",
      "Track which new joiners have submitted all required documents.",
      "Approve or reject documents without downloading — built-in viewer.",
      "Automated reminders to candidates who submitted incomplete documents.",
    ],
  },
  {
    sector: "NBFCs and Financial Institutions",
    points: [
      "Collect KYC documents in a structured, auditable workflow.",
      "Every action logged with user identity, timestamp, and IP address.",
      "Documents stored encrypted with access controlled by user roles.",
      "Export audit logs for compliance reviews.",
    ],
  },
  {
    sector: "Skill Development and Training Institutes",
    points: [
      "Enroll batches of 50 to 500 students with a single campaign link.",
      "Collect Aadhaar, marksheets, and photos in one place.",
      "Track document completion across the entire batch.",
      "Approved candidates automatically marked for enrollment.",
    ],
  },
];

const STATS = [
  { value: "14 Days", label: "Free Trial — No Card Required" },
  { value: "99.5%", label: "Monthly Uptime SLA" },
  { value: "DPDPA", label: "2023 Compliant" },
  { value: "DPIIT", label: "Recognized Startup" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl text-slate-900 tracking-tight">Nexdoc</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">by Aiclex Solutions</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-slate-900 transition-colors">Use Cases</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <Link href="/legal" className="hover:text-slate-900 transition-colors">Legal</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide">
            DPIIT Recognized Startup — Built in India for India
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Document Collection,<br />
            <span className="text-blue-400">Done Right.</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Nexdoc replaces WhatsApp groups and email threads with a professional,
            branded document collection portal for HR teams, recruitment agencies, and NBFCs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="h-13 py-4 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-base transition-colors"
            >
              Start 14-Day Free Trial
            </Link>
            <a
              href="mailto:sales@aiclex.in"
              className="h-13 py-4 px-8 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-bold rounded-2xl text-base transition-colors"
            >
              Talk to Sales
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-5">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Everything your team needs to collect documents at scale
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Built specifically for Indian HR teams, recruitment agencies, and financial institutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <p className="font-bold text-slate-900 mb-2 text-sm">{f.title}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">How it works</h2>
            <p className="text-slate-400 text-lg">Set up in minutes. Start collecting documents the same day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create a Campaign", desc: "Define which documents you need — Aadhaar, PAN, degree, photo. Name your campaign." },
              { step: "02", title: "Share the Link", desc: "Copy the unique link and share it via email, WhatsApp, or job portal. No app download needed." },
              { step: "03", title: "Candidates Upload", desc: "Candidates see your branded portal and upload documents from any device." },
              { step: "04", title: "Review and Approve", desc: "Your team reviews documents in the split-screen viewer and approves with one click." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-sm mx-auto mb-4">
                  {item.step}
                </div>
                <p className="font-bold text-white mb-2">{item.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Built for your industry</h2>
            <p className="text-slate-500 text-lg">Nexdoc is used by teams across hiring, onboarding, finance, and education.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {USE_CASES.map((uc) => (
              <div key={uc.sector} className="bg-white border border-slate-200 rounded-2xl p-8">
                <p className="font-black text-slate-900 text-lg mb-5">{uc.sector}</p>
                <ul className="space-y-3">
                  {uc.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="text-blue-600 font-bold mt-0.5 shrink-0">&#10003;</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Transparent pricing, no surprises</h2>
            <p className="text-slate-500 text-lg">All plans include a 14-day free trial. No credit card required to start.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-2xl shadow-blue-200"
                    : "bg-white border border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="text-xs font-black bg-white text-blue-600 px-3 py-1 rounded-full self-start mb-4">
                    MOST POPULAR
                  </span>
                )}
                <p className={`font-black text-xl mb-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </p>
                <p className={`text-sm mb-6 ${plan.highlighted ? "text-blue-100" : "text-slate-500"}`}>
                  {plan.desc}
                </p>
                <div className="mb-2">
                  <span className={`text-4xl font-black ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                    Rs. {plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlighted ? "text-blue-100" : "text-slate-500"}`}>
                    / month
                  </span>
                </div>
                <p className={`text-xs mb-8 ${plan.highlighted ? "text-blue-200" : "text-slate-400"}`}>
                  + 18% GST applicable
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlighted ? "text-blue-50" : "text-slate-600"}`}>
                      <span className={`font-bold mt-0.5 shrink-0 ${plan.highlighted ? "text-white" : "text-green-600"}`}>
                        &#10003;
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-colors ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8">
            Need a custom plan for more than 50 users?{" "}
            <a href="mailto:sales@aiclex.in" className="text-blue-600 font-semibold hover:underline">
              Contact our sales team.
            </a>
          </p>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-5">
                Enterprise-grade security, built in from day one
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Every document on Nexdoc is stored encrypted. All connections use TLS.
                Access is controlled by role — reviewers can only see what they are supposed to see.
              </p>
              <ul className="space-y-3">
                {[
                  "Data encrypted at rest and in transit",
                  "Role-based access control (Admin, Reviewer, Viewer)",
                  "Immutable audit logs — every action permanently recorded",
                  "Two-factor authentication (Professional and above)",
                  "DPDPA 2023 compliant — Data Processing Agreement available",
                  "Tenant data fully isolated — no cross-account data access possible",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-blue-600 font-bold mt-0.5 shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 text-white space-y-5">
              {[
                { label: "CIN", value: "U62099UW2026PTC254970" },
                { label: "GSTIN", value: "09ABGCA0151N1ZL" },
                { label: "DPIIT Recognition", value: "DIPP271379" },
                { label: "Registered Office", value: "E58, Sector 3, Noida, UP – 201301" },
                { label: "Corporate Office", value: "Gaur City Mall, Greater Noida – 201318" },
              ].map((item) => (
                <div key={item.label} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</p>
                  <p className="text-sm text-slate-300 font-mono">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">
            Ready to replace WhatsApp chaos with a proper system?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Start your 14-day free trial today. No credit card required. Full access to all Starter features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="py-4 px-8 bg-white text-blue-600 font-black rounded-2xl text-base hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <a
              href="mailto:sales@aiclex.in"
              className="py-4 px-8 border border-blue-400 text-white font-bold rounded-2xl text-base hover:bg-blue-700 transition-colors"
            >
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <p className="font-black text-xl mb-2">Nexdoc</p>
              <p className="text-slate-400 text-sm mb-4">
                A product of Aiclex Solutions Private Limited.<br />
                Document collection and onboarding for modern HR teams.
              </p>
              <p className="text-slate-500 text-xs">
                DPIIT Recognized Startup (DIPP271379)<br />
                CIN: U62099UW2026PTC254970
              </p>
            </div>
            <div>
              <p className="font-bold text-sm mb-4 text-slate-300">Product</p>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Free Trial</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-sm mb-4 text-slate-300">Legal</p>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/legal/dpa" className="hover:text-white transition-colors">Data Processing Agreement</Link></li>
                <li><a href="mailto:sales@aiclex.in" className="hover:text-white transition-colors">Contact Sales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 space-y-2">
            <p className="text-xs text-slate-500">
              2025-26 &copy; All rights reserved by Aiclex Solutions Pvt. Ltd. (Trading as AICLEX&#8482; Technologies)
            </p>
            <p className="text-xs text-slate-600">
              CIN: U62099UW2026PTC254970 &nbsp;|&nbsp; GSTIN: 09ABGCA0151N1ZL &nbsp;|&nbsp; DPIIT Recognized Startup (DIPP271379)
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
