export type ExperienceAction =
  | "START_BOOKING"
  | "REQUEST_AI_CALL"
  | "START_AI_AVATAR"
  | "OPEN_WHATSAPP"
  | "REQUEST_HUMAN_CALLBACK"
  | "BOOK_KONG_CALL";

export type ExperienceView = "chat" | "booking" | "call" | "avatar";

export type PhoneCountry = "MX" | "US" | "CA";

export type ExperienceProfile = {
  name: string;
  email: string;
  phone: string;
};

export type ExperienceMessage = {
  role: "assistant" | "user";
  content: string;
};

export type ExperienceVerticalPack = {
  id: string;
  defaultAssistant: {
    name: string;
    role: string;
    greeting: string;
    quickReplies: string[];
  };
  allowedActions: ExperienceAction[];
  behavior: {
    businessType: string;
    audience: string;
    offer: string;
    voice: string;
  };
};

export type ExperienceClientConfig = {
  clientId: string;
  siteId: string;
  brandName: string;
  locale: "es-MX" | "en-US";
  personaId: string;
  knowledgeBaseId: string;
  assistant?: Partial<ExperienceVerticalPack["defaultAssistant"]>;
  phone: {
    defaultCountry: PhoneCountry;
    allowedCountries: PhoneCountry[];
  };
  integrations: {
    booking?: {
      provider: "ghl";
      mode: "embed" | "api";
      endpoint?: string;
      url?: string;
      timezone?: string;
      title: string;
      description: string;
    };
    call?: {
      provider: "twilio";
      enabled: boolean;
      title: string;
      description: string;
      successMessage: string;
    };
    avatar?: {
      provider: "did";
      enabled: boolean;
      url?: string;
    };
    whatsapp?: {
      url: string;
    };
  };
};

export type ExperienceSiteConfig = {
  version: "2.0";
  siteId: string;
  verticalId: string;
  clientId: string;
  brandName: string;
  personaId: string;
  knowledgeBaseId: string;
  assistantName: string;
  assistantRole: string;
  locale: "es-MX" | "en-US";
  greeting: string;
  quickReplies: string[];
  phone: ExperienceClientConfig["phone"];
  integrations: ExperienceClientConfig["integrations"];
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
  handoffAction?: string | null;
  handoffId?: string | null;
  handoffStatus?: string | null;
};
