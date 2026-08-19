import type { Config, Context } from "@netlify/functions";
import { json, text, webhookHeaders } from "./_shared/http";

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  if (text(raw.website, 200)) return json({ ok: true });
  const name = text(raw.name, 120);
  const email = text(raw.email, 254);
  const business = text(raw.business, 160);
  const message = text(raw.message, 4000);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) return json({ error: "required_fields" }, 400);
  const webhook = Netlify.env.get("N8N_WDM_CONTACT_WEBHOOK");
  if (!webhook) return json({ error: "contact_not_configured" }, 503);
  try {
    const response = await fetch(webhook, { method: "POST", headers: webhookHeaders(), body: JSON.stringify({ name, email, business, message, source: "kongdesigns.com" }), signal: AbortSignal.timeout(12000) });
    if (!response.ok) return json({ error: "contact_upstream_error" }, 502);
  } catch { return json({ error: "contact_unavailable" }, 502); }
  return json({ ok: true });
};

export const config: Config = { path: "/api/contact" };
