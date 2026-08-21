import type { Config, Context } from "@netlify/functions";
import { json, text, webhookHeaders } from "./_shared/http";

const allowedOffers = new Set(["standard","dental-launch"]);
const allowedSystems = new Set(["chat","phone","avatar","personalized-avatar","whatsapp","sms","care"]);

export default async (request:Request,_context:Context) => {
  if(request.method!=="POST") return json({error:"method_not_allowed"},405);
  let raw:Record<string,unknown>;
  try { raw=await request.json(); } catch { return json({error:"invalid_json"},400); }
  if(text(raw.companyFax,200)) return json({ok:true});
  const clinicName=text(raw.clinicName,160);
  const city=text(raw.city,120);
  const contactName=text(raw.contactName,120);
  const whatsapp=text(raw.whatsapp,50);
  const email=text(raw.email,254);
  const websiteUrl=text(raw.websiteUrl,500);
  const brandMode=text(raw.brandMode,30);
  const requestedOffer=text(raw.offerId,80);
  const offerId=allowedOffers.has(requestedOffer)?requestedOffer:"standard";
  const selectedSystems=Array.isArray(raw.selectedSystems)?raw.selectedSystems.map((value)=>text(value,40)).filter((value)=>allowedSystems.has(value)):[];
  if(!clinicName||!city||!contactName||!whatsapp||!/^\\S+@\\S+\\.\\S+$/.test(email)) return json({error:"required_fields"},400);
  const webhook=Netlify.env.get("N8N_WDM_CONTACT_WEBHOOK");
  if(!webhook) return json({error:"quote_not_configured"},503);
  const payload={
    type:"pricing_quote", source:"kongdesigns-pricing",
    clinicName,city,contactName,whatsapp,email,websiteUrl,brandMode,offerId,selectedSystems,
    vertical:text(raw.vertical,40),ref:text(raw.source,80),prospect:text(raw.prospect,100),billing:text(raw.billing,20),
    implementation:Number(raw.implementation)||0,recurring:Number(raw.recurring)||0,
  };
  try {
    const response=await fetch(webhook,{method:"POST",headers:webhookHeaders(),body:JSON.stringify(payload),signal:AbortSignal.timeout(12000)});
    if(!response.ok) return json({error:"quote_upstream_error"},502);
  } catch { return json({error:"quote_unavailable"},502); }
  return json({ok:true});
};

export const config:Config={path:"/api/quote"};
