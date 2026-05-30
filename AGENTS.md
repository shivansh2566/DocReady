# AGENTS.md — DocReady

This file describes any AI agents, automation scripts, or intelligent components used in the DocReady project.

---

## 🤖 Overview

DocReady's current PoC runs entirely in the browser as a **frontend-only application**. No external AI API is used. No personal documents are uploaded. No personal data is stored or sent to any server.

The core "intelligence" is a lightweight **rule-based JavaScript decision tree** that personalises document checklists based on the user's answers — fast, offline, and privacy-safe.

Python/Flask is planned for a future production backend to serve dynamic data and enable features like SMS alerts, scheme recommendations, and admin dashboards.

---

## 🧠 Agent 1 — Checklist Decision Agent

| Field | Details |
|---|---|
| Type | Rule-based decision tree |
| Language | JavaScript |
| Location | app.js |
| Runs in | Browser (client-side only) |
| External API | None |

**Purpose:** Takes the user's selected service and question answers, then returns the correct document checklist from the in-memory data structure.

**How it works:**

```
User selects service
        ↓
Agent loads service config from SERVICES array
        ↓
Agent presents follow-up questions from QUESTIONS object
        ↓
User answers each question
        ↓
Agent builds a lookup key from the answers (e.g. "fresh-adult-normal")
        ↓
Agent matches key to CHECKLISTS object (exact match first, then fuzzy match)
        ↓
For state-specific services, agent appends state to key (e.g. "new-bpl-telangana")
        ↓
Personalised document list is rendered on screen
```

**Example input:**
```json
{
  "service": "passport",
  "answers": {
    "type": "fresh",
    "age": "adult",
    "speed": "normal"
  }
}
```

**Example output:**
```json
{
  "required": [
    {"doc": "Aadhaar Card", "type": "Original + Photocopy", "tip": "Self-attest the photocopy"},
    {"doc": "PAN Card", "type": "Original + Photocopy", "tip": "Accepted as identity proof"},
    {"doc": "Birth Certificate / Class 10 Certificate", "type": "Original + Photocopy", "tip": "Any one as Date of Birth proof"},
    {"doc": "Proof of Address", "type": "Original + Photocopy", "tip": "Bill must be within last 3 months"},
    {"doc": "Passport-size Photographs", "type": "2 copies", "tip": "White background, 3.5×3.5 cm"}
  ],
  "optional": [
    {"doc": "Marriage Certificate", "type": "Photocopy", "tip": "If spouse name to be included"}
  ]
}
```

---

## 🐍 Agent 2 — Data Builder Script (Offline / Dev only)

| Field | Details |
|---|---|
| Type | Python script |
| Location | scripts/build_data.py (planned) |
| Runs at | Development time only — not at runtime |

**Purpose:** Used during development to research and structure document requirements from government websites into the JavaScript data format used in app.js.

**Libraries planned:**
- `requests` — HTTP requests to government websites
- `BeautifulSoup4` — HTML parsing
- `json` — JSON output formatting

---

## 🔒 Privacy and Safety

- No user data is collected, stored, or transmitted.
- No documents are uploaded to any server.
- No personal information (name, Aadhaar number, etc.) is entered into DocReady.
- All processing happens in the user's browser.
- The service works offline after the initial page load.

---

## 📊 Current Status

| Component | Status |
|---|---|
| Checklist Decision Agent (JS) | ✅ Live in PoC |
| Data Builder Script (Python) | 🔜 Planned for development use |
| SMS Reminder Agent | 🔮 Future scope |
| Scheme Recommender Agent | 🔮 Future scope |
| Chatbot Agent | 🔮 Future scope |
| OCR Document Validator | 🔮 Future scope |

---

## 🔮 Future Agent Ideas (Post-Hackathon)

| Agent | Purpose |
|---|---|
| SMS Reminder Agent | Remind users of their appointment with the checklist via SMS |
| Scheme Recommender | Suggest related government schemes the user may qualify for |
| Language Support | Translate checklist to Telugu, Hindi, Tamil, Kannada |
| Chatbot Agent | Let users ask "what do I need for X?" in natural language |
| Checklist Validator | Cross-check submitted documents against requirements using OCR |
