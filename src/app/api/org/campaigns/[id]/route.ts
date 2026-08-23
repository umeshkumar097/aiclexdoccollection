import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        org_candidates: {
          include: { _count: { select: { documents: true } } },
          orderBy: { created_at: "desc" },
        },
      },
    });
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ campaign, candidates: campaign.org_candidates });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { is_active } = await req.json();
    const campaign = await prisma.campaign.update({ where: { id }, data: { is_active } });
    return NextResponse.json({ success: true, campaign });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
