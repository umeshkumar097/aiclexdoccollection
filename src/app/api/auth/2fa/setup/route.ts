import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTOTPSecret } from "@/lib/totp";
import { checkPlanLimit } from "@/lib/plan-limits";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await req.json();
    await checkPlanLimit(orgId, "USE_TWO_FA");

    const user = await prisma.orgUser.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const { secret, uri } = generateTOTPSecret(user.email);
    const qrDataUrl = await QRCode.toDataURL(uri);

    // Store secret temporarily (not active until first verify)
    await prisma.orgUser.update({
      where: { id: userId },
      data: { totp_secret: `PENDING:${secret}` },
    });

    return NextResponse.json({ secret, qrDataUrl });
  } catch (err: any) {
    if (err.name === "PlanLimitError") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Setup failed." }, { status: 500 });
  }
}
