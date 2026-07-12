// Minimal in-memory sliding-window rate limiter (no dependency). Good enough as a
// first guard; note it is per-serverless-instance, so harden with a shared store
// (e.g. Upstash) in the Phase 1.4 security pass if abuse appears.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
