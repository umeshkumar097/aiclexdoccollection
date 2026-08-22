export const metadata = { title: "Refund & Cancellation Policy | Nexdoc" };
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
export default function RefundPage() {
  return (
    <article className="prose prose-slate max-w-none">
      <p className="text-sm text-slate-500 mb-2">Last updated: August 22, 2025</p>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Refund and Cancellation Policy</h1>
      <p className="text-slate-500 mb-10">
        This policy outlines the terms under which refunds and cancellations are handled for
        Nexdoc subscriptions offered by Aiclex Solutions Private Limited.
      </p>
      <Section title="1. Subscription Model">
        <p>
          Nexdoc operates on a prepaid monthly subscription model. Subscription fees are charged
          at the beginning of each billing cycle and grant access to the platform for the
          corresponding billing period.
        </p>
      </Section>
      <Section title="2. Free Trial">
        <p>
          A 14-day free trial is available to all new organizations without any payment commitment.
          No charges are applied during the trial period. The trial may be cancelled at any time
          without any obligation.
        </p>
      </Section>
      <Section title="3. Cancellation">
        <ul>
          <li>You may cancel your subscription at any time from the billing settings within your dashboard.</li>
          <li>Upon cancellation, your account will remain active until the end of the current billing period.</li>
          <li>No further charges will be made after cancellation.</li>
          <li>Access to the platform will cease at the end of the paid billing period.</li>
          <li>Your data will be retained for 30 days post-cancellation, after which it will be permanently deleted.</li>
        </ul>
      </Section>
      <Section title="4. Refund Eligibility">
        <p>Given the nature of SaaS products where platform access is granted immediately upon payment, our refund policy is as follows:</p>
        <ul>
          <li><strong>Within 7 days of first payment:</strong> A full refund will be issued if you have not actively used the platform (defined as having created campaigns or uploaded candidate data) and you request a refund in writing to billing@aiclex.in.</li>
          <li><strong>After 7 days:</strong> Subscription fees are non-refundable. This applies to both initial subscriptions and renewal charges.</li>
          <li><strong>Plan upgrades:</strong> Prorated charges for mid-cycle plan upgrades are non-refundable.</li>
          <li><strong>Annual plans (if applicable):</strong> A prorated refund for unused complete months may be issued at our discretion.</li>
        </ul>
      </Section>
      <Section title="5. Exceptional Circumstances">
        <p>
          Refunds outside the above policy may be considered in exceptional circumstances such as
          extended platform downtime caused directly by us (exceeding 99.5% monthly SLA), or
          billing errors. Such requests must be raised within 15 days of the charge date.
        </p>
      </Section>
      <Section title="6. Refund Process">
        <p>
          Approved refunds will be processed within 7 to 10 business days to the original payment method.
          Cashfree Payments processes all transactions, and bank processing timelines may vary.
          GST amounts charged on subscription fees are non-refundable as per applicable tax regulations.
        </p>
      </Section>
      <Section title="7. Contact for Billing Disputes">
        <p>
          To raise a refund request or billing dispute, please write to:<br />
          <strong>Aiclex Solutions Private Limited — Billing Team</strong><br />
          Email: billing@aiclex.in<br />
          Registered Office: E58, Sector 3, Noida, UP – 201301
        </p>
      </Section>
    </article>
  );
}
