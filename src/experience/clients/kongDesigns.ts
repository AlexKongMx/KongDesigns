import type { ExperienceClientConfig } from "../types";

const defaultBookingUrl = "https://links.wealthery.com/widget/booking/w206Pa3qPOKohBQV1sos";

export const kongDesignsClient: ExperienceClientConfig = {
  clientId: "kong-designs",
  siteId: "kong-designs",
  brandName: "Kong Designs",
  locale: "es-MX",
  personaId: "kong-designs-k-v1",
  knowledgeBaseId: "kong-designs-services-v1",
  phone: {
    defaultCountry: "MX",
    allowedCountries: ["MX", "CA", "US"],
  },
  integrations: {
    booking: {
      provider: "ghl",
      mode: "api",
      endpoint: "/api/experience-booking",
      url: import.meta.env.VITE_WDM_BOOKING_URL || defaultBookingUrl,
      timezone: "America/Vancouver",
      title: "Agenda una llamada",
      description: "Escoge una hora aquí mismo para platicar sobre tu proyecto.",
    },
    call: {
      provider: "twilio",
      enabled: true,
      title: "Prueba una llamada",
      description: "El asistente te llama y puede explicarte opciones o ayudarte a agendar.",
      successMessage: "Listo. Tu llamada se está enviando. Deberías recibirla en los próximos 30 segundos.",
    },
    avatar: {
      provider: "did",
      enabled: Boolean(import.meta.env.VITE_WDM_AVATAR_URL),
      url: import.meta.env.VITE_WDM_AVATAR_URL || undefined,
    },
    whatsapp: {
      url: "https://wa.me/16724721285?text=Hola%20Alex%2C%20quiero%20platicar%20sobre%20un%20sitio%20web%20para%20mi%20negocio.",
    },
  },
};
