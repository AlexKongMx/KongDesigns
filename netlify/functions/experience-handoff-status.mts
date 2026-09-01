import type { Config, Context } from "@netlify/functions";
import { json, text, webhookHeaders } from "./_shared/http";

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let raw: Record<string, unknown>;
  try {
    raw = await request.json() as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const sessionId = text(raw.sessionId, 120);
  if (!sessionId) return json({ error: "session_id_required" }, 400);

  const webhook = Netlify.env.get("N8N_WDM_HANDOFF_STATUS_WEBHOOK")
    || "https://n8n.srv1457832.hstgr.cloud/webhook/wdm-experience-engine-human-handoff-status-v1";

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: webhookHeaders(),
      body: JSON.stringify({ sessionId }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return json({ error: "handoff_upstream_error" }, 502);

    const result = await response.json() as Record<string, unknown>;
    return json({
      ok: result.ok === true,
      handoffId: text(result.handoff_id, 48),
      status: text(result.status, 40) || "none",
      contactPreference: text(result.contact_preference, 40),
      messages: Array.isArray(result.messages)
        ? result.messages.slice(-20).map((item) => {
            const value = item && typeof item === "object" ? item as Record<string, unknown> : {};
            return {
              id: text(value.id, 80),
              text: text(value.text, 3000),
              createdAt: text(value.created_at, 80),
            };
          }).filter((item) => item.id && item.text)
        : [],
    });
  } catch {
    return json({ error: "handoff_unavailable" }, 502);
  }
};

export const config: Config = { path: "/api/experience-handoff-status" };
