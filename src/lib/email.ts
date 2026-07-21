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
  digital?: boolean; // digital order: 100% upfront, PDF by email (no paper/COD)
};

export async function sendOrderEmail(data: OrderEmail, to: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return; // not configured yet — skip (order is already saved)

  const rows = data.textValues
    .map((t) => `<tr><td><b>${esc(t.key)}</b></td><td>${esc(t.value)}</td></tr>`)
    .join("");

  const amountLine = data.digital
    ? `<p><b>Износ:</b> ${data.total} дин · дигитална позивница (100%, PDF на мејл)</p>`
    : `<p><b>Укупно:</b> ${data.total} дин · <b>Депозит (50%):</b> ${data.deposit} дин · остатак поузећем</p>`;

  const html = `
    <h2>Нова наруџбина (${data.digital ? "дигитална позивница" : "позивнице"})</h2>
    <p><b>Шаблон:</b> ${esc(data.templateName)}</p>
    <p><b>Текст:</b></p>
    <table border="1" cellpadding="6" cellspacing="0">${rows}</table>
    <p><b>Конфигурација:</b><br>${esc(data.config).replace(/\n/g, "<br>")}</p>
    ${amountLine}
    <hr>
    <p><b>Купац:</b> ${esc(data.customer.name)}</p>
    ${data.customer.phone ? `<p><b>Телефон:</b> ${esc(data.customer.phone)}</p>` : ""}
    <p><b>Мејл:</b> ${esc(data.customer.email)}</p>
    ${data.customer.address ? `<p><b>Адреса:</b> ${esc(data.customer.address)}</p>` : ""}
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

// Confirmation email to the CUSTOMER after they place an order (konfigurator §5.5).
// Sends the order number + the bank details they need to pay the 50% deposit — so they
// keep a written record even after closing the success screen. Skips silently when
// unconfigured OR when the customer left no email (checkout allows phone-only). All
// values are already server-computed/sanitized by /api/order; user text is HTML-escaped.
export type CustomerOrderEmail = {
  orderNumber: string;
  templateName: string;
  total: number;
  deposit: number;
  customer: { name: string; email: string };
  ownerEmail: string; // reply-to, so a customer reply reaches the owner
  digital?: boolean; // digital order: pay 100%, PDF follows by email
  payment: {
    recipient: string;
    account: string;
    bankName: string;
    model: string;
    paymentCode: string;
    purpose: string;
  };
};

export async function sendCustomerOrderEmail(data: CustomerOrderEmail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !data.customer.email.includes("@")) return; // not configured / no email

  const p = data.payment;
  const amountDue = data.digital ? data.total : data.deposit; // digital pays 100%
  const purpose = p.purpose || (data.digital ? "Дигитална позивница" : "Депозит за позивнице");
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:2px 10px 2px 0"><b>${label}</b></td><td>${esc(value)}</td></tr>` : "";

  const amountSummary = data.digital
    ? `<p><b>Износ:</b> ${data.total} дин · дигитална позивница (плаћа се 100%)</p>`
    : `<p><b>Укупно:</b> ${data.total} дин · <b>Депозит (50%):</b> ${data.deposit} дин · остатак поузећем</p>`;

  const payLine = data.digital
    ? `<p>Да бисте потврдили наруџбину, уплатите <b>цео износ од ${amountDue} дин</b> на рачун:</p>`
    : `<p>Да бисте потврдили наруџбину, уплатите <b>депозит од ${amountDue} дин</b> на рачун:</p>`;

  const closing = data.digital
    ? `<p style="color:#6C6049">Дигиталну позивницу (PDF) шаљемо на овај мејл чим видимо уплату. За питања одговорите на овај мејл.</p>`
    : `<p style="color:#6C6049">Јавићемо вам се ускоро. За питања одговорите на овај мејл.</p>`;

  const html = `
    <h2>Хвала на наруџбини!</h2>
    <p>Поштовани/а ${esc(data.customer.name)}, примили смо вашу наруџбину.</p>
    <p><b>Број наруџбине:</b> ${esc(data.orderNumber)}<br>
       <b>Шаблон:</b> ${esc(data.templateName)}</p>
    ${amountSummary}
    <hr>
    ${payLine}
    <table cellpadding="0" cellspacing="0" style="font-size:14px">
      ${row("Прималац", p.recipient)}
      ${row("Рачун", p.account)}
      ${row("Банка", p.bankName)}
      ${row("Модел", p.model)}
      <tr><td style="padding:2px 10px 2px 0"><b>Позив на број</b></td><td>${esc(data.orderNumber)}</td></tr>
      ${row("Шифра плаћања", p.paymentCode)}
      <tr><td style="padding:2px 10px 2px 0"><b>Сврха</b></td><td>${esc(purpose)}</td></tr>
    </table>
    ${closing}
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [data.customer.email],
      reply_to: data.ownerEmail.includes("@") ? data.ownerEmail : undefined,
      subject: `Потврда наруџбине бр. ${data.orderNumber}`,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}
