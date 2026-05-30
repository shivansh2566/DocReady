# Contributing to DocReady

Thank you for being part of the DocReady team! This guide explains how we work together on this project.

---

## 👥 Team Roles and Responsibilities

| Role | Responsibilities |
|---|---|
| Frontend Developer | HTML structure, CSS styling, JavaScript logic, mobile layout, Vercel deployment, Capacitor APK |
| Python Developer | services.json data structure, data research/scraping scripts, Telugu translations |
| Researcher | Document requirement verification, content writing, demo pitch, user testing |

---

## 🌿 Branching Strategy

We use a simple branching model:

```
main   → stable, working code only (never push directly here)
dev    → active development branch
feature/xxx → individual feature branches
```

### Workflow

```bash
# Always branch off dev
git checkout dev
git checkout -b feature/your-feature-name

# Make your changes, then push
git add .
git commit -m "feat: describe what you did"
git push origin feature/your-feature-name

# Open a Merge Request into dev on code.swecha.org
```

---

## 📝 Commit Message Format

Use clear, short commit messages using this format:

```
feat:  add Telugu language toggle
fix:   checklist not rendering on mobile
data:  add passport document requirements
style: improve mobile layout for checklist screen
docs:  update README with setup steps
refac: split inline script into app.js
```

---

## 📁 File Ownership

| File / Folder | Owner |
|---|---|
| index.html | Frontend Developer |
| style.css | Frontend Developer |
| app.js | Frontend Developer + Python Developer (data part) |
| data/services.json | Python Developer |
| lang/en.json, lang/te.json | Python Developer + Researcher |
| android/ | Frontend Developer |
| README.md, USER_MANUAL.md | Researcher |
| AGENTS.md | Frontend Developer |

---

## ✅ Before Submitting a Merge Request

Check all of these before opening a Merge Request into dev:

- [ ] Tested on mobile screen size (360×640 minimum)
- [ ] All 6 service flows tested end-to-end
- [ ] JSON in data/services.json is valid (use jsonlint.com)
- [ ] No console errors in browser DevTools
- [ ] WhatsApp share produces readable text
- [ ] Copy button works
- [ ] Print layout looks clean (Ctrl+P to preview)
- [ ] Code is readable and commented where needed

---

## 🚫 Rules

- Never push directly to `main`
- Never commit `node_modules/` or `android/build/`
- Never remove the official disclaimer from the checklist screen
- Always verify document requirements from official government sources before adding data
