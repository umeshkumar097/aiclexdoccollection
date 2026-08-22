import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPlanLimit } from "@/lib/plan-limits";
import { createHash, randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "orgId required." }, { status: 400 });

    await checkPlanLimit(orgId, "USE_API");

    const keys = await prisma.apiKey.findMany({
      where: { org_id: orgId, is_active: true },
      select: { id: true, name: true, key_prefix: true, last_used: true, created_at: true },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ keys });
  } catch (err: any) {
    if (err.name === "PlanLimitError") return NextResponse.json({ error: err.message, upgrade: true }, { status: 403 });
    return NextResponse.json({ error: "Fetch failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, name } = await req.json();
    await checkPlanLimit(orgId, "USE_API");

    // Generate key: ndx_<32 random hex chars>
    const rawKey = `ndx_${randomBytes(24).toString("hex")}`;
    const keyHash = createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.substring(0, 12);

    await prisma.apiKey.create({
      data: { org_id: orgId, name, key_hash: keyHash, key_prefix: keyPrefix },
    });

    // Return full key ONCE — never stored in plain text
    return NextResponse.json({ key: rawKey, prefix: keyPrefix });
  } catch (err: any) {
    if (err.name === "PlanLimitError") return NextResponse.json({ error: err.message, upgrade: true }, { status: 403 });
    return NextResponse.json({ error: "Key creation failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { keyId } = await req.json();
    await prisma.apiKey.update({ where: { id: keyId }, data: { is_active: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Deletion failed." }, { status: 500 });
  }
}
