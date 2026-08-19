const VISITOR_KEY = "wdm_visitor_id";
const SESSION_KEY = "wdm_session_id";

function id(key: string) {
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(key, created);
  return created;
}

export function getExperienceSession() {
  return { visitorId: id(VISITOR_KEY), sessionId: id(SESSION_KEY) };
}

export function trackExperienceEvent(siteId: string, event: string, detail?: Record<string, unknown>) {
  const body = JSON.stringify({ siteId, event, ...getExperienceSession(), path: location.pathname, detail });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/experience-event", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/experience-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => undefined);
}
