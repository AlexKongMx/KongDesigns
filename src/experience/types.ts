export type ExperienceAction =
  | "START_BOOKING"
  | "REQUEST_AI_CALL"
  | "START_AI_AVATAR"
  | "OPEN_WHATSAPP"
  | "BOOK_KONG_CALL";

export type ExperienceView = "chat" | "booking" | "call" | "avatar";

export type ExperienceProfile = {
  name: string;
  email: string;
  phone: string;
};

export type ExperienceMessage = {
  role: "assistant" | "user";
  content: string;
};

export type ExperienceSiteConfig = {
  siteId: string;
  brandName: string;
  assistantName: string;
  assistantRole: string;
  locale: "es-MX" | "en-US";
  greeting: string;
  quickReplies: string[];
  bookingUrl?: string;
  avatarUrl?: string;
  whatsappUrl?: string;
  allowedActions: ExperienceAction[];
  context: {
    businessType: string;
    audience: string;
    offer: string;
    voice: string;
  };
};

export type ExperienceReply = {
  reply: string;
  quickReplies?: string[];
  action?: ExperienceAction | null;
  intent?: string | null;
};
