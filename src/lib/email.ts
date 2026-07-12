import "server-only";

// Owner notification for a new inquiry, via Resend's HTTP API (no SDK dependency).
// Skips silently when unconfigured — the inquiry is already saved to Sanity, so a
// missing key must never break submission. User text is HTML-escaped before embedding.
type InquiryEmail = {
  name: string;
  contact: string;
  message: string;
  context: string;
};

const FROM =
  process.env.RESEND_FROM || "Kreativna pozivnica <onboarding@resend.dev>";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendOwnerEmail(
  data: InquiryEmail,
  to: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return; // not configured yet — skip

  const html = `
    <h2>Нови упит са сајта</h2>
    <p><b>Име:</b> ${esc(data.name)}</p>
    <p><b>Контакт:</b> ${esc(data.contact)}</p>
    <p><b>Одакле:</b> ${esc(data.context)}</p>
    <p><b>Порука:</b><br>${esc(data.message).replace(/\n/g, "<br>")}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: data.contact.includes("@") ? data.contact : undefined,
      subject: `Нови упит — ${data.name}`,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}
