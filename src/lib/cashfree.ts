/**
 * Cashfree Payments Integration
 * Docs: https://docs.cashfree.com/docs/subscription-api
 */

const CF_BASE = process.env.NODE_ENV === "production"
  ? "https://api.cashfree.com"
  : "https://sandbox.cashfree.com";

const CF_HEADERS = {
  "x-client-id": process.env.CASHFREE_APP_ID ?? "",
  "x-client-secret": process.env.CASHFREE_SECRET_KEY ?? "",
  "x-api-version": "2023-08-01",
  "Content-Type": "application/json",
};

export async function createCashfreeSubscription({
  subscriptionId,
  customerName,
  customerEmail,
  customerPhone,
  planId,
  returnUrl,
}: {
  subscriptionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: string;
  returnUrl: string;
}) {
  const res = await fetch(`${CF_BASE}/pg/subscriptions`, {
    method: "POST",
    headers: CF_HEADERS,
    body: JSON.stringify({
      subscription_id: subscriptionId,
      subscription_meta: { return_url: returnUrl },
      customer_details: {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      plan_details: { plan_id: planId },
      authorization_details: {
        authorization_amount: 1,
        authorization_currency: "INR",
      },
    }),
  });
  return res.json();
}

export async function cancelCashfreeSubscription(subscriptionId: string) {
  const res = await fetch(`${CF_BASE}/pg/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: CF_HEADERS,
  });
  return res.json();
}

export function verifyCashfreeWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string
): boolean {
  const crypto = require("crypto");
  const secret = process.env.CASHFREE_WEBHOOK_SECRET ?? "";
  const signedPayload = timestamp + rawBody;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("base64");
  return computed === signature;
}

// Map Cashfree plan IDs to our plan names
export const CASHFREE_PLAN_MAP: Record<string, string> = {
  [process.env.CF_PLAN_STARTER ?? "nexdoc_starter"]: "STARTER",
  [process.env.CF_PLAN_PROFESSIONAL ?? "nexdoc_professional"]: "PROFESSIONAL",
  [process.env.CF_PLAN_ENTERPRISE ?? "nexdoc_enterprise"]: "ENTERPRISE",
};
