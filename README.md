# Kong Designs

Code-controlled Kong Designs website, migrated from ChatGPT Sites to Vite/React and prepared for GitHub + Netlify.

## Architecture

- `src/site/`: the Kong Designs visual and content layer.
- `src/experience/`: Engine contract and UI behavior.
- `src/experience/verticals/`: reusable defaults and rules for a type of business.
- `src/experience/clients/`: company-specific integrations, identity, persona and knowledge-base IDs.
- `netlify/functions/`: server-side adapters for chat, calls, events, and contact intake.
- `.env.example`: site wiring only; secrets remain in Netlify.

The runtime composes `Core + Vertical Pack + Client Config`; it does not contain Dental or Kong Designs copy. Kong Designs is the second real consumer of the WDM contract. After Dental and Kong Designs pass end-to-end QA, only the identical client/server behavior moves into shared `@wdm/*` packages. Each site keeps its own composition and CSS.

## Current Kong Designs wiring

- Booking: GoHighLevel embed configured in `src/experience/clients/kongDesigns.ts`.
- Phone: shared MX/Canada/US country selector, normalized to E.164 before it reaches a function.
- Chat: connected to the shared WDM Experience Engine, including Telegram human handoff, operator replies, and session continuity.
- Call: UI and request contract use the shared voice route; live regional transfer is handled by the WDM Human Handoff Service.
- Avatar: stays explicitly unavailable until a Kong Designs D-ID agent is assigned.

## Local development

```bash
npm install
npm run dev
```

Use `netlify dev` when testing the serverless endpoints locally.

## Required Netlify variables

- `N8N_WDM_CHAT_WEBHOOK`
- `N8N_WDM_CALL_WEBHOOK`
- `N8N_WDM_EVENT_WEBHOOK`
- `N8N_WDM_CONTACT_WEBHOOK`
- `N8N_WDM_HANDOFF_STATUS_WEBHOOK`
- `N8N_WDM_SHARED_SECRET`
- `VITE_WDM_BOOKING_URL`
- `VITE_WDM_AVATAR_URL`

`VITE_` variables are public by design. Never put secrets in them.
