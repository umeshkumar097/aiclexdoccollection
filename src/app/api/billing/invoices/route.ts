import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PLAN_PRICE: Record<string, number> = {
  STARTER: 4999, PROFESSIONAL: 7999, ENTERPRISE: 14999,
};

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "orgId required." }, { status: 400 });

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) return NextResponse.json({ error: "Not found." }, { status: 404 });

    // For now, return a synthetic invoice list based on billing cycle
    // In production this would come from Cashfree's transaction API
    const invoices = org.billing_cycle_end ? [{
      id: `INV-${org.id.substring(0, 8).toUpperCase()}`,
      date: org.billing_cycle_end,
      plan: org.plan,
      amount: PLAN_PRICE[org.plan] ?? 0,
      gst: Math.round((PLAN_PRICE[org.plan] ?? 0) * 0.18),
      status: org.subscription_status === "ACTIVE" ? "PAID" : "PENDING",
    }] : [];

    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json({ error: "Failed to fetch invoices." }, { status: 500 });
  }
}
