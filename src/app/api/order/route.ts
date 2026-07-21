import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { rateLimit } from "@/lib/rateLimit";
import { sendOrderEmail, sendCustomerOrderEmail } from "@/lib/email";
import { computePrice, type SealType, type WrapperKind } from "@/lib/configuratorPricing";
import { generateOrderNumber } from "@/lib/payment";
import { appendOrderToSheet } from "@/lib/googleSheet";

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

const localeName = (v: { sr?: string; en?: string } | null | undefined): string =>
  (v && (v.sr || v.en)) || "";

const WRAPPERS: WrapperKind[] = ["bez", "paus", "koverat"];
const SEALS: SealType[] = ["none", "plain", "goldLeaf", "tatarika"];

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Rate limit: max 5 orders per minute per IP (it writes to Sanity + sends email).
  if (!rateLimit(`order:${ip}`, 5, 60_000)) {
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

  // --- Validate customer ---
  const customer = {
    name: clean((body.customer as Record<string, unknown>)?.name, 100),
    phone: clean((body.customer as Record<string, unknown>)?.phone, 40),
    email: clean((body.customer as Record<string, unknown>)?.email, 150),
    address: clean((body.customer as Record<string, unknown>)?.address, 400),
    eventDate: clean((body.customer as Record<string, unknown>)?.eventDate, 40),
  };

  // --- DIGITAL invitation: standalone flow (§15). Pays 100%, PDF by email, no paper/COD.
  // Handled here and returns early so the physical path below stays untouched. ---
  if (body.kind === "digital") {
    return handleDigitalOrder(body, customer);
  }

  if (customer.name.length < 2 || (customer.phone.length < 5 && !customer.email.includes("@"))) {
    return NextResponse.json({ error: "invalid_customer" }, { status: 400 });
  }
  if (customer.address.length < 4) {
    return NextResponse.json({ error: "invalid_address" }, { status: 400 });
  }

  // --- Normalize selection (never trust the browser's numbers/prices) ---
  const quantity = Math.max(1, Math.min(100000, Math.floor(Number(body.quantity) || 0)));
  const wrapper: WrapperKind = WRAPPERS.includes(body.wrapper as WrapperKind)
    ? (body.wrapper as WrapperKind)
    : "bez";
  const sealType: SealType = SEALS.includes(body.sealType as SealType)
    ? (body.sealType as SealType)
    : "none";
  const tornEdges = body.tornEdges === true;
  const goldEdges = body.goldEdges === true;
  const roundedCorners = body.roundedCorners === true;

  const paperId = clean(body.paperId, 200);
  const envelopeId = wrapper === "koverat" ? clean(body.envelopeId, 200) : "";
  const sealMotifId = sealType !== "none" ? clean(body.sealMotifId, 200) : "";
  const sealColorId = sealType !== "none" ? clean(body.sealColorId, 200) : "";
  const templateId = clean(body.templateId, 200);

  const textValuesRaw = Array.isArray(body.textValues) ? body.textValues : [];
  const textValues = textValuesRaw
    .slice(0, 30)
    .map((t) => ({
      _key: clean((t as Record<string, unknown>)?.key, 60) || Math.random().toString(36).slice(2),
      key: clean((t as Record<string, unknown>)?.key, 60),
      value: clean((t as Record<string, unknown>)?.value, 500),
    }))
    .filter((t) => t.key);

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("Missing SANITY_API_WRITE_TOKEN — order not saved.");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // --- Fetch prices + names from Sanity and RECOMPUTE the total on the server (§7) ---
  let data: {
    pricing: Record<string, number> | null;
    paper: { name?: { sr?: string }; pricePerPiece?: number } | null;
    envelope: { name?: { sr?: string }; pricePerPiece?: number } | null;
    sealMotif: { name?: { sr?: string } } | null;
    sealColor: { name?: { sr?: string } } | null;
    template: { name?: { sr?: string }; doubleSided?: boolean } | null;
    settings: {
      contactEmail?: string;
      bankRecipient?: string;
      bankAccount?: string;
      bankName?: string;
      bankModel?: string;
      bankPaymentCode?: string;
      bankPurpose?: string;
    } | null;
  };
  try {
    data = await writeClient.fetch(
      `{
        "pricing": *[_type=="pricing"][0]{ minQuantity, setupFee, pausOmotPrice, addonDoubleSided, addonTornEdges, addonGoldEdges, addonRoundedEdges, sealBase, sealGoldLeaf, sealTatarika },
        "paper": *[_id==$paperId][0]{ name, pricePerPiece },
        "envelope": *[_id==$envelopeId][0]{ name, pricePerPiece },
        "sealMotif": *[_id==$sealMotifId][0]{ name },
        "sealColor": *[_id==$sealColorId][0]{ name },
        "template": *[_id==$templateId][0]{ name, doubleSided },
        "settings": *[_type=="siteSettings"][0]{ contactEmail, bankRecipient, bankAccount, bankName, bankModel, bankPaymentCode, bankPurpose }
      }`,
      { paperId, envelopeId, sealMotifId, sealColorId, templateId },
    );
  } catch (err) {
    console.error("Order price lookup failed:", err);
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }

  const paperPrice = Number(data.paper?.pricePerPiece) || 0;
  const envelopePrice = Number(data.envelope?.pricePerPiece) || 0;
  const doubleSided = data.template?.doubleSided === true; // from the design, not the browser
  const breakdown = computePrice(
    { quantity, paperPrice, wrapper, envelopePrice, doubleSided, tornEdges, goldEdges, roundedCorners, sealType },
    data.pricing ?? {},
  );

  const sealAddon = sealType === "goldLeaf" ? "goldLeaf" : sealType === "tatarika" ? "tatarika" : "none";
  const templateName = clean(body.templateName, 200) || localeName(data.template?.name);
  const orderNumber = generateOrderNumber(); // poziv na broj for the bank transfer
  const createdAt = new Date().toISOString();

  // --- Save the order (evidence; customer pays the 50% deposit by bank transfer) ---
  try {
    await writeClient.create({
      _type: "order",
      status: "pending_payment",
      orderNumber,
      templateName,
      ...(templateId ? { templateRef: { _type: "reference", _ref: templateId } } : {}),
      textValues,
      paper: { name: localeName(data.paper?.name), pricePerPiece: paperPrice },
      wrapper,
      ...(wrapper === "koverat"
        ? { envelope: { name: localeName(data.envelope?.name), pricePerPiece: envelopePrice } }
        : {}),
      ...(sealType !== "none"
        ? { seal: { motif: localeName(data.sealMotif?.name), color: localeName(data.sealColor?.name) } }
        : {}),
      sealAddon,
      addons: { tornEdges, goldEdges, roundedCorners },
      doubleSided,
      quantity,
      computedTotal: breakdown.total,
      deposit: breakdown.deposit,
      customer,
      createdAt,
    });
  } catch (err) {
    console.error("Failed to save order:", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  // Bank details for the deposit payment — reused by the success screen AND the
  // customer's confirmation email (single source, so both always match).
  const s = data.settings;
  const payment = {
    recipient: s?.bankRecipient ?? "",
    account: s?.bankAccount ?? "",
    bankName: s?.bankName ?? "",
    model: s?.bankModel ?? "00",
    paymentCode: s?.bankPaymentCode ?? "289",
    purpose: s?.bankPurpose ?? "",
  };

  // --- Notify the owner (non-blocking: order is already saved) ---
  try {
    if (data.settings?.contactEmail) {
      const config = [
        `Број наруџбине: ${orderNumber}`,
        `Количина: ${quantity}`,
        `Двострана: ${doubleSided ? "да" : "не"}`,
        `Папир: ${localeName(data.paper?.name)} (${paperPrice} дин/ком)`,
        `Омот: ${wrapper}${wrapper === "koverat" ? ` — ${localeName(data.envelope?.name)}` : ""}`,
        `Печат: ${sealType}${sealType !== "none" ? ` — ${localeName(data.sealMotif?.name)} / ${localeName(data.sealColor?.name)}` : ""}`,
        `Додаци: ${[tornEdges && "цепкане ивице", goldEdges && "златне ивице", roundedCorners && "заобљене"].filter(Boolean).join(", ") || "—"}`,
      ].join("\n");
      await sendOrderEmail(
        { templateName, textValues, config, total: breakdown.total, deposit: breakdown.deposit, customer },
        data.settings.contactEmail,
      );
    }
  } catch (err) {
    console.error("Owner order email failed (order still saved):", err);
  }

  // --- Confirmation email to the customer (non-blocking; skipped if no email) ---
  try {
    await sendCustomerOrderEmail({
      orderNumber,
      templateName,
      total: breakdown.total,
      deposit: breakdown.deposit,
      customer: { name: customer.name, email: customer.email },
      ownerEmail: data.settings?.contactEmail ?? "",
      payment,
    });
  } catch (err) {
    console.error("Customer order email failed (order still saved):", err);
  }

  // --- Log to the owner's Google Sheet for material planning (non-blocking) ---
  try {
    await appendOrderToSheet({
      createdAt,
      orderNumber,
      templateName,
      quantity,
      doubleSided,
      paperName: localeName(data.paper?.name),
      wrapper,
      envelopeName: wrapper === "koverat" ? localeName(data.envelope?.name) : "",
      sealSummary:
        sealType === "none"
          ? ""
          : `${sealType} — ${localeName(data.sealMotif?.name)} / ${localeName(data.sealColor?.name)}`,
      tornEdges,
      goldEdges,
      roundedCorners,
      total: breakdown.total,
      deposit: breakdown.deposit,
      customer,
    });
  } catch (err) {
    console.error("Google Sheet log failed (order still saved):", err);
  }

  // Payment details for the success screen (customer pays the deposit by bank transfer).
  return NextResponse.json({
    ok: true,
    total: breakdown.total,
    deposit: breakdown.deposit,
    orderNumber,
    payment,
  });
}

type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  eventDate: string;
};

// Digital invitation order (§15): fixed price from Sanity, paid 100% upfront, PDF delivered
// by email. Kept separate from the physical flow. NOTE: the actual PDF is not generated yet
// (waits for the owner's hi-res designs + a PDF step) — for now the owner is notified and
// sends the PDF; the customer is told it will follow by email.
async function handleDigitalOrder(
  body: Record<string, unknown>,
  customer: Customer,
): Promise<NextResponse> {
  // A digital invitation is delivered by email, so a valid email is required.
  if (customer.name.length < 2 || !customer.email.includes("@")) {
    return NextResponse.json({ error: "invalid_customer" }, { status: 400 });
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("Missing SANITY_API_WRITE_TOKEN — digital order not saved.");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const templateId = clean(body.templateId, 200);
  const textValues = (Array.isArray(body.textValues) ? body.textValues : [])
    .slice(0, 30)
    .map((t) => ({
      _key: clean((t as Record<string, unknown>)?.key, 60) || Math.random().toString(36).slice(2),
      key: clean((t as Record<string, unknown>)?.key, 60),
      value: clean((t as Record<string, unknown>)?.value, 500),
    }))
    .filter((t) => t.key);

  let data: {
    digitalPrice: number | null;
    template: { name?: { sr?: string } } | null;
    settings: {
      contactEmail?: string;
      bankRecipient?: string;
      bankAccount?: string;
      bankName?: string;
      bankModel?: string;
      bankPaymentCode?: string;
      bankPurpose?: string;
    } | null;
  };
  try {
    data = await writeClient.fetch(
      `{
        "digitalPrice": *[_type=="pricing"][0].digitalPrice,
        "template": *[_id==$templateId][0]{ name },
        "settings": *[_type=="siteSettings"][0]{ contactEmail, bankRecipient, bankAccount, bankName, bankModel, bankPaymentCode, bankPurpose }
      }`,
      { templateId },
    );
  } catch (err) {
    console.error("Digital order price lookup failed:", err);
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }

  // Price is ALWAYS taken from Sanity, never from the browser (§7).
  const total = Math.max(0, Math.round(Number(data.digitalPrice) || 0));
  if (total <= 0) {
    console.error("digitalPrice not configured in pricing — digital order refused.");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const templateName = clean(body.templateName, 200) || localeName(data.template?.name);
  const orderNumber = generateOrderNumber();
  const createdAt = new Date().toISOString();

  try {
    await writeClient.create({
      _type: "order",
      kind: "digital",
      status: "pending_payment",
      orderNumber,
      templateName,
      ...(templateId ? { templateRef: { _type: "reference", _ref: templateId } } : {}),
      textValues,
      computedTotal: total,
      deposit: total, // digital pays 100%
      customer,
      createdAt,
    });
  } catch (err) {
    console.error("Failed to save digital order:", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  const s = data.settings;
  const payment = {
    recipient: s?.bankRecipient ?? "",
    account: s?.bankAccount ?? "",
    bankName: s?.bankName ?? "",
    model: s?.bankModel ?? "00",
    paymentCode: s?.bankPaymentCode ?? "289",
    purpose: s?.bankPurpose ?? "",
  };

  // Notify the owner (non-blocking: order is already saved).
  try {
    if (s?.contactEmail) {
      await sendOrderEmail(
        {
          templateName,
          textValues,
          config: "Дигитална позивница — PDF на мејл",
          total,
          deposit: total,
          customer,
          digital: true,
        },
        s.contactEmail,
      );
    }
  } catch (err) {
    console.error("Owner digital order email failed (order still saved):", err);
  }

  // Confirmation to the customer (non-blocking).
  try {
    await sendCustomerOrderEmail({
      orderNumber,
      templateName,
      total,
      deposit: total,
      customer: { name: customer.name, email: customer.email },
      ownerEmail: s?.contactEmail ?? "",
      digital: true,
      payment,
    });
  } catch (err) {
    console.error("Customer digital order email failed (order still saved):", err);
  }

  return NextResponse.json({ ok: true, kind: "digital", total, deposit: total, orderNumber, payment });
}
