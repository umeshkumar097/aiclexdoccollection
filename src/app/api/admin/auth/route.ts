import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const ADMIN_SECRET = new TextEncoder().encode(
  (process.env.AUTH_SECRET ?? "fallback") + "_superadmin"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const admin = await prisma.superAdmin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await new SignJWT({ id: admin.id, email: admin.email, role: "superadmin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(ADMIN_SECRET);

    const res = NextResponse.json({ success: true });
    res.cookies.set("sa_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/admin",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
