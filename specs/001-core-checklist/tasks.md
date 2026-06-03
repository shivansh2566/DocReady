# Tasks: Core Document Checklist

## Status: [x] Complete

---

## Phase 1 — Data & Logic
- [x] **Task 1.1** — Define services.json schema and populate all 6 services
  - Files: `services.json`
  - Done when: all 6 services have questions and checklists populated
- [x] **Task 1.2** — Implement `buildChecklist()` pure function
  - Files: `app.logic.js`
  - Done when: returns correct required/optional lists for all combinations
- [x] **Task 1.3** — Populate UI strings in en.json
  - Files: `en.json`
  - Done when: no hardcoded UI text in HTML or JS

## Phase 2 — UI
- [x] **Task 2.1** — Build service selector screen
  - Files: `index.html`, `style.css`
  - Done when: 6 service cards render on mobile and desktop
- [x] **Task 2.2** — Build question flow
  - Files: `app.js`
  - Done when: 2–3 questions render per service and answers are captured
- [x] **Task 2.3** — Build checklist output screen
  - Files: `app.js`, `style.css`
  - Done when: required/optional sections render with progress tracker
- [x] **Task 2.4** — Implement WhatsApp share and copy-to-clipboard
  - Files: `app.js`
  - Done when: share works on mobile, copy works on desktop

## Phase 3 — Tests & Quality
- [x] **Task 3.1** — Write unit tests for all logic functions
  - Files: `app.logic.test.js`
  - Done when: 80%+ line/function/statement coverage, 70%+ branch
- [x] **Task 3.2** — Manual QA on Android Chrome
- [x] **Task 3.3** — CI pipeline passing (lint, test, gitleaks)

## Phase 4 — Docs
- [x] **Task 4.1** — README.md with features, tech stack, setup instructions
- [x] **Task 4.2** — USER_MANUAL.md with step-by-step usage guide
- [x] **Task 4.3** — CONTRIBUTING.md with contribution guidelines
