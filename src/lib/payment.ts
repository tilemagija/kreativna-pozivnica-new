// Bank-transfer helpers (Faza 5). The customer pays a 50% deposit to the business account,
// referencing the order number (poziv na broj). We also build the NBS IPS QR payload so
// the customer can scan-to-pay in their mobile banking app. No card data ever touches us.

export type BankSettings = {
  bankRecipient?: string;
  bankAccount?: string;
  bankName?: string;
  bankModel?: string;
  bankPaymentCode?: string;
  bankPurpose?: string;
};

// A numeric reference used as "poziv na broj" — date + time + 2 random digits, effectively
// unique. Digits only (banks require that), ~16 chars (well within limits).
export function generateOrderNumber(d = new Date()): string {
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  const stamp =
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  return stamp + p(Math.floor(Math.random() * 100));
}

const digitsOnly = (s: string | undefined) => (s || "").replace(/\D/g, "");

// NBS IPS QR payload. Amount uses a comma decimal and no thousands separators (RSD3750,00).
export function buildIpsQrString(opts: {
  account?: string;
  recipient?: string;
  amount: number;
  model?: string;
  reference: string;
  paymentCode?: string;
  purpose?: string;
}): string {
  const account = digitsOnly(opts.account);
  const recipient = (opts.recipient || "").slice(0, 70);
  const amount = `RSD${Math.round(opts.amount)},00`;
  const model = (opts.model || "00").replace(/\D/g, "").slice(0, 2) || "00";
  const ref = digitsOnly(opts.reference);
  const code = (opts.paymentCode || "289").replace(/\D/g, "").slice(0, 3) || "289";
  const purpose = (opts.purpose || "Depozit").slice(0, 35);

  const parts = [
    "K:PR",
    "V:01",
    "C:1",
    `R:${account}`,
    `N:${recipient}`,
    `I:${amount}`,
    `SF:${code}`,
    `S:${purpose}`,
    `RO:${model}${ref}`,
  ];
  return parts.join("|");
}
