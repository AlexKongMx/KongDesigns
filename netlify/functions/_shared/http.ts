export function json(payload: unknown, status = 200) {
  return Response.json(payload, { status, headers: { "Cache-Control": "no-store" } });
}

export function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function webhookHeaders() {
  const secret = Netlify.env.get("N8N_WDM_SHARED_SECRET");
  return {
    "Content-Type": "application/json",
    ...(secret ? { "x-wdm-secret": secret } : {}),
  };
}
