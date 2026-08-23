import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const ADMIN_SECRET = new TextEncoder().encode(
  (process.env.AUTH_SECRET ?? "fallback") + "_superadmin"
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("sa_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await jwtVerify(token, ADMIN_SECRET);

    const [allOrgs, planConfigs] = await Promise.all([
      prisma.organization.findMany({
        where: { subscription_status: "ACTIVE" },
        select: { plan: true },
      }),
      prisma.planConfig.findMany(),
    ]);

    const priceMap: Record<string, number> = {};
    for (const p of planConfigs) priceMap[p.plan] = p.price_monthly;

    const mrr = allOrgs.reduce((sum: number, o: { plan: string }) => sum + (priceMap[o.plan] ?? 0), 0);

    const counts = await prisma.organization.groupBy({
      by: ["subscription_status"],
      _count: true,
    });

    type CountRow = { subscription_status: string; _count: number };
    const trialCount   = counts.find((c: CountRow) => c.subscription_status === "TRIAL")?._count   ?? 0;
    const activeCount  = counts.find((c: CountRow) => c.subscription_status === "ACTIVE")?._count  ?? 0;
    const expiredCount = counts.find((c: CountRow) => c.subscription_status === "EXPIRED")?._count ?? 0;

    return NextResponse.json({
      mrr,
      arr: mrr * 12,
      active: activeCount,
      trial: trialCount,
      expired: expiredCount,
      total: await prisma.organization.count(),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
