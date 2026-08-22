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

export async function GET(req: NextRequest) {
  try {
    await verifySuperAdmin(req);
    const orgs = await prisma.organization.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true, name: true, slug: true, plan: true,
        subscription_status: true, is_suspended: true,
        owner_email: true, owner_name: true,
        candidates_this_month: true, storage_used_gb: true,
        trial_ends_at: true, billing_cycle_end: true,
        created_at: true,
        _count: { select: { users: true, campaigns: true, org_candidates: true } },
      },
    });
    return NextResponse.json({ orgs });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
