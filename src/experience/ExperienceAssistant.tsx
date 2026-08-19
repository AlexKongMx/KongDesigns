import { FormEvent, useEffect, useRef, useState } from "react";
import { PhoneField } from "./PhoneField";
import { getExperienceSession, trackExperienceEvent } from "./tracking";
import type { ExperienceAction, ExperienceMessage, ExperienceProfile, ExperienceReply, ExperienceSiteConfig, ExperienceView } from "./types";

const profileKey = (siteId: string) => `wdm_profile_${siteId}`;

export function ExperienceAssistant({ config }: { config: ExperienceSiteConfig }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ExperienceView>("chat");
  const [profile, setProfile] = useState<ExperienceProfile | null>(null);
  const [messages, setMessages] = useState<ExperienceMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState(config.quickReplies);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(profileKey(config.siteId));
      if (stored) setProfile(JSON.parse(stored) as ExperienceProfile);
    } catch { /* private browsing or disabled storage */ }
  }, [config.siteId]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  function openView(next: ExperienceView) {
    setView(next);
    setOpen(true);
    trackExperienceEvent(config.siteId, "ASSISTANT_OPENED", { view: next });
  }

  function routeAction(action?: ExperienceAction | null) {
    if (!action || !config.allowedActions.includes(action)) return;
    if (action === "START_BOOKING" || action === "BOOK_KONG_CALL") return openView("booking");
    if (action === "REQUEST_AI_CALL") return openView("call");
    if (action === "START_AI_AVATAR") return openView("avatar");
    if (action === "OPEN_WHATSAPP" && config.integrations.whatsapp?.url) {
      trackExperienceEvent(config.siteId, "HUMAN_CONTACT_REQUESTED");
      window.open(config.integrations.whatsapp.url, "_blank", "noopener,noreferrer");
    }
  }

  function requestContext() {
    return {
      version: config.version,
      siteId: config.siteId,
      verticalId: config.verticalId,
      clientId: config.clientId,
      personaId: config.personaId,
      knowledgeBaseId: config.knowledgeBaseId,
      locale: config.locale,
      allowedActions: config.allowedActions,
    };
  }

  function saveProfile(next: ExperienceProfile) {
    setProfile(next);
    try { sessionStorage.setItem(profileKey(config.siteId), JSON.stringify(next)); } catch { /* storage is optional */ }
    setMessages([{ role: "assistant", content: `Hola, ${next.name}. ${config.greeting}` }]);
    trackExperienceEvent(config.siteId, "ASSISTANT_ONBOARDING_COMPLETED");
  }

  async function ask(value: string) {
    const message = value.trim();
    if (!message || !profile || typing) return;
    const history = messages.slice(-10);
    setMessages((items) => [...items, { role: "user", content: message }]);
    setInput("");
    setQuickReplies([]);
    setTyping(true);
    trackExperienceEvent(config.siteId, "ASSISTANT_MESSAGE_SENT");
    try {
      const response = await fetch("/api/experience-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: config.siteId, experience: requestContext(), visitor: profile, profile, message, history, ...getExperienceSession() }),
      });
      const result = await response.json() as ExperienceReply;
      if (!response.ok || !result.reply) throw new Error("assistant unavailable");
      setMessages((items) => [...items, { role: "assistant", content: result.reply }]);
      setQuickReplies(Array.isArray(result.quickReplies) ? result.quickReplies.slice(0, 3) : []);
      routeAction(result.action);
    } catch {
      setMessages((items) => [...items, { role: "assistant", content: "No pude conectar en este momento. Intenta otra vez en unos segundos o escríbele directamente a Alex." }]);
    } finally {
      setTyping(false);
    }
  }

  return <div className={`wdm-assistant ${open ? "is-open" : ""}`}>
    {open && <>
      <button className="wdm-assistant__backdrop" aria-label="Cerrar asistente" onClick={() => setOpen(false)} />
      <div className="wdm-assistant__dialog" ref={dialogRef} role="dialog" aria-label={`${config.assistantName}, ${config.assistantRole}`}>
        <header><span className="wdm-assistant__mark">K</span><div><strong>{config.assistantName}</strong><small><i /> {config.assistantRole}</small></div><button aria-label="Cerrar" onClick={() => setOpen(false)}>×</button></header>
        {!profile ? <Onboarding config={config} onComplete={saveProfile} /> : <>
          <nav aria-label="Acciones del asistente">
            <button className={view === "chat" ? "is-active" : ""} onClick={() => setView("chat")}>Chat</button>
            <button className={view === "booking" ? "is-active" : ""} onClick={() => openView("booking")}>Agendar</button>
            <button className={view === "call" ? "is-active" : ""} onClick={() => openView("call")}>Llamada</button>
            <button className={view === "avatar" ? "is-active" : ""} onClick={() => openView("avatar")}>Avatar</button>
          </nav>
          {view === "chat" && <Chat messages={messages} quickReplies={quickReplies} input={input} typing={typing} onInput={setInput} onAsk={ask} />}
          {view === "booking" && <Booking config={config} onBack={() => setView("chat")} />}
          {view === "call" && <Call config={config} profile={profile} onBack={() => setView("chat")} />}
          {view === "avatar" && <Avatar url={config.integrations.avatar?.url} onBack={() => setView("chat")} />}
        </>}
      </div>
    </>}
    <button className="wdm-assistant__fab" aria-expanded={open} onClick={() => openView("chat")}><span>✦</span><b>Pregúntale a K</b><i /></button>
  </div>;
}

function Onboarding({ config, onComplete }: { config: ExperienceSiteConfig; onComplete: (profile: ExperienceProfile) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  return <div className="wdm-onboarding"><p className="wdm-eyebrow">PRUEBA LA EXPERIENCIA</p><h3>Veamos qué podemos construir para ti.</h3><p>Déjanos tus datos para personalizar el chat, la llamada y la agenda.</p><form onSubmit={(event) => { event.preventDefault(); if (name.trim() && /^\S+@\S+\.\S+$/.test(email) && /^\+[1-9]\d{7,14}$/.test(phone)) onComplete({ name: name.trim(), email: email.trim(), phone }); }}><label>Nombre<input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label><label>Correo<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Teléfono<PhoneField value={phone} defaultCountry={config.phone.defaultCountry} allowedCountries={config.phone.allowedCountries} onChange={setPhone} /></label><button>Comenzar <span>↗</span></button></form></div>;
}

function Chat({ messages, quickReplies, input, typing, onInput, onAsk }: { messages: ExperienceMessage[]; quickReplies: string[]; input: string; typing: boolean; onInput: (value: string) => void; onAsk: (value: string) => Promise<void> }) {
  function submit(event: FormEvent) { event.preventDefault(); void onAsk(input); }
  return <div className="wdm-chat"><div className="wdm-chat__messages" role="log" aria-live="polite">{messages.map((message, index) => <div className={`wdm-message is-${message.role}`} key={`${index}-${message.content}`}>{message.content}</div>)}{typing && <div className="wdm-message is-assistant is-typing">•••</div>}</div>{quickReplies.length > 0 && <div className="wdm-chat__quick">{quickReplies.map((reply) => <button key={reply} onClick={() => void onAsk(reply)}>{reply}<span>↗</span></button>)}</div>}<form onSubmit={submit}><input value={input} onChange={(event) => onInput(event.target.value)} placeholder="Escribe tu pregunta…" disabled={typing} /><button aria-label="Enviar" disabled={typing}>↑</button></form></div>;
}

function Booking({ config, onBack }: { config: ExperienceSiteConfig; onBack: () => void }) {
  const booking = config.integrations.booking;
  return <div className="wdm-action"><h3>{booking?.title || "Agenda directamente"}</h3><p>{booking?.description || "Escoge una hora aquí mismo. No necesitas salir del sitio."}</p>{booking?.url ? <iframe title={booking.title} src={booking.url} /> : <p className="wdm-notice">La agenda todavía no está conectada.</p>}<button className="wdm-back" onClick={onBack}>← Volver al chat</button></div>;
}

function Call({ config, profile, onBack }: { config: ExperienceSiteConfig; profile: ExperienceProfile; onBack: () => void }) {
  const [phone, setPhone] = useState(profile.phone);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus("sending");
    try {
      const response = await fetch("/api/experience-call", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteId: config.siteId, experience: { version: config.version, siteId: config.siteId, verticalId: config.verticalId, clientId: config.clientId, personaId: config.personaId, knowledgeBaseId: config.knowledgeBaseId, locale: config.locale }, visitor: profile, profile, phone, ...getExperienceSession() }) });
      if (!response.ok) throw new Error("call unavailable");
      setStatus("success"); trackExperienceEvent(config.siteId, "AI_CALL_REQUESTED");
    } catch { setStatus("error"); }
  }
  const call = config.integrations.call;
  return <div className="wdm-action"><h3>{call?.title || "Prueba una llamada"}</h3><p>{call?.description || "El asistente te llama y puede explicarte opciones o ayudarte a agendar."}</p>{status === "success" ? <p className="wdm-notice is-success">{call?.successMessage || "Listo. La llamada fue solicitada."}</p> : <form onSubmit={submit}><PhoneField value={phone} defaultCountry={config.phone.defaultCountry} allowedCountries={config.phone.allowedCountries} onChange={(value) => { setPhone(value); setStatus("idle"); }} /><button disabled={status === "sending" || !call?.enabled}>{status === "sending" ? "Solicitando…" : "Llámame"} <span>↗</span></button>{status === "error" && <p className="wdm-notice">La llamada aún no está conectada en este sitio.</p>}</form>}<button className="wdm-back" onClick={onBack}>← Volver al chat</button></div>;
}

function Avatar({ url, onBack }: { url?: string; onBack: () => void }) {
  return <div className="wdm-action wdm-avatar"><h3>Habla con el avatar</h3><p>La misma inteligencia, con una presencia visual.</p>{url ? <iframe title="Asistente con avatar" src={url} allow="camera; microphone; autoplay" /> : <div className="wdm-avatar__placeholder"><span>✦</span><strong>Avatar listo para conectar</strong><small>Sólo falta asignar el agente de Kong Designs.</small></div>}<button className="wdm-back" onClick={onBack}>← Volver al chat</button></div>;
}
