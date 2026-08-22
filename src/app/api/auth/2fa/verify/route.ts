import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTOTP } from "@/lib/totp";

export async function POST(req: NextRequest) {
  try {
    const { userId, token } = await req.json();

    const user = await prisma.orgUser.findUnique({ where: { id: userId } });
    if (!user || !user.totp_secret) {
      return NextResponse.json({ error: "2FA not set up." }, { status: 400 });
    }

    const secret = user.totp_secret.startsWith("PENDING:")
      ? user.totp_secret.replace("PENDING:", "")
      : user.totp_secret;

    const valid = verifyTOTP(secret, token);
    if (!valid) return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });

    // If was pending, activate 2FA
    if (user.totp_secret.startsWith("PENDING:")) {
      await prisma.orgUser.update({
        where: { id: userId },
        data: { totp_secret: secret },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
