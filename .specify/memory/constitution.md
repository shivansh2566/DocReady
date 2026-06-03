# DocReady — Project Constitution

## Mission
DocReady helps Indian citizens know exactly which documents to carry before visiting any government office — eliminating wasted trips due to missing paperwork.

## Core Principles

### 1. Citizen First
Every decision must reduce friction for the end user. The app must work for people with low digital literacy, slow internet, and small screens. If a feature adds confusion, it does not belong here.

### 2. No Backend Complexity Without Clear Need
The current architecture is intentionally frontend-only. Any proposal to add a backend must justify why it cannot be solved in the frontend. Simplicity is a feature.

### 3. Accuracy Over Completeness
A shorter, accurate checklist is better than a long, uncertain one. Document requirements must be verified against official government sources. Do not guess.

### 4. Offline First
The app must work after initial load with no network. Any feature that breaks offline usage requires explicit justification and fallback handling.

### 5. No Personal Data
DocReady never stores, transmits, or logs any user data. No analytics that track individuals. No login. No cookies with personal info.

## Coding Standards

### JavaScript
- ES5 compatible for maximum browser support
- No external runtime dependencies
- Functions must be pure where possible — logic in `app.logic.js`, DOM in `app.js`
- All business logic must have corresponding unit tests in `app.logic.test.js`
- Minimum 80% line/function/statement coverage, 70% branch coverage

### HTML/CSS
- Mobile-first responsive design
- Must pass HTMLHint validation (`.htmlhintrc` config)
- Accessibility: all interactive elements must have ARIA labels or visible labels

### Data
- Service data lives in `services.json` — no hardcoded checklist data in JS
- Language strings live in `en.json` — no hardcoded UI text in HTML/JS

## Quality Rules
- All PRs must pass CI pipeline before merge
- No secrets or tokens in source code (enforced by gitleaks)
- Pre-commit hooks must pass locally before pushing
- CHANGELOG.md must be updated for every release

## What We Do NOT Do
- No dark patterns
- No paywalls or premium features
- No ads
- No data monetisation
- No features that work only for urban/English-only users
