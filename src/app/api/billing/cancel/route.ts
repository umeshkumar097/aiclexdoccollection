import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cancelCashfreeSubscription } from "@/lib/cashfree";

export async function POST(req: NextRequest) {
  try {
    const { orgId } = await req.json();
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (org.cashfree_sub_id) {
      await cancelCashfreeSubscription(org.cashfree_sub_id);
    }

    await prisma.organization.update({
      where: { id: orgId },
      data: { subscription_status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cancellation failed." }, { status: 500 });
  }
}
