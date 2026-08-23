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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Org Brand Header */}
      <div
        className="py-6 px-6 text-white text-center"
        style={{ backgroundColor: campaign.org.brand_color ?? "#1e40af" }}
      >
        {campaign.org.logo_url ? (
          <img src={campaign.org.logo_url} alt={campaign.org.name} className="h-10 mx-auto mb-2 object-contain" />
        ) : (
          <p className="text-xl font-black tracking-tight">{campaign.org.name}</p>
        )}
        <p className="text-sm opacity-80 mt-1">Document Collection Portal</p>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Campaign Info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-2">{campaign.name}</h1>
          {campaign.description && (
            <p className="text-slate-500 text-sm leading-relaxed">{campaign.description}</p>
          )}
          {campaign.deadline && (
            <p className={`text-xs font-semibold mt-2 ${deadlinePassed ? "text-red-600" : "text-amber-600"}`}>
              {deadlinePassed ? "Deadline passed" : `Deadline: ${new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          )}
        </div>

        {deadlinePassed ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="font-bold text-red-800 mb-1">Submissions Closed</p>
            <p className="text-sm text-red-600">The deadline for this campaign has passed. Please contact the organization directly.</p>
          </div>
        ) : (
          <ApplyForm
            campaignSlug={slug}
            requiredDocs={campaign.required_docs as string[]}
            brandColor={campaign.org.brand_color ?? "#1e40af"}
          />
        )}

        {/* Required Docs Preview */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5">
          <p className="font-bold text-slate-800 text-sm mb-3">
            Documents Required ({(campaign.required_docs as string[]).length})
          </p>
          <div className="space-y-2">
            {(campaign.required_docs as string[]).map((doc, i) => (
              <div key={doc} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                {doc}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Powered by Nexdoc &mdash; a product of Aiclex Solutions Pvt. Ltd.
        </p>
      </div>
    </div>
  );
}
