import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDocumentFromUrl } from "@/lib/ai-validate";
import { checkPlanLimit } from "@/lib/plan-limits";

export async function POST(req: NextRequest) {
  try {
    const { documentId, orgId } = await req.json();

    // Check plan allows AI validation
    await checkPlanLimit(orgId, "USE_AI_VALIDATION");

    const doc = await prisma.orgDocument.findUnique({
      where: { id: documentId },
      include: { org_candidate: { select: { name: true } } },
    });

    if (!doc) return NextResponse.json({ error: "Document not found." }, { status: 404 });

    const result = await validateDocumentFromUrl(
      doc.file_url,
      doc.doc_type,
      doc.org_candidate.name ?? undefined
    );

    return NextResponse.json({ result });
  } catch (err: any) {
    if (err.name === "PlanLimitError") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Validation failed." }, { status: 500 });
  }
}
