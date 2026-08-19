import type { ExperienceClientConfig, ExperienceSiteConfig, ExperienceVerticalPack } from "./types";

export function composeExperienceConfig(
  vertical: ExperienceVerticalPack,
  client: ExperienceClientConfig,
): ExperienceSiteConfig {
  const assistant = { ...vertical.defaultAssistant, ...client.assistant };

  return {
    version: "2.0",
    siteId: client.siteId,
    verticalId: vertical.id,
    clientId: client.clientId,
    brandName: client.brandName,
    personaId: client.personaId,
    knowledgeBaseId: client.knowledgeBaseId,
    assistantName: assistant.name,
    assistantRole: assistant.role,
    locale: client.locale,
    greeting: assistant.greeting,
    quickReplies: assistant.quickReplies,
    phone: client.phone,
    integrations: client.integrations,
    allowedActions: vertical.allowedActions,
    context: vertical.behavior,
  };
}
