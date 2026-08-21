"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ExperienceAssistant } from "../experience/ExperienceAssistant";
import { kongDesignsExperience } from "../experience/config";

type Lang = "es" | "en";
type Project = { name: string; type: string; url: string; image: string; preview?: { brand: string; title: ReactNode }; layout?: "reef" };

const projectData = [
  { name: "Dental Master", typeEs: "Website · Salud", typeEn: "Website · Healthcare", url: "https://dentalclinic.kongdesigns.com/", image: "/work/dental-master.webp", dental: true },
  { name: "Kongllective", typeEs: "Website · Creatividad", typeEn: "Website · Creative", url: "https://kongllective.com/", image: "/work/kongllective.webp" },
  { name: "Sunbound México", typeEs: "Website · Viajes", typeEn: "Website · Travel", url: "https://sunbound-mexico.alexkong.chatgpt.site/", image: "/work/sunbound-mexico.webp" },
  { name: "Reef Solutions", typeEs: "Website · Sustentabilidad", typeEn: "Website · Sustainability", url: "https://reef-solutions.netlify.app/", image: "/work/reef-solutions.jpg", layout: "reef" as const },
  { name: "Kong Coaching", typeEs: "Website · Educación", typeEn: "Website · Education", url: "https://kongcoaching.net/", image: "/work/kong-coaching.webp" },
  { name: "Alex Kong 3D", typeEs: "Portafolio · Artista 3D", typeEn: "Portfolio · 3D Artist", url: "https://alexkong3d.com/", image: "/work/alex-kong-3d.webp" },
  { name: "Canadian Credit Foundations", typeEs: "Website · Finanzas", typeEn: "Website · Financial", url: "https://canadiancreditfoundations.ca/", image: "/work/canadian-credit-foundations.webp" },
  { name: "Qué Onda Planeta", typeEs: "Website · Sustentabilidad", typeEn: "Website · Sustainability", url: "https://queondaplaneta.com/", image: "/work/que-onda-planeta.webp" },
  { name: "AMTG", typeEs: "Website · Movilidad", typeEn: "Website · Mobility", url: "https://amtg.co/", image: "/work/amtg.webp" },
  { name: "MotoMarketLatam", typeEs: "Website · Consultoría", typeEn: "Website · Advisory", url: "https://motomarketlatam.com/", image: "/work/moto-market-latam.webp" },
  { name: "Motosinapsis", typeEs: "Website · Movilidad", typeEn: "Website · Mobility", url: "https://motosinapsis.com/", image: "/work/moto-sinapsis.webp" },
  { name: "Kong Coaching Schools", typeEs: "Website · Educación", typeEn: "Website · Education", url: "https://schools.kongcoaching.net/", image: "/work/kong-coaching-schools.webp" },
];

const copy = {
  es: {
    navAria: "Navegación principal", homeAria: "Kong Designs, inicio", work: "Trabajo", services: "Servicios", contact: "Contacto",
    eyebrow: "Diseño digital, apps y automatización para negocios con ambición", heroA: "Tu negocio merece", heroB: "verse", heroEm: "poca madre.",
    heroBody: "Websites, apps y sistemas de automatización que generan resultados.", projects: "Ver proyectos",
    ticker: ["WEBSITES", "APPS", "SISTEMAS", "AUTOMATIZACIÓN", "OUTREACH", "LEAD GEN", "CRM", "CONVERSIÓN"], selected: "01 — TRABAJO SELECCIONADO", selectedTitle: "Proyectos seleccionados", selectedBody: "Una selección de websites, apps y sistemas que hemos diseñado, construido y automatizado.", open: "Abrir", cover: "Portada del sitio", dentalCta: "AGENDA UNA VALORACIÓN ↗",
    what: "02 — QUÉ HACEMOS", servicesTitleA: "Bonito por fuera.", servicesTitleB: "Potente por dentro.", strategy: "Estrategia", strategyBody: "Definimos qué debe comunicar cada producto, a quién debe mover y qué resultado debe provocar.", websites: "Websites y apps", websitesBody: "Experiencias digitales únicas, rápidas y optimizadas para móvil que hacen justicia a tu negocio.", conversion: "Sistemas y automatización", conversionBody: "CRM, outreach, lead generation y seguimiento conectados para convertir oportunidades en conversaciones y ventas.",
    next: "03 — SIGUIENTE PROYECTO", contactA: "Hagamos algo", contactB: "que destaque.", lead: "Cuéntame qué estás construyendo. Te respondo personalmente con ideas y un siguiente paso claro.", email: "Correo", phone: "Teléfono",
    yourName: "Tu nombre", name: "Nombre", yourEmail: "Tu correo", business: "Negocio", businessPh: "Nombre de tu negocio", build: "¿Qué quieres construir?", messagePh: "Un poco sobre el proyecto, tus metas y tiempos…", send: "Enviar proyecto", sending: "Enviando…", success: "Listo. Ya llegó tu mensaje; Alex te responde pronto.", errorA: "No se pudo enviar. Intenta otra vez o escríbele por", footer: "Diseño digital para negocios con ambición.", top: "Volver arriba ↑",
  },
  en: {
    navAria: "Main navigation", homeAria: "Kong Designs, home", work: "Work", services: "Services", contact: "Contact",
    eyebrow: "Digital design, apps and automation for ambitious businesses", heroA: "Your business deserves", heroB: "to look", heroEm: "damn good.",
    heroBody: "Websites, apps and automation systems built to generate results.", projects: "View projects",
    ticker: ["WEBSITES", "APPS", "SYSTEMS", "AUTOMATION", "OUTREACH", "LEAD GEN", "CRM", "CONVERSION"], selected: "01 — SELECTED WORK", selectedTitle: "Selected projects", selectedBody: "A selection of websites, apps and systems we've designed, built and automated.", open: "Open", cover: "Website cover for", dentalCta: "BOOK A CONSULTATION ↗",
    what: "02 — WHAT WE DO", servicesTitleA: "Beautiful outside.", servicesTitleB: "Powerful inside.", strategy: "Strategy", strategyBody: "We define what each product needs to communicate, who it needs to move, and what result it should drive.", websites: "Websites & apps", websitesBody: "Unique, fast, mobile-optimized digital experiences that do your business justice.", conversion: "Systems & automation", conversionBody: "CRM, outreach, lead generation and follow-up connected to turn opportunities into conversations and sales.",
    next: "03 — YOUR NEXT PROJECT", contactA: "Let's build something", contactB: "that stands out.", lead: "Tell me what you're building. I'll personally reply with ideas and a clear next step.", email: "Email", phone: "Phone",
    yourName: "Your name", name: "Name", yourEmail: "Your email", business: "Business", businessPh: "Your business name", build: "What do you want to build?", messagePh: "A little about the project, your goals and timeline…", send: "Send project", sending: "Sending…", success: "Done. Your message is in; Alex will get back to you soon.", errorA: "Couldn't send it. Try again or message us on", footer: "Digital design for ambitious businesses.", top: "Back to top ↑",
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("es");
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const t = copy[lang];
  const whatsapp = lang === "es" ? "https://wa.me/16724721285?text=Hola%20Alex%2C%20quiero%20platicar%20sobre%20un%20sitio%20web%20para%20mi%20negocio." : "https://wa.me/16724721285?text=Hi%20Alex%2C%20I%27d%20like%20to%20talk%20about%20a%20website%20for%20my%20business.";
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const projects: Project[] = projectData.map((project) => ({ name: project.name, type: lang === "es" ? project.typeEs : project.typeEn, url: project.url, image: project.image, layout: "layout" in project ? project.layout : undefined, preview: "dental" in project ? { brand: "GNUX DENTAL", title: lang === "es" ? <>Tu sonrisa.<br />Tu historia.<br /><em>Tu plan.</em></> : <>Your smile.<br />Your story.<br /><em>Your plan.</em></> } : undefined }));
  async function sendEmail(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement); form.append("language", lang); setFormStatus("sending"); try { const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) }); if (!response.ok) throw new Error("Lead delivery failed"); formElement.reset(); setFormStatus("success"); } catch { setFormStatus("error"); } }
  const languageSwitch = <button type="button" onClick={() => setLang(lang === "es" ? "en" : "es")} aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"} style={{ border: 0, background: "transparent", color: "inherit", font: "inherit", fontWeight: 800, letterSpacing: ".08em", cursor: "pointer", padding: "8px 4px" }}>{lang === "es" ? "EN" : "ES"}</button>;

  return <main>
    <style>{`
      body{overflow-x:hidden}
      .nav-cta{background:var(--acid)}
      .nav-cta:hover{background:var(--ink);color:white}
      .hero{overflow:visible}
      .hero:before{left:50%;right:auto;width:100vw;inset-block:0;transform:translateX(-50%)}
      .eyebrow i{flex:0 0 8px}
      .hero-bottom{margin-left:0;grid-template-columns:minmax(0,760px) auto;gap:48px;align-items:end}
      .hero-bottom>p{max-width:760px;font-size:18px;line-height:1.35;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
      @media(max-width:900px){.hero{overflow:hidden}.hero:before{width:calc(100% + 48px)}.hero-bottom{grid-template-columns:1fr;gap:28px}}
      @media(max-width:560px){.hero-bottom>p{font-size:15px;line-height:1.45;letter-spacing:.06em}}
    `}</style>
    <nav className="nav shell" aria-label={t.navAria}><a className="brand" href="#top" aria-label={t.homeAria}>KONG DESIGNS<span>®</span></a><div className="nav-links"><a href="#work">{t.work}</a><a href="#services">{t.services}</a><a href="#contact">{t.contact}</a></div><div className="nav-actions" style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 10 }}>{languageSwitch}<a className="nav-cta" href={whatsapp} target="_blank" rel="noreferrer"><span className="nav-cta-label">WhatsApp</span><span className="nav-cta-arrow">↗</span></a></div></nav>
    <header className="hero shell" id="top"><div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" /><div className="eyebrow"><i /> {t.eyebrow}</div><h1>{t.heroA}<br />{t.heroB} <em>{t.heroEm}</em></h1><div className="hero-bottom"><p>{t.heroBody}</p><div className="hero-actions"><a className="button primary" href="#work">{t.projects} <span>↓</span></a></div></div><div className="hero-stamp" aria-hidden="true"><span>DESIGN · BUILD · GROW ·</span><b>K</b></div></header>
    <section className="ticker" aria-label={t.services}><div>{[0,1,2,3].flatMap((round) => t.ticker.map((item, index) => <span key={`${round}-${index}`}><span>{item}</span><b>✳</b></span>))}</div></section>
    <section className="work shell" id="work"><div className="section-heading"><div><p className="kicker">{t.selected}</p><h2>{t.selectedTitle}</h2></div><p>{t.selectedBody}</p></div><div className="project-grid">{projects.map((project) => <a className="project-card" href={project.url} target="_blank" rel="noreferrer" key={project.name} aria-label={`${t.open} ${project.name}`}><div className="project-visual">{project.layout === "reef" ? <div className="reef-card-art" aria-hidden="true"><div className="reef-card-nav"><b>REEF.</b><span>Solutions &nbsp;&nbsp; Approach &nbsp;&nbsp; Projects &nbsp;&nbsp; Team</span><i>GET IN TOUCH</i></div><div className="reef-card-body"><div className="reef-card-copy"><small>● RESOURCE EFFICIENCY · MALAYSIA</small><strong>Cut Energy<br />Costs.<br /><em>Keep the<br />Savings.</em></strong><p>We cut energy and operating costs for commercial buildings across Malaysia.</p><div><b>Get in Touch&nbsp; →</b><span>◉ &nbsp;See case studies</span></div></div><div className="reef-card-case"><img src="/work/reef-solutions.jpg" alt="" /><div className="reef-case-label"><b>Allianz Malaysia HQ</b><small>Menara Allianz Sentral, KL Sentral</small><span>Case Study ↓</span></div><div className="reef-stats"><b>16,400<small>kWh/month saved</small></b><b>1.4yr<small>payback period</small></b><b>RM8.8k<small>avg monthly savings</small></b></div></div></div></div> : <img src={project.image} alt={`${t.cover} ${project.name}`} loading="lazy" />}{project.preview && <div className="project-preview" aria-hidden="true"><span>{project.preview.brand}</span><strong>{project.preview.title}</strong><small>{t.dentalCta}</small></div>}</div><div className="project-meta"><h3>{project.name}</h3><p>{project.type}</p></div></a>)}</div></section>
    <section className="services shell" id="services"><div className="services-intro"><p className="kicker">{t.what}</p><h2>{t.servicesTitleA}<br />{t.servicesTitleB}</h2></div><div className="service-list"><article><span>01</span><h3>{t.strategy}</h3><p>{t.strategyBody}</p></article><article><span>02</span><h3>{t.websites}</h3><p>{t.websitesBody}</p></article><article><span>03</span><h3>{t.conversion}</h3><p>{t.conversionBody}</p></article></div></section>
    <section className="contact" id="contact"><div className="shell contact-grid"><div className="contact-copy"><p className="kicker">{t.next}</p><h2>{t.contactA}<br /><em>{t.contactB}</em></h2><p className="lead">{t.lead}</p><div className="direct-links"><a href={whatsapp} target="_blank" rel="noreferrer"><span>WhatsApp</span><b>+1 672 472 1285 ↗</b></a><a href="mailto:alex@kongdesigns.com"><span>{t.email}</span><b>alex@kongdesigns.com ↗</b></a><a href="tel:+16724721285"><span>{t.phone}</span><b>+1 (672) 472-1285 ↗</b></a></div></div><form className="contact-form" onSubmit={sendEmail}><input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" /><label>{t.yourName}<input name="name" type="text" placeholder={t.name} required /></label><label>{t.yourEmail}<input name="email" type="email" placeholder="tu@negocio.com" required /></label><label>{t.business}<input name="business" type="text" placeholder={t.businessPh} /></label><label>{t.build}<textarea name="message" placeholder={t.messagePh} rows={5} required /></label><button type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? t.sending : <>{t.send} <span>↗</span></>}</button><p className={`form-status ${formStatus}`} aria-live="polite">
      {formStatus === "success" && t.success}
      {formStatus === "error" && <>{t.errorA} <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>.</>}
    </p></form></div></section>
    <footer className="footer shell"><div className="brand footer-brand">KONG DESIGNS<span>®</span></div><p>{t.footer}</p><div><a href="#top">{t.top}</a><small>© {new Date().getFullYear()} Kong Designs</small></div></footer>
    <ExperienceAssistant config={kongDesignsExperience} />
  </main>;
}
