import type { Config, Context } from "@netlify/functions";
import { json, text, webhookHeaders } from "./_shared/http";

function phone(value: unknown) {
  const raw = text(value, 40).replace(/[^\d+]/g, "");
  const normalized = raw.startsWith("+") ? raw : "+" + raw.replace(/\D/g, "");
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : "";
}

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const destination = phone(raw.phone);
  const siteId = text(raw.siteId, 80);
  if (!destination || !siteId) return json({ error: "invalid_phone" }, 400);
  const webhook = Netlify.env.get("N8N_WDM_CALL_WEBHOOK");
  if (!webhook || !Netlify.env.get("N8N_WDM_SHARED_SECRET")) return json({ error: "call_not_configured" }, 503);
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: webhookHeaders(),
      body: JSON.stringify({ version: "2.0", ...raw, phone: destination, siteId }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return json({ error: "call_upstream_error" }, 502);
    return json({ accepted: true }, 202);
  } catch {
    return json({ error: "call_unavailable" }, 502);
  }
};

export const config: Config = { path: "/api/experience-call" };
