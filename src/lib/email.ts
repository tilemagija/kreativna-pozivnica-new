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

// Owner notification for a new physical-invitation order (konfigurator §7/§9). All values
// are already server-computed/sanitized by /api/order; we HTML-escape before embedding.
export type OrderEmail = {
  templateName: string;
  textValues: { key: string; value: string }[];
  config: string; // pre-formatted plain-text summary of paper/wrapper/seal/addons/qty
  total: number;
  deposit: number;
  customer: { name: string; phone: string; email: string; address: string; eventDate: string };
};

export async function sendOrderEmail(data: OrderEmail, to: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return; // not configured yet — skip (order is already saved)

  const rows = data.textValues
    .map((t) => `<tr><td><b>${esc(t.key)}</b></td><td>${esc(t.value)}</td></tr>`)
    .join("");

  const html = `
    <h2>Нова наруџбина (позивнице)</h2>
    <p><b>Шаблон:</b> ${esc(data.templateName)}</p>
    <p><b>Текст:</b></p>
    <table border="1" cellpadding="6" cellspacing="0">${rows}</table>
    <p><b>Конфигурација:</b><br>${esc(data.config).replace(/\n/g, "<br>")}</p>
    <p><b>Укупно:</b> ${data.total} дин · <b>Депозит (50%):</b> ${data.deposit} дин · остатак поузећем</p>
    <hr>
    <p><b>Купац:</b> ${esc(data.customer.name)}</p>
    <p><b>Телефон:</b> ${esc(data.customer.phone)}</p>
    <p><b>Мејл:</b> ${esc(data.customer.email)}</p>
    <p><b>Адреса:</b> ${esc(data.customer.address)}</p>
    ${data.customer.eventDate ? `<p><b>Датум догађаја:</b> ${esc(data.customer.eventDate)}</p>` : ""}
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: data.customer.email.includes("@") ? data.customer.email : undefined,
      subject: `Нова наруџбина — ${data.customer.name}`,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}
