import "server-only";

// Push a compact order record to the owner's Google Sheet via a Google Apps Script
// Web App webhook (no SDK / npm dependency — just an HTTP POST, like the email lib).
// Skips silently when unconfigured, and never throws past the caller's try/catch: the
// order is already saved to Sanity + emailed, so a missing or failing Sheet webhook
// must NEVER break checkout. All values are already server-computed/sanitized by
// /api/order. A shared secret is sent so a stranger who finds the URL can't spam the
// sheet; the Apps Script rejects posts whose secret doesn't match.
export type SheetOrder = {
  createdAt: string;
  orderNumber: string;
  templateName: string;
  quantity: number;
  doubleSided: boolean;
  paperName: string;
  wrapper: string;
  envelopeName: string;
  sealSummary: string;
  tornEdges: boolean;
  goldEdges: boolean;
  roundedCorners: boolean;
  total: number;
  deposit: number;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    eventDate: string;
  };
};

export async function appendOrderToSheet(order: SheetOrder): Promise<void> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return; // not configured yet — skip

  // Guard against a hanging webhook stalling the order response.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEET_SECRET || "",
        order,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Sheet webhook ${res.status}: ${await res.text()}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
