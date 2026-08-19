import { useEffect, useMemo, useState } from "react";
import { trackExperienceEvent } from "./tracking";
import type { ExperienceProfile, ExperienceSiteConfig } from "./types";

type Slot = { id?: string; startTime: string; endTime?: string; label?: string };
type BookingResponse = {
  ok?: boolean;
  options?: Slot[];
  timezone?: string;
  appointmentId?: string;
  startTime?: string;
  label?: string;
  message?: string;
  error?: string;
};

const fallbackTimezone = "America/Vancouver";
const dayKey = (iso: string, timezone: string) => new Intl.DateTimeFormat("en-CA", {
  timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date(iso));
const dayLabel = (iso: string, timezone: string) => new Intl.DateTimeFormat("es-MX", {
  timeZone: timezone, weekday: "short",
}).format(new Date(iso)).replace(".", "");
const timeLabel = (iso: string, timezone: string) => new Intl.DateTimeFormat("es-MX", {
  timeZone: timezone, hour: "numeric", minute: "2-digit",
}).format(new Date(iso)).replace(/\s/g, " ");
const fullDateLabel = (iso: string, timezone: string) => new Intl.DateTimeFormat("es-MX", {
  timeZone: timezone, weekday: "short", day: "numeric", month: "short",
}).format(new Date(iso)).replace(".", "");
const monthLabel = (iso: string, timezone: string) => new Intl.DateTimeFormat("es-MX", {
  timeZone: timezone, month: "long", year: "numeric",
}).format(new Date(iso));
const zoneLabel = (timezone: string) => timezone === "America/Vancouver" ? "Hora de Vancouver" : timezone.replace("_", " ");

export function BookingExperience({ config, visitor, onBack }: { config: ExperienceSiteConfig; visitor: ExperienceProfile; onBack: () => void }) {
  const booking = config.integrations.booking;
  const endpoint = booking?.endpoint || "/api/experience-booking";
  const fallbackUrl = booking?.url;
  const initialTimezone = booking?.timezone || fallbackTimezone;
  const [status, setStatus] = useState<"loading" | "ready" | "booking" | "booked" | "error">("loading");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [activeDay, setActiveDay] = useState("");
  const [selectedStart, setSelectedStart] = useState("");
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null);
  const [error, setError] = useState("");

  const requestBody = (action: "availability" | "book", selected?: string) => ({
    action,
    selectedStart: selected,
    limit: 18,
    timezone,
    siteId: config.siteId,
    clientId: config.clientId,
    experience: {
      version: config.version,
      siteId: config.siteId,
      verticalId: config.verticalId,
      clientId: config.clientId,
      personaId: config.personaId,
      knowledgeBaseId: config.knowledgeBaseId,
      locale: config.locale,
    },
    visitor,
  });

  async function loadAvailability() {
    setStatus("loading");
    setError("");
    setSelectedStart("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody("availability")),
      });
      const result = await response.json() as BookingResponse;
      const nextSlots = Array.isArray(result.options) ? result.options.filter((slot) => typeof slot.startTime === "string") : [];
      if (!response.ok || !result.ok || !nextSlots.length) throw new Error(result.error || "no_availability");
      const nextTimezone = result.timezone || initialTimezone;
      setTimezone(nextTimezone);
      setSlots(nextSlots);
      setActiveDay(dayKey(nextSlots[0].startTime, nextTimezone));
      setStatus("ready");
    } catch {
      setStatus("error");
      setError("No pude cargar los horarios en este momento.");
    }
  }

  useEffect(() => { void loadAvailability(); }, [config.clientId]);

  const days = useMemo(() => {
    const seen = new Set<string>();
    return slots.filter((slot) => {
      const key = dayKey(slot.startTime, timezone);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [slots, timezone]);
  const visibleSlots = slots.filter((slot) => dayKey(slot.startTime, timezone) === activeDay);
  const selectedSlot = slots.find((slot) => slot.startTime === selectedStart);

  async function confirmBooking() {
    if (!selectedStart || status === "booking") return;
    setStatus("booking");
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody("book", selectedStart)),
      });
      const result = await response.json() as BookingResponse;
      if (!response.ok || !result.ok) throw new Error(result.error || "booking_failed");
      setConfirmation(result);
      setStatus("booked");
      trackExperienceEvent(config.siteId, "BOOKING_COMPLETED", { bookingStart: selectedStart });
    } catch {
      setStatus("ready");
      setError("Ese horario ya no pudo confirmarse. Elige otro o intenta nuevamente.");
    }
  }

  return <div className="wdm-action wdm-booking">
    <button className="wdm-back wdm-back--top" type="button" onClick={onBack}>← Volver al chat</button>
    <div className="wdm-booking__intro"><p className="wdm-eyebrow">HABLEMOS DE TU PROYECTO</p><h3>{booking?.title || "Agenda una llamada"}</h3><p>{booking?.description || "Elige un horario y confirma sin salir del sitio."}</p></div>
    <div className="wdm-booking__profile"><span>✓</span><div><b>{visitor.name}</b><small>{visitor.email} · {visitor.phone}</small></div><em>Datos listos</em></div>

    {status === "loading" && <div className="wdm-booking__loading"><i /><i /><i /><p>Buscando horarios disponibles…</p></div>}

    {status === "error" && <div className="wdm-booking__error"><strong>La agenda no respondió</strong><p>{error}</p><button type="button" onClick={() => void loadAvailability()}>Intentar de nuevo</button>{fallbackUrl && <a href={fallbackUrl} target="_blank" rel="noreferrer">Abrir agenda completa ↗</a>}</div>}

    {(status === "ready" || status === "booking") && slots.length > 0 && <div className="wdm-booking__calendar">
      <div className="wdm-booking__month"><span>{monthLabel(slots[0].startTime, timezone)}</span><small>{zoneLabel(timezone)}</small></div>
      <div className="wdm-booking__days">{days.map((slot) => {
        const key = dayKey(slot.startTime, timezone);
        return <button type="button" className={key === activeDay ? "is-active" : ""} key={key} onClick={() => { setActiveDay(key); setSelectedStart(""); }}><span>{dayLabel(slot.startTime, timezone)}</span><b>{new Intl.DateTimeFormat("es-MX", { timeZone: timezone, day: "numeric" }).format(new Date(slot.startTime))}</b><small>{new Intl.DateTimeFormat("es-MX", { timeZone: timezone, month: "short" }).format(new Date(slot.startTime)).replace(".", "")}</small></button>;
      })}</div>
      <div className="wdm-booking__times">{visibleSlots.map((slot) => <button type="button" className={slot.startTime === selectedStart ? "is-selected" : ""} key={slot.startTime} onClick={() => setSelectedStart(slot.startTime)}>{timeLabel(slot.startTime, timezone)}</button>)}</div>
      <button className="wdm-booking__confirm" type="button" disabled={!selectedStart || status === "booking"} onClick={() => void confirmBooking()}>{status === "booking" ? "Confirmando…" : "Confirmar llamada"}<span>↗</span></button>
      {selectedSlot && <small className="wdm-booking__selection">Seleccionaste: {fullDateLabel(selectedSlot.startTime, timezone)} · {timeLabel(selectedSlot.startTime, timezone)}</small>}
      {error && <small className="wdm-booking__feedback">{error}</small>}
      {fallbackUrl && <a className="wdm-booking__fallback" href={fallbackUrl} target="_blank" rel="noreferrer">Ver agenda completa ↗</a>}
    </div>}

    {status === "booked" && <div className="wdm-booking__success"><span>✓</span><h3>Llamada agendada</h3><p>{confirmation?.label || confirmation?.message || "Listo. Tu horario quedó confirmado."}</p><small>Te enviaremos la confirmación a {visitor.email}.</small></div>}
  </div>;
}
