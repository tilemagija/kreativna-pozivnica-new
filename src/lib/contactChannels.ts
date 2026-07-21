// Builds direct-message links (WhatsApp / Viber) from owner-entered phone numbers.
// Numbers are stored in international format without "+" (e.g. 3816XXXXXXXX). We strip
// any stray spaces/dashes/plus the owner might type, and return null when empty so the
// UI can simply skip a channel that isn't configured.

function digits(raw?: string): string | null {
  if (!raw) return null;
  const d = raw.replace(/[^\d]/g, "");
  return d.length >= 6 ? d : null; // guard against a half-typed number
}

export function whatsappUrl(raw?: string): string | null {
  const d = digits(raw);
  return d ? `https://wa.me/${d}` : null;
}

export function viberUrl(raw?: string): string | null {
  const d = digits(raw);
  // %2B = "+" — Viber expects the number in international form with a leading plus.
  return d ? `viber://chat?number=%2B${d}` : null;
}
