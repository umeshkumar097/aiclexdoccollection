export const metadata = { title: "Terms of Service | Nexdoc by Aiclex Solutions" };

export default function TermsPage() {
  return (
    <article className="prose prose-slate max-w-none">
      <p className="text-sm text-slate-500 mb-2">Last updated: August 22, 2025</p>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-slate-500 mb-10">
        These Terms of Service govern your access to and use of Nexdoc, a product of Aiclex Solutions Private Limited.
        By subscribing to or using Nexdoc, you agree to be bound by these terms.
      </p>

      <Section title="1. Parties">
        <p>
          This agreement is between <strong>Aiclex Solutions Private Limited</strong> (CIN: U62099UW2026PTC254970),
          a company incorporated under the Companies Act, 2013, having its registered office at E58, Sector 3,
          Noida, UP – 201301 (hereinafter referred to as &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), and
          you, the subscribing organization or individual (hereinafter referred to as &quot;Customer&quot; or &quot;you&quot;).
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          Nexdoc is a cloud-based, multi-tenant Software-as-a-Service (SaaS) platform that enables organizations
          to collect, manage, and verify documents and onboarding data from candidates, employees, or third parties.
          The service is made available on a subscription basis through nexdoc.in and related subdomains.
        </p>
      </Section>

      <Section title="3. Subscriptions and Billing">
        <ul>
          <li>Subscriptions are billed on a monthly basis in advance.</li>
          <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise.</li>
          <li>Payments are processed via Cashfree Payments. By subscribing, you authorize us to charge your selected payment method each billing cycle.</li>
          <li>Failed payments will result in a 3-day grace period after which access to the platform may be suspended.</li>
          <li>Downgrading your plan takes effect at the end of the current billing cycle.</li>
          <li>Upgrading your plan takes effect immediately, and the difference in price is prorated for the remainder of the billing cycle.</li>
        </ul>
      </Section>

      <Section title="4. Free Trial">
        <p>
          New organizations are entitled to a 14-day free trial period on the Starter plan tier.
          No payment information is required during the trial. At the end of the trial period,
          continued access requires selection of a paid subscription plan.
        </p>
      </Section>

      <Section title="5. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the platform for any unlawful purpose or in violation of any applicable Indian or international law.</li>
          <li>Upload, store, or transmit any malicious code, viruses, or harmful data.</li>
          <li>Attempt to gain unauthorized access to any other organization&apos;s data.</li>
          <li>Reverse engineer, decompile, or attempt to extract the source code of the platform.</li>
          <li>Resell or sublicense access to the platform without prior written consent.</li>
          <li>Use the platform to collect data from individuals without their informed consent.</li>
        </ul>
      </Section>

      <Section title="6. Data Ownership and Responsibility">
        <p>
          You retain full ownership of all data uploaded to or generated through Nexdoc by your organization and
          your candidates. Aiclex Solutions acts solely as a data processor on your behalf. You are responsible for
          ensuring that your collection and processing of personal data complies with all applicable laws,
          including the Digital Personal Data Protection Act, 2023 (DPDPA).
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          The Nexdoc platform, including its software, design, trademarks, and content, is the exclusive property
          of Aiclex Solutions Private Limited. Nothing in this agreement grants you any ownership rights in the platform.
          The name &quot;Nexdoc&quot; and &quot;AICLEX&quot; are trademarks of Aiclex Solutions Private Limited.
        </p>
      </Section>

      <Section title="8. Uptime and Service Levels">
        <p>
          We target a monthly uptime of 99.5% for the Nexdoc platform, excluding scheduled maintenance windows.
          Scheduled maintenance will be communicated at least 24 hours in advance via email or in-app notification.
          We are not liable for downtime caused by third-party services, force majeure events, or circumstances
          beyond our reasonable control.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, Aiclex Solutions shall not be liable for any
          indirect, incidental, consequential, or punitive damages arising out of your use of or inability
          to use the platform. Our total aggregate liability shall not exceed the amount paid by you to us
          in the three months preceding the claim.
        </p>
      </Section>

      <Section title="10. Termination">
        <p>
          Either party may terminate this agreement with 30 days written notice. We reserve the right to
          terminate or suspend your account immediately and without notice if you breach these Terms.
          Upon termination, your data will be retained for 30 days and then permanently deleted.
        </p>
      </Section>

      <Section title="11. Governing Law and Dispute Resolution">
        <p>
          This agreement is governed by the laws of India. Any disputes arising out of or in connection with
          these Terms shall first be attempted to be resolved through mutual negotiation. If unresolved within
          30 days, disputes shall be subject to the exclusive jurisdiction of the courts at Noida, Uttar Pradesh.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          For any questions regarding these Terms, please contact:<br />
          <strong>Aiclex Solutions Private Limited</strong><br />
          E58, Sector 3, Noida, UP – 201301<br />
          Email: legal@aiclex.in
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
