import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { client } from "@/sanity/lib/client";
import { rateLimit } from "@/lib/rateLimit";
import { sendOwnerEmail } from "@/lib/email";

export const runtime = "nodejs";

// Trim, drop control characters, cap length — keep stored data clean and bounded.
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 32 && code !== 127) out += ch;
  }
  return out.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Rate limit: max 5 submissions per minute per IP.
  if (!rateLimit(`inquiry:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: real users never fill "website". Silently accept to not tip off bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const contact = clean(body.contact, 150);
  const message = clean(body.message, 2000);
  const context = clean(body.context, 200) || "Контакт (сајт)";

  if (name.length < 2 || contact.length < 3) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("Missing SANITY_API_WRITE_TOKEN — inquiry not saved.");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    await writeClient.create({
      _type: "inquiry",
      name,
      contact,
      message,
      context,
      createdAt: new Date().toISOString(),
      handled: false,
    });
  } catch (err) {
    console.error("Failed to save inquiry:", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  // Notify the owner by email (non-blocking: the inquiry is already saved).
  try {
    const to = await client.fetch<string | null>(
      `*[_type == "siteSettings"][0].contactEmail`,
    );
    if (to) await sendOwnerEmail({ name, contact, message, context }, to);
  } catch (err) {
    console.error("Owner email failed (inquiry still saved):", err);
  }

  return NextResponse.json({ ok: true });
}
