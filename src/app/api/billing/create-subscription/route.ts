import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCashfreeSubscription } from "@/lib/cashfree";
import { getServerSession } from "next-auth";

const PLAN_TO_CF_ID: Record<string, string> = {
  STARTER:      process.env.CF_PLAN_STARTER      ?? "nexdoc_starter",
  PROFESSIONAL: process.env.CF_PLAN_PROFESSIONAL ?? "nexdoc_professional",
  ENTERPRISE:   process.env.CF_PLAN_ENTERPRISE   ?? "nexdoc_enterprise",
};

export async function POST(req: NextRequest) {
  try {
    const { orgId, plan, phone } = await req.json();
    if (!orgId || !plan || !PLAN_TO_CF_ID[plan]) {
      return NextResponse.json({ error: "Invalid plan or organization." }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    if (org.is_suspended) return NextResponse.json({ error: "Account suspended." }, { status: 403 });

    const subscriptionId = `nexdoc_${orgId}_${Date.now()}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://nexdoc.in"}/dashboard/billing?status=success`;

    const cfRes = await createCashfreeSubscription({
      subscriptionId,
      customerName: org.owner_name,
      customerEmail: org.owner_email,
      customerPhone: phone ?? "9999999999",
      planId: PLAN_TO_CF_ID[plan],
      returnUrl,
    });

    if (cfRes.subscription_status === "INITIALIZED") {
      // Store pending subscription ID
      await prisma.organization.update({
        where: { id: orgId },
        data: { cashfree_sub_id: subscriptionId },
      });
      return NextResponse.json({
        success: true,
        payment_session_id: cfRes.auth_link ?? cfRes.payment_session_id,
        subscription_id: subscriptionId,
      });
    }

    return NextResponse.json({ error: cfRes.message ?? "Cashfree error. Please try again." }, { status: 500 });
  } catch (err: any) {
    console.error("Billing error:", err);
    return NextResponse.json({ error: "Failed to create subscription." }, { status: 500 });
  }
}
