import { FormEvent, useEffect, useMemo, useState } from "react";
import { annualTotal, ModuleId, mxn, resolvePricingOffer } from "./pricingConfig";

type Billing = "monthly" | "annual";
type QuoteStatus = "idle" | "sending" | "success" | "error";

export default function PricingPage() {
  const context = useMemo(()=>resolvePricingOffer(window.location.search),[]);
  const { offer, source, prospect } = context;
  const [selected,setSelected] = useState<Set<ModuleId>>(()=>new Set(context.preselected));
  const [billing,setBilling] = useState<Billing>("monthly");
  const [quoteOpen,setQuoteOpen] = useState(false);
  const [status,setStatus] = useState<QuoteStatus>("idle");
  const activeAutomation = [...selected].some((id)=>id!=="care" && id!=="personalized-avatar");

  useEffect(()=>{
    if (!activeAutomation) return;
    setSelected((current)=>current.has("care") ? current : new Set([...current,"care"]));
  },[activeAutomation]);

  const chosen = offer.modules.filter((item)=>selected.has(item.id));
  const implementation = offer.offerPrice + chosen.reduce((sum,item)=>sum+item.implementation,0);
  const monthly = chosen.reduce((sum,item)=>sum+item.monthly,0);
  const annual = annualTotal(monthly,offer.annualDiscount);

  function toggle(id:ModuleId) {
    setSelected((current)=>{
      const next = new Set(current);
      if (next.has(id)) {
        if (id==="care" && activeAutomation) return next;
        next.delete(id);
        if (id==="avatar") next.delete("personalized-avatar");
      } else {
        const item=offer.modules.find((module)=>module.id===id);
        if (item?.requires) next.add(item.requires);
        next.add(id);
      }
      return next;
    });
  }

  async function submitQuote(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form=new FormData(event.currentTarget);
    const payload={
      ...Object.fromEntries(form.entries()),
      offerId:offer.id, vertical:offer.vertical, source, prospect, billing,
      selectedSystems:chosen.map((item)=>item.id),
      selectedSystemNames:chosen.map((item)=>item.name),
      implementation,
      recurring:billing==="annual" ? annual : monthly,
    };
    try {
      const response=await fetch("/api/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      if(!response.ok) throw new Error("quote_failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return <main className="pricing-page">
    <nav className="pricing-nav pricing-shell">
      <a className="pricing-brand" href="/">KONG DESIGNS<span>®</span></a>
      <span>COTIZADOR PRIVADO</span>
    </nav>

    <header className="pricing-hero pricing-shell">
      <p className="pricing-eyebrow">{offer.promoLabel || "CONFIGURA TU PROYECTO"}</p>
      <h1>{offer.headline}</h1>
      <p>{offer.subhead}</p>
    </header>

    <div className="pricing-layout pricing-shell">
      <section className="pricing-builder">
        <article className="pricing-base">
          <div><small>INCLUIDO</small><h2>{offer.baseName}</h2><p>Diseño premium, contenido configurado para tu clínica, implementación y una primera versión rápida.</p><em>{offer.firstVersion}</em></div>
          <div className="pricing-base__price">
            {offer.offerPrice<offer.regularPrice && <del>{mxn(offer.regularPrice)}</del>}
            <strong>{mxn(offer.offerPrice)}</strong><span>implementación</span>
          </div>
        </article>

        <div className="pricing-section-head">
          <div><small>AGREGA SÓLO LO QUE NECESITAS</small><h2>Haz que tu web trabaje.</h2></div>
          <div className="billing-toggle" aria-label="Frecuencia de pago">
            <button className={billing==="monthly"?"is-active":""} onClick={()=>setBilling("monthly")}>Mensual</button>
            <button className={billing==="annual"?"is-active":""} onClick={()=>setBilling("annual")}>Anual <span>−20%</span></button>
          </div>
        </div>

        <div className="module-list">
          {offer.modules.map((item)=>{
            const checked=selected.has(item.id);
            const locked=item.id==="care" && activeAutomation;
            return <button type="button" className={"module-row "+(checked?"is-selected ":"")+(item.recommended?"is-recommended":"")} onClick={()=>toggle(item.id)} key={item.id} aria-pressed={checked}>
              <span className="module-check">{checked?"✓":"+"}</span>
              <span className="module-copy"><span>{item.name}{item.recommended&&<b>RECOMENDADO PARA MÉXICO</b>}</span><strong>{item.result}</strong><small>{item.usage}</small>{item.note&&<em>{item.note}</em>}</span>
              <span className="module-price"><strong>{item.implementation?"+ "+mxn(item.implementation):"Incluido"}</strong><small>{item.monthly?"+ "+mxn(item.monthly)+"/mes":"Sin mensualidad"}</small>{locked&&<em>Requerido</em>}</span>
            </button>;
          })}
        </div>
        <p className="usage-note">Los límites están pensados para una clínica pequeña o mediana. Si tu volumen crece, podemos ampliar tu capacidad sin cambiar tu sistema.</p>
      </section>

      <aside className="pricing-summary">
        <div>
          <small>TU CONFIGURACIÓN</small>
          <h2>Lista para cotizar.</h2>
          <ul><li><span>Website</span><b>✓</b></li>{chosen.map((item)=><li key={item.id}><span>{item.name}</span><b>✓</b></li>)}</ul>
          <div className="summary-total"><span>Implementación hoy</span><strong>{mxn(implementation)}</strong></div>
          <div className="summary-total recurring"><span>{billing==="annual"?"Operación anual · ahorras 20%":"Operación mensual"}</span><strong>{mxn(billing==="annual"?annual:monthly)}</strong><small>{billing==="annual"?"por año":"por mes"}</small></div>
          <button className="quote-button" onClick={()=>{setQuoteOpen(true);setStatus("idle");}}>Recibir mi cotización <span>↗</span></button>
          <p>Validamos alcance y precio antes de pedirte cualquier pago.</p>
        </div>
      </aside>
    </div>

    <section className="pricing-process pricing-shell">
      <small>EL SIGUIENTE PASO</small><h2>Tu parte toma minutos.</h2>
      <div><span>01</span><p>Envías esta configuración.</p><span>02</span><p>Revisamos que todo encaje.</p><span>03</span><p>Recibes el enlace para comenzar.</p></div>
    </section>

    {quoteOpen&&<div className="quote-modal" role="dialog" aria-modal="true" aria-label="Recibir cotización">
      <button className="quote-backdrop" onClick={()=>setQuoteOpen(false)} aria-label="Cerrar" />
      <div className="quote-card">
        <button className="quote-close" onClick={()=>setQuoteOpen(false)}>×</button>
        {status==="success"?<div className="quote-success"><span>✓</span><h2>Listo. Ya tenemos tu configuración.</h2><p>Revisaremos que todo encaje y te enviaremos el enlace para comenzar.</p></div>:<>
          <small>COTIZACIÓN BREVE</small><h2>Cuéntanos lo esencial.</h2><p>No es el onboarding. Esto sólo nos permite validar tu cotización.</p>
          <form onSubmit={submitQuote}>
            <label>Nombre de la clínica<input name="clinicName" required /></label>
            <label>Ciudad<input name="city" required /></label>
            <label>Sitio web actual<input name="websiteUrl" type="url" placeholder="https:// (si aplica)" /></label>
            <label>Marca<select name="brandMode" required defaultValue=""><option value="" disabled>Elige una opción</option><option value="keep">Quiero conservarla</option><option value="renew">Quiero renovarla</option><option value="unsure">No estoy seguro</option></select></label>
            <label>Nombre de contacto<input name="contactName" required /></label>
            <label>WhatsApp<input name="whatsapp" type="tel" required /></label>
            <label>Email<input name="email" type="email" required /></label>
            <input className="quote-honeypot" name="companyFax" tabIndex={-1} autoComplete="off" />
            <button disabled={status==="sending"}>{status==="sending"?"Enviando…":"Enviar configuración"} <span>↗</span></button>
            {status==="error"&&<p className="quote-error">No pudimos enviarla. Intenta de nuevo o escríbenos por WhatsApp.</p>}
          </form>
        </>}
      </div>
    </div>}
  </main>;
}
