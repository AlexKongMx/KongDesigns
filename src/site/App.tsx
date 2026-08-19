"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ExperienceAssistant } from "../experience/ExperienceAssistant";
import { kongDesignsExperience } from "../experience/config";

type Project = { name: string; type: string; url: string; image: string; preview?: { brand: string; title: ReactNode }; layout?: "reef" };

const projects: Project[] = [
  { name: "Dental Master", type: "Website · Healthcare", url: "https://dentalclinic.kongdesigns.com/", image: "/work/dental-master.webp", preview: { brand: "GNUX DENTAL", title: <>Tu sonrisa.<br />Tu historia.<br /><em>Tu plan.</em></> } },
  { name: "Kongllective", type: "Website · Creative", url: "https://kongllective.com/", image: "/work/kongllective.webp" },
  { name: "Sunbound México", type: "Website · Travel", url: "https://sunbound-mexico.alexkong.chatgpt.site/", image: "/work/sunbound-mexico.webp" },
  { name: "Reef Solutions", type: "Website · Sustainability", url: "https://reef-solutions.netlify.app/", image: "/work/reef-solutions.jpg", layout: "reef" },
  { name: "Kong Coaching", type: "Website · Education", url: "https://kongcoaching.net/", image: "/work/kong-coaching.webp" },
  { name: "Alex Kong 3D", type: "Portfolio · 3D Artist", url: "https://alexkong3d.com/", image: "/work/alex-kong-3d.webp" },
  { name: "Canadian Credit Foundations", type: "Website · Financial", url: "https://canadiancreditfoundations.ca/", image: "/work/canadian-credit-foundations.webp" },
  { name: "Qué Onda Planeta", type: "Website · Sustainability", url: "https://queondaplaneta.com/", image: "/work/que-onda-planeta.webp" },
  { name: "AMTG", type: "Website · Mobility", url: "https://amtg.co/", image: "/work/amtg.webp" },
  { name: "MotoMarketLatam", type: "Website · Advisory", url: "https://motomarketlatam.com/", image: "/work/moto-market-latam.webp" },
  { name: "Motosinapsis", type: "Website · Mobility", url: "https://motosinapsis.com/", image: "/work/moto-sinapsis.webp" },
  { name: "Kong Coaching Schools", type: "Website · Education", url: "https://schools.kongcoaching.net/", image: "/work/kong-coaching-schools.webp" },
];

const whatsapp = "https://wa.me/16724721285?text=Hola%20Alex%2C%20quiero%20platicar%20sobre%20un%20sitio%20web%20para%20mi%20negocio.";

export default function Home() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function sendEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });

      if (!response.ok) throw new Error("Lead delivery failed");
      formElement.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <main>
      <nav className="nav shell" aria-label="Navegación principal">
        <a className="brand" href="#top" aria-label="Kong Designs, inicio">KONG DESIGNS<span>®</span></a>
        <div className="nav-links"><a href="#work">Trabajo</a><a href="#services">Servicios</a><a href="#contact">Contacto</a></div>
        <a className="nav-cta" href={whatsapp} target="_blank" rel="noreferrer"><span className="nav-cta-label">WhatsApp</span><span className="nav-cta-arrow">↗</span></a>
      </nav>

      <header className="hero shell" id="top">
        <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
        <div className="eyebrow"><i /> Diseño web para negocios con ambición</div>
        <h1>Tu negocio merece<br />verse <em>poca madre.</em></h1>
        <div className="hero-bottom">
          <p>Diseñamos sitios rápidos, memorables y listos para convertir. Estrategia, diseño y copy trabajando juntos para hacer crecer tu negocio.</p>
          <div className="hero-actions">
            <a className="button primary" href="#work">Ver proyectos <span>↓</span></a>
          </div>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>DESIGN · BUILD · GROW ·</span><b>K</b></div>
      </header>

      <section className="ticker" aria-label="Servicios"><div>
        <span>ESTRATEGIA</span><b>✳</b><span>DISEÑO WEB</span><b>✳</b><span>IDENTIDAD</span><b>✳</b><span>CONVERSIÓN</span><b>✳</b>
        <span>ESTRATEGIA</span><b>✳</b><span>DISEÑO WEB</span><b>✳</b><span>IDENTIDAD</span><b>✳</b><span>CONVERSIÓN</span><b>✳</b>
        <span>ESTRATEGIA</span><b>✳</b><span>DISEÑO WEB</span><b>✳</b><span>IDENTIDAD</span><b>✳</b><span>CONVERSIÓN</span><b>✳</b>
        <span>ESTRATEGIA</span><b>✳</b><span>DISEÑO WEB</span><b>✳</b><span>IDENTIDAD</span><b>✳</b><span>CONVERSIÓN</span><b>✳</b>
      </div></section>

      <section className="work shell" id="work">
        <div className="section-heading">
          <div><p className="kicker">01 — TRABAJO SELECCIONADO</p><h2>Sitios seleccionados</h2></div>
          <p>Una selección de websites que hemos diseñado y construido.</p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <a className="project-card" href={project.url} target="_blank" rel="noreferrer" key={project.name} aria-label={`Abrir ${project.name}`}>
              <div className="project-visual">
                {project.layout === "reef" ? (
                  <div className="reef-card-art" aria-hidden="true">
                    <div className="reef-card-nav"><b>REEF.</b><span>Solutions &nbsp;&nbsp; Approach &nbsp;&nbsp; Projects &nbsp;&nbsp; Team</span><i>GET IN TOUCH</i></div>
                    <div className="reef-card-body">
                      <div className="reef-card-copy">
                        <small>● RESOURCE EFFICIENCY · MALAYSIA</small>
                        <strong>Cut Energy<br />Costs.<br /><em>Keep the<br />Savings.</em></strong>
                        <p>We cut energy and operating costs for commercial buildings across Malaysia.</p>
                        <div><b>Get in Touch&nbsp; →</b><span>◉ &nbsp;See case studies</span></div>
                      </div>
                      <div className="reef-card-case">
                        <img src="/work/reef-solutions.jpg" alt="" />
                        <div className="reef-case-label"><b>Allianz Malaysia HQ</b><small>Menara Allianz Sentral, KL Sentral</small><span>Case Study ↓</span></div>
                        <div className="reef-stats"><b>16,400<small>kWh/month saved</small></b><b>1.4yr<small>payback period</small></b><b>RM8.8k<small>avg monthly savings</small></b></div>
                      </div>
                    </div>
                  </div>
                ) : <img src={project.image} alt={`Portada del sitio ${project.name}`} loading="lazy" />}
                {project.preview && <div className="project-preview" aria-hidden="true"><span>{project.preview.brand}</span><strong>{project.preview.title}</strong><small>AGENDA UNA VALORACIÓN ↗</small></div>}
                <span className="index">{String(index + 1).padStart(2, "0")}</span><span className="view">VISITAR <b>↗</b></span>
              </div>
              <div className="project-meta"><h3>{project.name}</h3><p>{project.type}</p></div>
            </a>
          ))}
        </div>
      </section>

      <section className="services shell" id="services">
        <div className="services-intro"><p className="kicker">02 — QUÉ HACEMOS</p><h2>Bonito por fuera.<br />Potente por dentro.</h2></div>
        <div className="service-list">
          <article><span>01</span><h3>Estrategia</h3><p>Clarificamos qué debe comunicar el sitio, a quién y qué acción debe provocar.</p></article>
          <article><span>02</span><h3>Websites</h3><p>Sitios únicos, rápidos y optimizados para móvil que hacen justicia a tu negocio.</p></article>
          <article><span>03</span><h3>Conversión</h3><p>Copy, llamadas a la acción y recorridos que convierten visitas en conversaciones.</p></article>
        </div>
      </section>

      <section className="contact" id="contact"><div className="shell contact-grid">
        <div className="contact-copy">
          <p className="kicker">03 — SIGUIENTE PROYECTO</p><h2>Hagamos algo<br /><em>que destaque.</em></h2>
          <p className="lead">Cuéntame qué estás construyendo. Te respondo personalmente con ideas y un siguiente paso claro.</p>
          <div className="direct-links">
            <a href={whatsapp} target="_blank" rel="noreferrer"><span>WhatsApp</span><b>+1 672 472 1285 ↗</b></a>
            <a href="mailto:alex@kongdesigns.com"><span>Correo</span><b>alex@kongdesigns.com ↗</b></a>
            <a href="tel:+16724721285"><span>Teléfono</span><b>+1 (672) 472-1285 ↗</b></a>
          </div>
        </div>
        <form className="contact-form" onSubmit={sendEmail}>
          <input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label>Tu nombre<input name="name" type="text" placeholder="Nombre" required /></label>
          <label>Tu correo<input name="email" type="email" placeholder="tu@negocio.com" required /></label>
          <label>Negocio<input name="business" type="text" placeholder="Nombre de tu negocio" /></label>
          <label>¿Qué quieres construir?<textarea name="message" placeholder="Un poco sobre el proyecto, tus metas y tiempos…" rows={5} required /></label>
          <button type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Enviando…" : <>Enviar proyecto <span>↗</span></>}</button>
          <p className={`form-status ${formStatus}`} aria-live="polite">
            {formStatus === "success" && "Listo. Ya llegó tu mensaje; Alex te responde pronto."}
            {formStatus === "error" && <>No se pudo enviar. Intenta otra vez o escríbele por <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>.</>}
          </p>
        </form>
      </div></section>

      <footer className="footer shell">
        <div className="brand footer-brand">KONG DESIGNS<span>®</span></div><p>Diseño digital para negocios con ambición.</p>
        <div><a href="#top">Volver arriba ↑</a><small>© {new Date().getFullYear()} Kong Designs</small></div>
      </footer>
      <ExperienceAssistant config={kongDesignsExperience} />
    </main>
  );
}
