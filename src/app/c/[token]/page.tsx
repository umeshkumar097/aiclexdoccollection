import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CandidatePublicForm from "./CandidatePublicForm";

export default async function CandidateFormPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const candidate = await prisma.orgCandidate.findUnique({
    where: { token },
    include: {
      documents: true,
      campaign: {
        include: {
          org: {
            select: { name: true, logo_url: true, brand_color: true },
          },
        },
      },
    },
  });

  if (!candidate) notFound();

  const requiredDocs: string[] = Array.isArray(candidate.campaign.required_docs)
    ? (candidate.campaign.required_docs as string[])
    : [];

  return (
    <CandidatePublicForm
      candidate={{
        id: candidate.id,
        name: candidate.name,
        token: candidate.token,
        status: candidate.status,
        uploadedDocs: candidate.documents.map((d) => d.doc_type),
      }}
      campaign={{
        name: candidate.campaign.name,
        description: candidate.campaign.description,
        requiredDocs,
        org: candidate.campaign.org,
      }}
    />
  );
}
