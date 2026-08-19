import type { Config, Context } from "@netlify/functions";
import { json, text, webhookHeaders } from "./_shared/http";

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }

  const action = text(raw.action, 20);
  const siteId = text(raw.siteId, 80);
  const clientId = text(raw.clientId, 80);
  const selectedStart = text(raw.selectedStart, 80);
  const visitor = raw.visitor as Record<string, unknown> | undefined;
  if (!siteId || !clientId || !visitor || !["availability", "book"].includes(action)) return json({ error: "invalid_booking_request" }, 400);
  if (action === "book" && !selectedStart) return json({ error: "selected_start_required" }, 400);

  const webhook = Netlify.env.get("N8N_WDM_BOOKING_WEBHOOK");
  if (!webhook) return json({ error: "booking_not_connected" }, 503);

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: webhookHeaders(),
      body: JSON.stringify({ ...raw, version: "2.0", action, siteId, clientId, selectedStart: selectedStart || undefined }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json() as Record<string, unknown>;
    if (!response.ok) return json({ error: text(result.error, 160) || "booking_upstream_error" }, 502);
    return json(result);
  } catch {
    return json({ error: "booking_unavailable" }, 502);
  }
};

export const config: Config = { path: "/api/experience-booking" };
