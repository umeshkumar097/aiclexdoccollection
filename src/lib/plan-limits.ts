import { prisma } from "@/lib/prisma";

export type LimitAction =
  | "ADD_CANDIDATE"
  | "ADD_USER"
  | "ADD_CAMPAIGN"
  | "USE_WHATSAPP"
  | "USE_AI_VALIDATION"
  | "USE_AUDIT_LOGS"
  | "USE_API"
  | "USE_CUSTOM_SMTP"
  | "USE_TWO_FA"
  | "USE_CUSTOM_BRANDING";

export class PlanLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitError";
  }
}

export async function getOrgWithPlan(orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });
  if (!org) throw new Error("Organization not found.");
  if (org.is_suspended)
    throw new Error("Account suspended. Please contact support.");

  const limits = await prisma.planConfig.findUnique({
    where: { plan: org.plan },
  });
  if (!limits) throw new Error("Plan configuration not found.");

  return { org, limits };
}

export async function getOrgUsage(orgId: string) {
  const [users, campaigns] = await Promise.all([
    prisma.orgUser.count({ where: { org_id: orgId, is_active: true } }),
    prisma.campaign.count({ where: { org_id: orgId, is_active: true } }),
  ]);

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { candidates_this_month: true, storage_used_gb: true },
  });

  return {
    users,
    campaigns,
    candidates: org?.candidates_this_month ?? 0,
    storage: org?.storage_used_gb ?? 0,
  };
}

export async function checkPlanLimit(
  orgId: string,
  action: LimitAction
): Promise<void> {
  const { org, limits } = await getOrgWithPlan(orgId);
  const usage = await getOrgUsage(orgId);

  switch (action) {
    case "ADD_CANDIDATE":
      if (usage.candidates >= limits.max_candidates_per_month) {
        throw new PlanLimitError(
          `Monthly candidate limit of ${limits.max_candidates_per_month} reached. Please upgrade your plan.`
        );
      }
      break;
    case "ADD_USER":
      if (usage.users >= limits.max_users) {
        throw new PlanLimitError(
          `User limit of ${limits.max_users} reached. Please upgrade your plan.`
        );
      }
      break;
    case "ADD_CAMPAIGN":
      if (usage.campaigns >= limits.max_campaigns) {
        throw new PlanLimitError(
          `Campaign limit of ${limits.max_campaigns} reached. Please upgrade your plan.`
        );
      }
      break;
    case "USE_WHATSAPP":
      if (!limits.whatsapp_button) {
        throw new PlanLimitError(
          "WhatsApp messaging is available on the Professional plan and above."
        );
      }
      break;
    case "USE_AI_VALIDATION":
      if (!limits.ai_validation) {
        throw new PlanLimitError(
          "AI Document Validation is available on the Professional plan and above."
        );
      }
      break;
    case "USE_AUDIT_LOGS":
      if (!limits.audit_logs_enabled) {
        throw new PlanLimitError(
          "Audit logs are available on the Professional plan and above."
        );
      }
      break;
    case "USE_API":
      if (!limits.api_access) {
        throw new PlanLimitError(
          "API access is available on the Enterprise plan."
        );
      }
      break;
    case "USE_CUSTOM_SMTP":
      if (!limits.custom_smtp) {
        throw new PlanLimitError(
          "Custom email configuration is available on the Enterprise plan."
        );
      }
      break;
    case "USE_TWO_FA":
      if (!limits.two_fa) {
        throw new PlanLimitError(
          "Two-factor authentication is available on the Professional plan and above."
        );
      }
      break;
    case "USE_CUSTOM_BRANDING":
      if (!limits.custom_branding) {
        throw new PlanLimitError(
          "Custom branding is available on the Professional plan and above."
        );
      }
      break;
  }
}

export async function incrementCandidateCount(orgId: string) {
  await prisma.organization.update({
    where: { id: orgId },
    data: { candidates_this_month: { increment: 1 } },
  });
}

export async function createAuditLog(
  orgId: string,
  action: string,
  details?: object,
  userId?: string,
  ip?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        org_id: orgId,
        user_id: userId,
        action,
        details: details ?? {},
        ip_address: ip,
      },
    });
  } catch {
    // Audit log failure should not crash main flow
  }
}
