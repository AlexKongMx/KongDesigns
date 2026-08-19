import type { Config, Context } from "@netlify/functions";
import { json, text, webhookHeaders } from "./_shared/http";

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const siteId = text(raw.siteId, 80);
  const event = text(raw.event, 80);
  if (!siteId || !event) return json({ error: "invalid_event" }, 400);
  const record = { ...raw, siteId, event, timestamp: new Date().toISOString() };
  const webhook = Netlify.env.get("N8N_WDM_EVENT_WEBHOOK");
  if (webhook) {
    try {
      await fetch(webhook, { method: "POST", headers: webhookHeaders(), body: JSON.stringify(record), signal: AbortSignal.timeout(1800) });
    } catch { /* analytics must never block the visitor */ }
  }
  return json({ accepted: true }, 202);
};

export const config: Config = { path: "/api/experience-event" };
