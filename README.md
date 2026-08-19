# Kong Designs

Code-controlled Kong Designs website, migrated from ChatGPT Sites to Vite/React and prepared for GitHub + Netlify.

## Architecture

- `src/site/`: the Kong Designs visual and content layer.
- `src/experience/`: reusable Experience Engine client contract and UI.
- `netlify/functions/`: server-side adapters for chat, calls, events, and contact intake.
- `.env.example`: site wiring only; secrets remain in Netlify.

The engine receives a site configuration instead of containing dental or Kong Designs copy. Kong Designs is the second real consumer of the WDM contract. After Dental and Kong Designs pass end-to-end QA, the stable client/server core can move into a shared `@wdm/experience-engine` package without moving either site's content or design.

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
- `N8N_WDM_SHARED_SECRET`
- `VITE_WDM_BOOKING_URL`
- `VITE_WDM_AVATAR_URL`

`VITE_` variables are public by design. Never put secrets in them.
