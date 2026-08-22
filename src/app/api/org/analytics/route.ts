import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

    const [totalCandidates, campaigns, statusCounts, recentCandidates] = await Promise.all([
      prisma.orgCandidate.count({ where: { org_id: orgId } }),
      prisma.campaign.findMany({
        where: { org_id: orgId },
        include: { _count: { select: { org_candidates: true } } },
        orderBy: { created_at: "desc" },
        take: 5,
      }),
      prisma.orgCandidate.groupBy({
        by: ["status"],
        where: { org_id: orgId },
        _count: true,
      }),
      prisma.orgCandidate.findMany({
        where: { org_id: orgId },
        orderBy: { created_at: "desc" },
        take: 10,
        include: { campaign: { select: { name: true } } },
      }),
    ]);

    // Build last 7 days trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const trend = await prisma.orgCandidate.findMany({
      where: { org_id: orgId, created_at: { gte: sevenDaysAgo } },
      select: { created_at: true },
    });

    const trendMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trendMap[d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })] = 0;
    }
    for (const c of trend) {
      const key = new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      if (key in trendMap) trendMap[key]++;
    }

    const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

    const statusMap: Record<string, number> = {
      PENDING: 0, DOCS_COMPLETE: 0, UNDER_REVIEW: 0, APPROVED: 0, REJECTED: 0,
    };
    for (const s of statusCounts) statusMap[s.status] = s._count;

    return NextResponse.json({
      totalCandidates,
      statusMap,
      campaigns: campaigns.map((c) => ({
        id: c.id, name: c.name, slug: c.slug,
        count: c._count.org_candidates, is_active: c.is_active,
      })),
      recentActivity: recentCandidates.map((c) => ({
        id: c.id, name: c.name, status: c.status,
        campaign: c.campaign.name, created_at: c.created_at,
      })),
      trendData,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analytics fetch failed" }, { status: 500 });
  }
}
