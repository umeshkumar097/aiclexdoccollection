import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPlanLimit } from "@/lib/plan-limits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, provider, smtp_host, smtp_port, smtp_user, smtp_pass, from_email, resend_api_key } = body;

    if (!orgId) return NextResponse.json({ error: "orgId required." }, { status: 400 });

    if (provider !== "AICLEX") {
      await checkPlanLimit(orgId, "USE_CUSTOM_SMTP");
    }

    await prisma.organization.update({
      where: { id: orgId },
      data: {
        email_provider: provider,
        smtp_host: smtp_host ?? null,
        smtp_port: smtp_port ?? null,
        smtp_user: smtp_user ?? null,
        smtp_pass: smtp_pass ?? null,
        from_email: from_email ?? null,
        resend_api_key: resend_api_key ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.name === "PlanLimitError") return NextResponse.json({ error: err.message, upgrade: true }, { status: 403 });
    return NextResponse.json({ error: "Settings update failed." }, { status: 500 });
  }
}
