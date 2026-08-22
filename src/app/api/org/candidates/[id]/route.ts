import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const candidate = await prisma.orgCandidate.findUnique({
      where: { id },
      include: {
        documents: { orderBy: { created_at: "asc" } },
        campaign: { select: { name: true, org: { select: { brand_color: true, logo_url: true, name: true } } } },
      },
    });
    if (!candidate) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ candidate });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action, note } = await req.json();

    const status = action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "UNDER_REVIEW";
    await prisma.orgCandidate.update({
      where: { id },
      data: { status, notes: note ?? undefined },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
