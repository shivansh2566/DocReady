# Technical Plan: Core Document Checklist

## Tech Stack Decisions
- Frontend: HTML5 / CSS3 / Vanilla JS (ES5) — no framework needed for PoC
- Data: `services.json` for checklist data, `en.json` for UI strings
- Testing: Jest with jsdom environment
- Deployment: Vercel static hosting

## Architecture Overview
The app is fully frontend. `app.logic.js` contains pure functions for filtering and building checklists from `services.json`. `app.js` handles DOM manipulation and user interactions. This separation keeps logic testable without a browser.

## File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `index.html` | Core | Main app shell, service selector, question flow, checklist output |
| `style.css` | Core | Mobile-first responsive styles |
| `app.logic.js` | Core | Pure functions: getServices, getQuestions, buildChecklist |
| `app.js` | Core | DOM logic: render questions, render checklist, share/copy |
| `services.json` | Core | All service data, questions, and document requirements |
| `en.json` | Core | All UI strings for internationalisation readiness |

## Data Model
```json
{
  "serviceId": {
    "name": "Passport",
    "questions": [...],
    "checklists": {
      "fresh-adult-normal": {
        "required": [...],
        "optional": [...]
      }
    }
  }
}
```

## Edge Cases & Error Handling
- Unknown question combination → show generic full list with note
- Offline after load → service worker caches assets on first visit
- Mobile share API unavailable → fall back to WhatsApp URL scheme

## Testing Plan
- Unit tests for `buildChecklist()` covering all service/question combinations
- Unit tests for edge cases (missing data, unknown combinations)
- Manual test: open on Android Chrome with network disabled

## Rollout Notes
- Static deploy to Vercel — no build step required
- All assets must be self-contained (no CDN dependencies at runtime)
