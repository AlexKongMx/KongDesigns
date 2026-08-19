import type { Config, Context } from "@netlify/functions";
import { json, text, webhookHeaders } from "./_shared/http";

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }

  const message = text(raw.message, 1500);
  const siteId = text(raw.siteId, 80);
  if (!message || !siteId) return json({ error: "message_and_site_required" }, 400);

  const webhook = Netlify.env.get("N8N_WDM_CHAT_WEBHOOK");
  if (!webhook) return json({ error: "assistant_not_connected" }, 503);

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: webhookHeaders(),
      body: JSON.stringify({ version: "2.0", mode: "site_assistant", ...raw, message, siteId }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return json({ error: "assistant_upstream_error" }, 502);
    const result = await response.json() as Record<string, unknown>;
    const reply = text(result.reply, 3000);
    if (!reply) return json({ error: "invalid_assistant_response" }, 502);
    return json({ reply, quickReplies: Array.isArray(result.quickReplies) ? result.quickReplies.slice(0, 4) : [], action: result.action ?? null, intent: result.intent ?? null });
  } catch {
    return json({ error: "assistant_unavailable" }, 502);
  }
};

export const config: Config = { path: "/api/experience-chat" };
