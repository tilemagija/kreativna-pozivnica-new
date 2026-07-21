// Single source of truth for the physical-invitation price (konfigurator §6, cenovnik.md).
// Used BOTH client-side (live price for UX) and server-side (/api/order recompute — the
// charged amount is never trusted from the browser, §7). Keep it pure and dependency-free.

export type WrapperKind = "bez" | "paus" | "koverat";
export type SealType = "none" | "plain" | "goldLeaf" | "tatarika";

// The pricing rules/add-ons from the Sanity `pricing` singleton (only what we need here).
export type PricingConfig = {
  minQuantity?: number;
  setupFee?: number;
  digitalPrice?: number; // fixed price for a digital invitation (100% upfront)
  pausOmotPrice?: number;
  addonDoubleSided?: number;
  addonTornEdges?: number;
  addonGoldEdges?: number;
  addonRoundedEdges?: number;
  sealBase?: number;
  sealGoldLeaf?: number;
  sealTatarika?: number;
};

// A concrete customer selection (prices per piece are resolved from the chosen options).
export type PriceSelection = {
  quantity: number;
  paperPrice: number; // per piece
  wrapper: WrapperKind;
  envelopePrice: number; // per piece, only when wrapper === "koverat"
  doubleSided: boolean; // fixed by the design, not chosen by the customer
  tornEdges: boolean;
  goldEdges: boolean;
  roundedCorners: boolean;
  sealType: SealType;
};

export type PriceBreakdown = {
  perPiece: number;
  subtotal: number; // quantity × perPiece
  setupFee: number; // 0, or the setup fee when below minimum quantity
  total: number;
  deposit: number; // 50% deposit, rounded (rest is cash-on-delivery)
};

const num = (v: unknown, d = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : d;

export function sealPrice(sealType: SealType, p: PricingConfig): number {
  switch (sealType) {
    case "plain":
      return num(p.sealBase);
    case "goldLeaf":
      return num(p.sealGoldLeaf);
    case "tatarika":
      return num(p.sealTatarika);
    default:
      return 0;
  }
}

export function computePrice(sel: PriceSelection, p: PricingConfig): PriceBreakdown {
  const wrapper =
    sel.wrapper === "koverat"
      ? num(sel.envelopePrice)
      : sel.wrapper === "paus"
        ? num(p.pausOmotPrice)
        : 0;

  const perPiece =
    num(sel.paperPrice) +
    wrapper +
    sealPrice(sel.sealType, p) +
    (sel.doubleSided ? num(p.addonDoubleSided) : 0) +
    (sel.tornEdges ? num(p.addonTornEdges) : 0) +
    (sel.goldEdges ? num(p.addonGoldEdges) : 0) +
    (sel.roundedCorners ? num(p.addonRoundedEdges) : 0);

  const qty = Math.max(0, Math.floor(num(sel.quantity)));
  const subtotal = qty * perPiece;
  const minQ = num(p.minQuantity, 50);
  const setupFee = qty > 0 && qty < minQ ? num(p.setupFee) : 0;
  const total = subtotal + setupFee;
  const deposit = Math.round(total / 2);

  return { perPiece, subtotal, setupFee, total, deposit };
}
