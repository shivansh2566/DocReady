# Changelog

All notable changes to **DocReady** will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Full multilingual support (Telugu, Hindi, Tamil, Kannada)
- Additional services: Birth Certificate, Death Certificate, Domicile, Property Registration
- SMS appointment reminder before office visit
- Offline-first PWA with service worker and caching
- Python / Flask backend for dynamic data serving
- Admin dashboard for data updates without a code change
- OCR-based document validator
- Scheme recommendation engine based on user profile

---

## [1.0.0] — 2026-05-30

Initial public release. Submitted at **CivicTech Hackathon 2026 — Hyderabad, Telangana**.

### Added
- **6 government services** with personalised document checklists:
  - 🛂 Passport — Fresh (adult/minor, normal/Tatkal) + Renewal
  - 🪪 Driving Licence — Learner, Permanent, Renewal × vehicle type
  - 🏠 Ration Card — New/Update/Add member × APL/BPL/AAY × 6 states
  - 🗳️ Voter ID — Fresh, Correction, Transfer, Duplicate
  - 📄 Income Certificate — purpose × applicant type
  - 📜 Caste Certificate — SC/ST/OBC/EWS × Fresh/Duplicate
- Rule-based JavaScript decision tree for instant checklist personalisation (no backend required)
- 2–3 follow-up questions per service to tailor results to the user's exact situation
- Separate **Required** and **Optional** document sections per checklist
- **Document-ready progress tracker** — mark each document as gathered
- **WhatsApp share** button to send the checklist before leaving home
- **Copy checklist as text** button for any messaging app
- **Print-friendly** layout (Ctrl+P / browser print)
- Official government portal links per service
- Before-visit general tips panel
- State-wise filtering for Ration Card (6 states supported at launch)
- Mobile-responsive design (tested down to 360 × 640 px)
- Works offline after the initial page load (no service worker yet — all logic is inline)
- No login, no account, no personal data stored or transmitted
- Language toggle stub (English active; regional languages planned)
- Live demo deployed to GitHub Pages: https://doc-ready.vercel.app/

### Project structure established
- `index.html` — single-page app entry point
- `style.css` — full stylesheet
- `app.js` — all logic, data, and decision-tree functions
- `data/services.json` — reference copy of service data
- `lang/en.json` — English strings (multilingual-ready architecture)
- `README.md`, `CONTRIBUTING.md`, `USER_MANUAL.md`, `AGENTS.md`

---

[Unreleased]: https://code.swecha.org/yourteam/docready/compare/v1.0.0...HEAD
[1.0.0]: https://code.swecha.org/yourteam/docready/releases/tag/v1.0.0
