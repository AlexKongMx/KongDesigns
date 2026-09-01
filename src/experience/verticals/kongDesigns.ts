import type { ExperienceVerticalPack } from "../types";

export const kongDesignsVerticalPack: ExperienceVerticalPack = {
  id: "web-design-studio",
  defaultAssistant: {
    name: "K",
    role: "Asistente de proyectos",
    greeting: "Cuéntame qué negocio tienes o qué te gustaría construir.",
    quickReplies: [
      "Quiero mejorar mi sitio actual",
      "¿Cuánto cuesta una página?",
      "Quiero probar una llamada",
    ],
  },
  allowedActions: [
    "START_BOOKING",
    "REQUEST_AI_CALL",
    "START_AI_AVATAR",
    "OPEN_WHATSAPP",
    "REQUEST_HUMAN_CALLBACK",
    "BOOK_KONG_CALL",
  ],
  behavior: {
    businessType: "web design studio",
    audience: "ambitious local businesses and service brands",
    offer: "strategy, custom websites, conversion systems and AI-powered customer experiences",
    voice: "direct, warm, practical, confident and never corporate",
  },
};
