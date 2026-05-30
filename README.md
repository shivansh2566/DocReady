# 📋 DocReady
### One visit. Everything ready.

DocReady is a free mobile-friendly website that tells you **exactly which documents to carry** before visiting any government office in India — so you never show up unprepared again.

---

## 🚩 The Problem

Millions of Indians waste time and money making repeated trips to government offices simply because they did not know which documents to bring. Existing solutions like UMANG and individual government websites either bury this information in long PDFs or provide generic lists that do not account for a citizen's specific situation.

---

## ✅ The Solution

> **Select a government service → answer 2–3 quick questions → get a personalised document checklist instantly. Share it on WhatsApp or print it before you leave home.**

DocReady is not a generic information portal. It is a guided checklist assistant that helps users know exactly what to carry before visiting a government office.

---

## 🎯 Features

| Feature | Status |
|---|---|
| 6 common government services | ✅ |
| State-wise filtering (Ration Card) | ✅ |
| 2–3 question personalisation flow | ✅ |
| Required + Optional document sections | ✅ |
| Document ready progress tracker | ✅ |
| WhatsApp share button | ✅ |
| Copy checklist as text | ✅ |
| Print-friendly layout | ✅ |
| Official portal links per service | ✅ |
| Before-visit general tips | ✅ |
| Mobile responsive design | ✅ |
| Works offline after loading | ✅ |
| No login required | ✅ |
| No personal data stored | ✅ |
| Language toggle (stub) | ✅ |

---

## 📋 Supported Services

| Service | What it covers |
|---|---|
| 🛂 Passport | Fresh (adult/minor, normal/Tatkal) + Renewal |
| 🪪 Driving Licence | Learner, Permanent, Renewal × Two-Wheeler/Four-Wheeler/Both |
| 🏠 Ration Card | New/Update/Add member × APL/BPL/AAY × 6 states |
| 🗳️ Voter ID | Fresh, Correction, Transfer, Duplicate |
| 📄 Income Certificate | Scholarship, Scheme, Legal, Other × Self/Family |
| 📜 Caste Certificate | SC/ST/OBC/EWS × Fresh/Duplicate |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES5 compatible) |
| Checklist Logic | Rule-based JavaScript decision tree |
| Data | JavaScript object (services, questions, checklists) |
| Backend | **None** — current PoC is fully frontend |
| Future Backend | Python / Flask |
| Deployment | Vercel (static hosting) |
| Android APK | Capacitor (future) |
| Version Control | Git + code.swecha.org |

---

## 📁 Project Structure

```
docready/
├── index.html          ← Main app entry point (HTML only)
├── style.css           ← All styling
├── app.js              ← All logic, data, and functions
├── data/
│   └── services.json   ← Reference copy of service data
├── lang/
│   └── en.json         ← English strings (multilingual ready)
├── README.md
├── CONTRIBUTING.md
├── USER_MANUAL.md
└── AGENTS.md
```

---

## 🚀 Getting Started

### Run locally (no build step needed)

```bash
git clone https://code.swecha.org/yourteam/docready.git
cd docready
# Open index.html directly in your browser
```

On macOS:
```bash
open index.html
```

On Windows: double-click `index.html` in File Explorer.

On Linux:
```bash
xdg-open index.html
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# From the docready folder
vercel
```

Select: Framework → Other, Build Command → (leave empty), Output Directory → (leave empty), then Deploy.

### Build Android APK (future)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
npx cap sync android
npx cap open android
```

---

## 👥 Team

| Name | Role |
|---|---|
| Sohan | UI development, Content research |
| Shivansh | APK build, JSON generation, Content research |
| Ashish | Data structuring, Website deployment, Content research |

---

## 🔮 Future Scope

- Full multilingual support (Telugu, Hindi, Tamil, Kannada)
- More services (Birth Certificate, Death Certificate, Domicile, Property Registration)
- SMS reminder before appointment
- Offline-first PWA with service worker
- Python/Flask backend for dynamic data
- Admin dashboard for data updates
- OCR-based document validator
- Scheme recommendation engine

---

## 🏆 Built At

**CivicTech Hackathon 2026 — Hyderabad, Telangana**  
Theme: CivicTech | Focus: India-level civic issue
