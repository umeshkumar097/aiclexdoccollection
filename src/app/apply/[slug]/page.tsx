import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ApplyForm from "./ApplyForm";

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const campaign = await prisma.campaign.findFirst({
    where: { slug, is_active: true },
    include: {
      org: { select: { name: true, logo_url: true, brand_color: true } },
    },
  });

  if (!campaign) notFound();

  const deadlinePassed = campaign.deadline ? new Date(campaign.deadline) < new Date() : false;
  const brandColor = campaign.org.brand_color ?? "#2563eb";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Org Branded Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {campaign.org.logo_url ? (
            <img src={campaign.org.logo_url} alt={campaign.org.name} className="h-8 w-auto object-contain" />
          ) : (
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ backgroundColor: brandColor }}
            >
              {campaign.org.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-slate-900">{campaign.org.name}</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Campaign Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">{campaign.name}</h1>
          {campaign.description && (
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">{campaign.description}</p>
          )}
          {campaign.deadline && (
            <p className={`text-xs font-semibold mt-3 inline-block px-3 py-1 rounded-full ${
              deadlinePassed
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-700"
            }`}>
              {deadlinePassed
                ? "Submissions closed — deadline passed"
                : `Deadline: ${new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          )}
        </div>

        {deadlinePassed ? (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-bold text-slate-900 mb-1">Submissions Closed</p>
            <p className="text-sm text-slate-500">The deadline for this campaign has passed. Please contact {campaign.org.name} directly.</p>
          </div>
        ) : (
          <ApplyForm
            campaignSlug={slug}
            requiredDocs={campaign.required_docs as string[]}
            brandColor={brandColor}
            orgName={campaign.org.name}
          />
        )}

        <p className="mt-10 text-center text-xs text-slate-400">
          Secured by Nexdoc &mdash; Aiclex Solutions Private Limited
        </p>
      </div>
    </div>
  );
}
