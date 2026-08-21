export type ModuleId = "chat" | "phone" | "avatar" | "personalized-avatar" | "whatsapp" | "sms" | "care";

export type PricingModule = {
  id: ModuleId;
  name: string;
  result: string;
  implementation: number;
  monthly: number;
  usage: string;
  note?: string;
  recommended?: boolean;
  requires?: ModuleId;
};

export type PricingOffer = {
  id: string;
  vertical: string;
  headline: string;
  subhead: string;
  baseName: string;
  regularPrice: number;
  offerPrice: number;
  promoLabel?: string;
  firstVersion: string;
  annualDiscount: number;
  modules: PricingModule[];
  preselected: ModuleId[];
};

const modules: PricingModule[] = [
  { id:"chat", name:"AI Chat", result:"Responde preguntas comunes aunque recepción esté ocupada.", implementation:2990, monthly:299, usage:"≈ 200 conversaciones completas al mes" },
  { id:"phone", name:"AI Phone Receptionist", result:"Contesta llamadas, orienta y ayuda a agendar cuando tu equipo no puede.", implementation:3990, monthly:699, usage:"≈ 60 minutos, normalmente 15–20 llamadas", note:"Un número dedicado administrado por Kong Designs puede tener un costo adicional." },
  { id:"avatar", name:"AI Avatar", result:"Una recepcionista digital que tus pacientes pueden ver y escuchar.", implementation:4990, monthly:799, usage:"≈ 30 minutos de conversación al mes" },
  { id:"personalized-avatar", name:"Avatar personalizado", result:"Configuramos una recepcionista visual alineada con tu clínica.", implementation:3990, monthly:0, usage:"Creación y configuración inicial", requires:"avatar" },
  { id:"whatsapp", name:"WhatsApp AI", result:"Continúa la conversación donde ya están tus pacientes.", implementation:4990, monthly:599, usage:"≈ 100 conversaciones al mes", note:"Sujeto a uso razonable y costos de mensajería del proveedor.", recommended:true },
  { id:"sms", name:"SMS Assistant", result:"Confirma citas y da seguimiento sin perseguir pacientes.", implementation:3990, monthly:399, usage:"Uso de SMS se cobra por separado según consumo." },
  { id:"care", name:"Kong Care", result:"Hosting, monitoreo, respaldos, mantenimiento, actualizaciones y cambios pequeños razonables.", implementation:0, monthly:1990, usage:"Infraestructura y mantenimiento continuo", note:"Requerido mientras haya sistemas de automatización o AI activos." },
];

export const PRICING_OFFERS: Record<string, PricingOffer> = {
  standard: {
    id:"standard", vertical:"default",
    headline:"Construye el sistema que necesita tu negocio.",
    subhead:"Empieza con una web extraordinaria y agrega sólo los sistemas que necesitas.",
    baseName:"Website cinematográfico", regularPrice:32900, offerPrice:32900,
    firstVersion:"Primera versión en menos de una semana bajo condiciones normales de respuesta.",
    annualDiscount:.20, modules, preselected:[],
  },
  "dental-launch": {
    id:"dental-launch", vertical:"dental",
    headline:"Construye el sistema que necesita tu clínica.",
    subhead:"Empieza con una web extraordinaria y agrega sólo los sistemas que necesitas.",
    baseName:"Website dental cinematográfico", regularPrice:32900, offerPrice:19900,
    promoLabel:"Precio de lanzamiento · primeras 15 clínicas",
    firstVersion:"Primera versión en menos de una semana bajo condiciones normales de respuesta.",
    annualDiscount:.20, modules, preselected:[],
  },
};

export const moduleIds = new Set<ModuleId>(modules.map((item)=>item.id));

export function resolvePricingOffer(search:string) {
  const params = new URLSearchParams(search);
  const requested = params.get("offer") || "standard";
  const offer = PRICING_OFFERS[requested] || PRICING_OFFERS.standard;
  const requestedSystems = (params.get("systems") || params.get("preselect") || "")
    .split(",")
    .filter((id): id is ModuleId => moduleIds.has(id as ModuleId));
  const source = (params.get("ref") || params.get("source") || "direct").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,80) || "direct";
  const prospect = (params.get("prospect") || params.get("demo") || "").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,100);
  return { offer, source, prospect, preselected:[...new Set([...offer.preselected,...requestedSystems])] };
}

export const mxn = (value:number) => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(value);
export const annualTotal = (monthly:number, discount:number) => Math.round((monthly*12*(1-discount))/10)*10;
