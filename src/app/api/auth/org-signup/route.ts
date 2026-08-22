import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email/sender";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 2;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${base}-${i}`;
    i++;
  }
  return slug;
}

export async function POST(req: NextRequest) {
  try {
    const { companyName, ownerName, email, password } = await req.json();

    if (!companyName || !ownerName || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.orgUser.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const slug = await uniqueSlug(generateSlug(companyName));
    const hashedPassword = await bcrypt.hash(password, 12);
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    // Seed plan configs if not already seeded
    const planCount = await prisma.planConfig.count();
    if (planCount === 0) {
      await prisma.planConfig.createMany({
        data: [
          { plan: "TRIAL",        max_users: 2,       max_candidates_per_month: 50,     max_storage_gb: 1,   max_campaigns: 1,       whatsapp_button: false, custom_branding: false, ai_validation: false, audit_logs_enabled: false, api_access: false, custom_smtp: false, two_fa: false, price_monthly: 0 },
          { plan: "STARTER",      max_users: 2,       max_candidates_per_month: 100,    max_storage_gb: 5,   max_campaigns: 3,       whatsapp_button: false, custom_branding: false, ai_validation: false, audit_logs_enabled: false, api_access: false, custom_smtp: false, two_fa: false, price_monthly: 499900 },
          { plan: "PROFESSIONAL", max_users: 10,      max_candidates_per_month: 500,    max_storage_gb: 25,  max_campaigns: 999999,  whatsapp_button: true,  custom_branding: true,  ai_validation: true,  audit_logs_enabled: true,  api_access: false, custom_smtp: false, two_fa: true,  price_monthly: 799900 },
          { plan: "ENTERPRISE",   max_users: 999999,  max_candidates_per_month: 999999, max_storage_gb: 9999, max_campaigns: 999999, whatsapp_button: true,  custom_branding: true,  ai_validation: true,  audit_logs_enabled: true,  api_access: true,  custom_smtp: true,  two_fa: true,  price_monthly: 1499900 },
        ],
        skipDuplicates: true,
      });
    }

    const org = await prisma.organization.create({
      data: {
        name: companyName,
        slug,
        owner_email: email,
        owner_name: ownerName,
        trial_ends_at: trialEnd,
        plan: "TRIAL",
        subscription_status: "TRIAL",
        users: {
          create: {
            email,
            name: ownerName,
            password: hashedPassword,
            role: "ORG_ADMIN",
          },
        },
      },
    });

    // Send welcome email (non-blocking)
    sendEmail({
      to: email,
      subject: "Welcome to Nexdoc — Your 14-Day Trial Has Started",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#0f172a">Welcome, ${ownerName}</h2>
          <p>Your organization <strong>${companyName}</strong> has been registered on Nexdoc.</p>
          <p>Your 14-day free trial is now active. No payment required during the trial period.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://nexdoc.in"}/login"
               style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
              Sign In to Your Dashboard
            </a>
          </p>
          <p style="color:#64748b;font-size:13px;margin-top:24px">
            Nexdoc by Aiclex Solutions Private Limited<br>
            E58, Sector 3, Noida, UP – 201301
          </p>
        </div>
      `,
    }).catch(() => {});

    return NextResponse.json({ success: true, slug, orgId: org.id });
  } catch (err: any) {
    console.error("Org signup error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
