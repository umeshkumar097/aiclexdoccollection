import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCashfreeWebhookSignature, CASHFREE_PLAN_MAP } from "@/lib/cashfree";
import { sendEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature") ?? "";
    const timestamp  = req.headers.get("x-webhook-timestamp") ?? "";

    // Verify signature
    if (!verifyCashfreeWebhookSignature(rawBody, signature, timestamp)) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const type  = event?.type;
    const data  = event?.data;
    const subscriptionId: string = data?.subscription?.subscription_id ?? "";

    const org = await prisma.organization.findFirst({
      where: { cashfree_sub_id: subscriptionId },
    });
    if (!org) return NextResponse.json({ received: true }); // Unknown org, ignore

    if (type === "SUBSCRIPTION_STATUS_CHANGE" || type === "SUBSCRIPTION_AUTHORIZED") {
      const cfStatus = data?.subscription?.subscription_status;
      const cfPlanId = data?.subscription?.plan_details?.plan_id ?? "";
      const plan = CASHFREE_PLAN_MAP[cfPlanId] ?? org.plan;

      if (cfStatus === "ACTIVE") {
        const cycleEnd = new Date();
        cycleEnd.setDate(cycleEnd.getDate() + 30);
        await prisma.organization.update({
          where: { id: org.id },
          data: {
            plan: plan as any,
            subscription_status: "ACTIVE",
            billing_cycle_end: cycleEnd,
          },
        });
        // Welcome / renewal email
        sendEmail({
          to: org.owner_email,
          subject: `Your Nexdoc ${plan} subscription is active`,
          html: `<p>Hi ${org.owner_name},</p>
                 <p>Your <strong>Nexdoc ${plan} plan</strong> is now active. Next billing date: ${cycleEnd.toLocaleDateString("en-IN")}.</p>
                 <p style="color:#64748b;font-size:12px">Aiclex Solutions Private Limited | billing@aiclex.in</p>`,
        }).catch(() => {});
      }
    }

    if (type === "SUBSCRIPTION_PAYMENT_FAILED") {
      // Check if already in GRACE
      if (org.subscription_status === "ACTIVE") {
        const graceEnd = new Date();
        graceEnd.setDate(graceEnd.getDate() + 3);
        await prisma.organization.update({
          where: { id: org.id },
          data: { subscription_status: "GRACE" },
        });
        sendEmail({
          to: org.owner_email,
          subject: "Action Required: Your Nexdoc payment failed",
          html: `<p>Hi ${org.owner_name},</p>
                 <p>Your recent subscription payment for <strong>Nexdoc ${org.plan}</strong> failed.</p>
                 <p>Your account will remain accessible for <strong>3 more days</strong>. Please update your payment method to avoid interruption.</p>
                 <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing">Update Payment</a>
                 <p style="color:#64748b;font-size:12px">Aiclex Solutions Pvt. Ltd. | billing@aiclex.in</p>`,
        }).catch(() => {});
      } else if (org.subscription_status === "GRACE") {
        // Grace period expired — lock account
        await prisma.organization.update({
          where: { id: org.id },
          data: { subscription_status: "EXPIRED" },
        });
      }
    }

    if (type === "SUBSCRIPTION_CANCELLED") {
      await prisma.organization.update({
        where: { id: org.id },
        data: { subscription_status: "CANCELLED" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
