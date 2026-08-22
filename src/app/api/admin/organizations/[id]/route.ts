import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const ADMIN_SECRET = new TextEncoder().encode(
  (process.env.AUTH_SECRET ?? "fallback") + "_superadmin"
);

async function verifySuperAdmin(req: NextRequest) {
  const token = req.cookies.get("sa_token")?.value;
  if (!token) throw new Error("Unauthorized");
  await jwtVerify(token, ADMIN_SECRET);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifySuperAdmin(req);
    const { id } = await params;
    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, campaigns: true, org_candidates: true, audit_logs: true } },
      },
    });
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ org });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifySuperAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const { action, plan } = body;

    if (action === "change_plan" && plan) {
      await prisma.organization.update({ where: { id }, data: { plan } });
      return NextResponse.json({ success: true });
    }
    if (action === "suspend") {
      await prisma.organization.update({ where: { id }, data: { is_suspended: true } });
      return NextResponse.json({ success: true });
    }
    if (action === "unsuspend") {
      await prisma.organization.update({ where: { id }, data: { is_suspended: false } });
      return NextResponse.json({ success: true });
    }
    if (action === "extend_trial") {
      const org = await prisma.organization.findUnique({ where: { id } });
      if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const newDate = new Date(org.trial_ends_at);
      newDate.setDate(newDate.getDate() + 7);
      await prisma.organization.update({ where: { id }, data: { trial_ends_at: newDate } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
