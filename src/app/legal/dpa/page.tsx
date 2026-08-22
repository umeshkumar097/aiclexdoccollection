export const metadata = { title: "Data Processing Agreement | Nexdoc" };
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
export default function DpaPage() {
  return (
    <article className="prose prose-slate max-w-none">
      <p className="text-sm text-slate-500 mb-2">Last updated: August 22, 2025</p>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Data Processing Agreement</h1>
      <p className="text-slate-500 mb-4">
        This Data Processing Agreement (&quot;DPA&quot;) is incorporated into and forms part of the Terms of Service
        between Aiclex Solutions Private Limited (&quot;Processor&quot;) and the subscribing organization (&quot;Controller&quot;).
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 mb-10 text-sm text-blue-800">
        This DPA is designed to assist enterprise customers in meeting their obligations under the
        Digital Personal Data Protection Act, 2023 (DPDPA) and is effective for all active subscriptions.
      </div>

      <Section title="1. Definitions">
        <ul>
          <li><strong>Personal Data:</strong> Any data relating to a natural person that identifies or can identify that person, as defined under the DPDPA 2023.</li>
          <li><strong>Controller (Data Fiduciary):</strong> The subscribing organization that determines the purpose and means of processing personal data through Nexdoc.</li>
          <li><strong>Processor (Data Processor):</strong> Aiclex Solutions Private Limited, which processes personal data on behalf of the Controller.</li>
          <li><strong>Sub-processor:</strong> Any third party engaged by the Processor to process personal data.</li>
        </ul>
      </Section>

      <Section title="2. Scope and Purpose of Processing">
        <p>
          The Processor shall process personal data uploaded to the Nexdoc platform solely for the purpose of
          providing document collection, storage, verification workflow management, and related SaaS services
          as described in the Terms of Service, and only on documented instructions from the Controller.
        </p>
      </Section>

      <Section title="3. Controller Obligations">
        <p>The Controller represents and warrants that:</p>
        <ul>
          <li>It has obtained valid and informed consent from all individuals whose personal data is uploaded to Nexdoc.</li>
          <li>It has a lawful basis for processing under the DPDPA 2023.</li>
          <li>It will comply with all applicable data protection laws and regulations.</li>
          <li>It will not instruct the Processor to process data in a manner that violates applicable law.</li>
        </ul>
      </Section>

      <Section title="4. Processor Obligations">
        <p>The Processor agrees to:</p>
        <ul>
          <li>Process personal data only on documented instructions from the Controller.</li>
          <li>Ensure all personnel with access to personal data are bound by confidentiality obligations.</li>
          <li>Implement appropriate technical and organizational security measures including encryption at rest and in transit, role-based access control, and audit logging.</li>
          <li>Notify the Controller without undue delay (and no later than 72 hours) upon becoming aware of a personal data breach affecting the Controller&apos;s data.</li>
          <li>Not transfer personal data outside India without the Controller&apos;s prior written consent and in compliance with applicable regulations.</li>
          <li>Delete or return all personal data upon termination of the agreement, at the Controller&apos;s choice.</li>
        </ul>
      </Section>

      <Section title="5. Sub-processors">
        <p>The Controller provides general authorization for the Processor to engage sub-processors. Current approved sub-processors are:</p>
        <ul>
          <li><strong>Cloudflare, Inc.</strong> — Document and file storage (Cloudflare R2)</li>
          <li><strong>Cashfree Payments India Pvt. Ltd.</strong> — Payment processing (no candidate data shared)</li>
          <li><strong>Resend, Inc.</strong> — Transactional email delivery (limited to email addresses and notification content)</li>
          <li><strong>Neon, Inc. / Vercel, Inc.</strong> — Database and application hosting infrastructure</li>
        </ul>
        <p>
          The Processor will notify the Controller at least 15 days in advance before adding any new sub-processor.
          The Controller may object in writing within this period.
        </p>
      </Section>

      <Section title="6. Data Subject Rights">
        <p>
          Where the Processor receives a request directly from a data subject (candidate) regarding their personal data,
          the Processor shall notify the Controller within 5 business days. The Controller is responsible for
          responding to data subject rights requests. The Processor will provide reasonable technical assistance
          to facilitate such responses.
        </p>
      </Section>

      <Section title="7. Audit Rights">
        <p>
          The Controller may, upon 15 days written notice, request a summary security assessment report.
          On-site audits may be agreed upon separately and at the Controller&apos;s cost.
        </p>
      </Section>

      <Section title="8. Liability">
        <p>
          Each party shall be liable for any damages caused by its failure to comply with its obligations
          under this DPA. The Processor&apos;s total liability under this DPA shall not exceed the limits
          set out in the Terms of Service.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          This DPA is governed by the laws of India. Any disputes shall be resolved in accordance with
          the dispute resolution clause in the Terms of Service.
        </p>
      </Section>

      <Section title="10. Contact for Data Protection Matters">
        <p>
          <strong>Aiclex Solutions Private Limited — Data Protection Team</strong><br />
          E58, Sector 3, Noida, UP – 201301<br />
          Corporate Office: Gaur City Mall, Greater Noida – 201318<br />
          Email: dpo@aiclex.in
        </p>
      </Section>
    </article>
  );
}
