/**
 * POST /api/apply
 * Public API — Candidate registers for a campaign.
 * Creates an OrgCandidate record and returns a unique upload token.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { campaignSlug, name, email, phone } = await req.json();

    if (!campaignSlug || !name?.trim()) {
      return NextResponse.json({ error: "Name and campaign are required." }, { status: 400 });
    }

    const campaign = await prisma.campaign.findFirst({
      where: { slug: campaignSlug, is_active: true },
      include: { org: { select: { id: true, name: true, logo_url: true, brand_color: true } } },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found or is no longer active." }, { status: 404 });
    }

    // Check if deadline passed
    if (campaign.deadline && new Date(campaign.deadline) < new Date()) {
      return NextResponse.json({ error: "This campaign deadline has passed." }, { status: 410 });
    }

    // Generate unique submission token
    const token = randomBytes(32).toString("hex");

    const candidate = await prisma.orgCandidate.create({
      data: {
        org_id: campaign.org.id,
        campaign_id: campaign.id,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        token,
        status: "PENDING",
      },
    });

    return NextResponse.json({ token, candidateId: candidate.id });
  } catch (err) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }
}
