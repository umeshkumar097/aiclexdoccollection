export const metadata = { title: "Privacy Policy | Nexdoc by Aiclex Solutions" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate max-w-none">
      <p className="text-sm text-slate-500 mb-2">Last updated: August 22, 2025</p>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 mb-10">
        Aiclex Solutions Private Limited is committed to protecting the privacy of its customers
        and their end users. This Privacy Policy explains how we collect, use, store, and disclose
        information in connection with the Nexdoc platform.
      </p>

      <Section title="1. Who We Are">
        <p>
          The data controller for the Nexdoc platform is <strong>Aiclex Solutions Private Limited</strong>,
          incorporated under the Companies Act, 2013 (CIN: U62099UW2026PTC254970), with its registered
          office at E58, Sector 3, Noida, UP – 201301.
        </p>
        <p>
          In relation to personal data uploaded by your candidates, your organization acts as the
          data principal/data fiduciary, and we act as the data processor on your behalf.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p><strong>Account and Billing Information (from Customers/Organizations):</strong></p>
        <ul>
          <li>Company name, contact name, and email address</li>
          <li>Billing address and GSTIN (for GST invoicing)</li>
          <li>Payment method details (processed and stored by Cashfree; we do not store card numbers)</li>
        </ul>
        <p><strong>End User / Candidate Data (uploaded by your organization):</strong></p>
        <ul>
          <li>Name, email address, phone number</li>
          <li>Identity documents such as Aadhaar card, PAN card, passport, driving license</li>
          <li>Educational documents such as marksheets and degree certificates</li>
          <li>Photographs and signatures</li>
        </ul>
        <p><strong>Usage and Technical Data:</strong></p>
        <ul>
          <li>IP addresses, browser type, and device information</li>
          <li>Pages visited, actions performed, and timestamps (for audit logs)</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul>
          <li>To provide, operate, and maintain the Nexdoc platform</li>
          <li>To process subscription payments and generate GST-compliant invoices</li>
          <li>To send transactional emails such as account confirmations and billing receipts</li>
          <li>To enforce our Terms of Service and prevent fraud or misuse</li>
          <li>To analyze aggregated, anonymized usage data to improve the platform</li>
          <li>To comply with legal obligations under Indian law</li>
        </ul>
      </Section>

      <Section title="4. Data Storage and Security">
        <p>
          All data is stored on servers located in data centers compliant with ISO 27001 standards.
          Candidate documents are stored in encrypted object storage (Cloudflare R2 or compatible).
          Database records are protected through access controls and encrypted connections (TLS/SSL).
        </p>
        <p>
          We implement industry-standard security measures including role-based access control,
          audit logging, and session management. However, no system can guarantee absolute security,
          and we encourage customers to use strong passwords and enable two-factor authentication.
        </p>
      </Section>

      <Section title="5. Data Sharing and Third Parties">
        <p>We do not sell your data or your candidates data to any third party. We share data only with:</p>
        <ul>
          <li><strong>Cashfree Payments:</strong> For processing subscription payments</li>
          <li><strong>Cloudflare:</strong> For secure document storage and CDN</li>
          <li><strong>Email providers (Resend / configured SMTP):</strong> For sending notifications</li>
          <li><strong>Legal authorities:</strong> When required by applicable Indian law or court order</li>
        </ul>
      </Section>

      <Section title="6. Data Retention">
        <p>
          Customer account data is retained for the duration of the subscription and for 30 days
          following termination, after which it is permanently deleted.
          Candidate data is retained as per your organization&apos;s configuration or until you delete it.
          Audit logs are retained for 12 months.
          Billing records are retained for 7 years as required under Indian accounting law.
        </p>
      </Section>

      <Section title="7. Compliance with DPDPA 2023">
        <p>
          We are committed to compliance with the Digital Personal Data Protection Act, 2023 (DPDPA).
          Your organization, as the data fiduciary, is responsible for obtaining valid consent from
          candidates before collecting their personal data through Nexdoc. We provide contractual
          safeguards as the data processor through our Data Processing Agreement (DPA).
        </p>
      </Section>

      <Section title="8. Aadhaar Data Handling">
        <p>
          Nexdoc does not perform any Aadhaar authentication or verification through UIDAI&apos;s authentication API.
          Aadhaar documents are accepted purely as user-uploaded files for organizational record-keeping.
          Your organization is responsible for complying with the Aadhaar (Targeted Delivery) Act, 2016
          and UIDAI regulations regarding storage and use of Aadhaar information.
        </p>
      </Section>

      <Section title="9. Your Rights">
        <p>
          As a customer, you may request access to, correction of, or deletion of your account data
          by contacting us at privacy@aiclex.in. Requests will be processed within 30 days.
          Deletion of an account will result in permanent removal of all associated data after
          the 30-day retention window.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We reserve the right to update this Privacy Policy at any time. Material changes will be
          communicated via email to the registered account email address at least 15 days before
          the changes take effect.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          For privacy-related queries or to exercise your data rights:<br />
          <strong>Privacy Officer, Aiclex Solutions Private Limited</strong><br />
          E58, Sector 3, Noida, UP – 201301<br />
          Email: privacy@aiclex.in
        </p>
      </Section>
    </article>
  );
}
