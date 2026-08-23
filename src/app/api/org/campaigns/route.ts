import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPlanLimit } from "@/lib/plan-limits";

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
}

async function uniqueSlug(base: string, orgId: string): Promise<string> {
  let slug = base;
  let i = 2;
  while (await prisma.campaign.findFirst({ where: { slug, org_id: orgId } })) {
    slug = `${base}-${i}`;
    i++;
  }
  return slug;
}

// GET — list all campaigns for org
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

    const campaigns = await prisma.campaign.findMany({
      where: { org_id: orgId },
      include: { _count: { select: { org_candidates: true } } },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// POST — create new campaign
export async function POST(req: NextRequest) {
  try {
    const { orgId, name, description, requiredDocs, deadline } = await req.json();

    if (!orgId || !name || !requiredDocs?.length) {
      return NextResponse.json({ error: "Name and at least one required document are needed." }, { status: 400 });
    }

    await checkPlanLimit(orgId, "ADD_CAMPAIGN");

    const slug = await uniqueSlug(generateSlug(name), orgId);

    const campaign = await prisma.campaign.create({
      data: {
        org_id: orgId,
        name: name.trim(),
        description: description?.trim() || null,
        slug,
        required_docs: requiredDocs,
        deadline: deadline ? new Date(deadline) : null,
        is_active: true,
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (err: any) {
    if (err.name === "PlanLimitError") {
      return NextResponse.json({ error: err.message, upgrade: true }, { status: 403 });
    }
    console.error(err);
    return NextResponse.json({ error: "Campaign creation failed." }, { status: 500 });
  }
}
