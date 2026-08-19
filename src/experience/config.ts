import type { ExperienceSiteConfig } from "./types";

export const kongDesignsExperience: ExperienceSiteConfig = {
  siteId: "kong-designs",
  brandName: "Kong Designs",
  assistantName: "K",
  assistantRole: "Asistente de proyectos",
  locale: "es-MX",
  greeting: "Hola. Cuéntame qué negocio tienes o qué te gustaría construir.",
  quickReplies: [
    "Quiero mejorar mi sitio actual",
    "¿Cuánto cuesta una página?",
    "Quiero probar una llamada",
  ],
  bookingUrl: import.meta.env.VITE_WDM_BOOKING_URL || "https://links.wealthery.com/widget/booking/wQg4ZWJ50LXEuF87HApR",
  avatarUrl: import.meta.env.VITE_WDM_AVATAR_URL || undefined,
  whatsappUrl: "https://wa.me/16724721285?text=Hola%20Alex%2C%20quiero%20platicar%20sobre%20un%20sitio%20web%20para%20mi%20negocio.",
  allowedActions: ["START_BOOKING", "REQUEST_AI_CALL", "START_AI_AVATAR", "OPEN_WHATSAPP", "BOOK_KONG_CALL"],
  context: {
    businessType: "web design studio",
    audience: "ambitious local businesses and service brands",
    offer: "strategy, custom websites, conversion systems and AI-powered customer experiences",
    voice: "direct, warm, practical, confident and never corporate",
  },
};
