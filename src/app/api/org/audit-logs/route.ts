import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPlanLimit } from "@/lib/plan-limits";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    const page  = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = 50;

    if (!orgId) return NextResponse.json({ error: "orgId required." }, { status: 400 });

    await checkPlanLimit(orgId, "USE_AUDIT_LOGS");

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { org_id: orgId },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where: { org_id: orgId } }),
    ]);

    return NextResponse.json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    if (err.name === "PlanLimitError") {
      return NextResponse.json({ error: err.message, upgrade: true }, { status: 403 });
    }
    return NextResponse.json({ error: "Fetch failed." }, { status: 500 });
  }
}
