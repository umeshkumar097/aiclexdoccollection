export const metadata = { title: "Cookie Policy | Nexdoc" };
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
export default function CookiePage() {
  return (
    <article className="prose prose-slate max-w-none">
      <p className="text-sm text-slate-500 mb-2">Last updated: August 22, 2025</p>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Cookie Policy</h1>
      <p className="text-slate-500 mb-10">
        This Cookie Policy explains how Nexdoc, operated by Aiclex Solutions Private Limited, uses cookies
        and similar tracking technologies.
      </p>
      <Section title="1. What Are Cookies">
        <p>
          Cookies are small text files stored on your device by your web browser when you visit a website.
          They help the website remember your preferences and actions over a period of time.
        </p>
      </Section>
      <Section title="2. Cookies We Use">
        <p><strong>Strictly Necessary Cookies:</strong> These cookies are essential for the platform to function. They cannot be disabled.</p>
        <ul>
          <li><code>next-auth.session-token</code> — Manages your authenticated session. Expires when you close the browser or after 8 hours.</li>
          <li><code>sa_token</code> — Super Admin authentication token. HTTP-only, expires after 8 hours.</li>
          <li><code>__cf_bm</code> — Cloudflare bot management cookie. Duration: 30 minutes.</li>
        </ul>
        <p><strong>Functional Cookies:</strong></p>
        <ul>
          <li>Preference cookies to remember your UI settings such as selected campaign or dashboard view.</li>
        </ul>
        <p><strong>Analytics Cookies (if enabled):</strong></p>
        <ul>
          <li>We may use anonymized, aggregated analytics to understand platform usage patterns. No personally identifiable information is included in analytics data.</li>
        </ul>
      </Section>
      <Section title="3. Third-Party Cookies">
        <p>
          Cashfree Payments may set cookies during the payment process. These are governed by
          Cashfree&apos;s own privacy and cookie policy.
        </p>
      </Section>
      <Section title="4. Managing Cookies">
        <p>
          You can control cookies through your browser settings. Note that disabling strictly necessary
          cookies will prevent you from logging in or using the platform.
        </p>
      </Section>
      <Section title="5. Contact">
        <p>Email: privacy@aiclex.in</p>
      </Section>
    </article>
  );
}
