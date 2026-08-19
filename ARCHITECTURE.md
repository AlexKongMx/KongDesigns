# WDM Experience Architecture — Decision 001

## Goal

Run the same customer-experience capabilities across Dental and Kong Designs while preserving a completely independent visual/content layer for each site.

## Boundary

| Layer | Shared responsibility | Site responsibility |
| --- | --- | --- |
| Experience client | session, lead onboarding, chat state, action routing, call request, booking/avatar containers, tracking | labels, colors, assistant identity, enabled actions |
| Server adapters | validation, secret handling, n8n proxy, response contract, timeouts | `siteId`, business context, permitted actions |
| Automation | intent routing, action execution, calendar/call handoff, CRM/event delivery | vertical knowledge and site-specific instructions |
| Website | none | composition, copy, imagery, portfolio, responsive design |

## Stable request contract

Every experience request includes:

```json
{
  "version": "2.0",
  "siteId": "kong-designs",
  "site": {},
  "profile": {},
  "sessionId": "...",
  "visitorId": "..."
}
```

Site-specific instructions live in configuration, never inside the shared assistant component.

## Endpoint mapping

| Capability | Common route |
| --- | --- |
| Chat | `POST /api/experience-chat` |
| Call | `POST /api/experience-call` |
| Tracking | `POST /api/experience-event` |
| Contact | `POST /api/contact` |

Dental can keep its current `/api/demo-*` routes during migration. A thin compatibility adapter can forward those requests to the v2 contract so production is not disrupted.

## Extraction rule

Do not publish a shared package after only one consumer. First run Dental and Kong Designs end-to-end, compare the differences, and extract only the code that remains identical. The expected package boundary is:

- `@wdm/experience-react`: UI, state, action routing, session helpers.
- `@wdm/experience-netlify`: request validation and webhook proxy helpers.
- Site repositories keep their own configuration, website code, and environment values.

This avoids a monorepo migration and does not disturb the locked Dental production workflow.

## Rollout

1. Publish Kong Designs from its own GitHub repository to a Netlify preview.
2. Connect booking immediately; connect chat/call/event webhooks through the v2 payload.
3. Assign the Kong Designs D-ID agent through `VITE_WDM_AVATAR_URL`.
4. QA desktop/mobile and all four capabilities.
5. Add Dental compatibility adapters without redesigning or replacing its current production source.
6. Extract the identical core into versioned WDM packages.
