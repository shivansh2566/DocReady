# Security Policy

## Scope

DocReady is a **frontend-only, static web application**. It runs entirely in the user's browser — no personal data is collected, no documents are uploaded, and no information is sent to any server.

That said, we take the security of our users seriously. If you find a vulnerability that could harm users (e.g., a malicious script injection, a compromised third-party dependency, a misleading link to a phishing site, or incorrect document information that could cause real-world harm to a citizen), please tell us privately so we can fix it before it is publicly disclosed.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x (current) | ✅ Yes |
| < 1.0 | ❌ No |

---

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report security issues by emailing the project team directly:

📧 **docready-security@proton.me** *(replace with your actual contact)*

Include as much detail as possible:

- A clear description of the vulnerability and its potential impact
- Steps to reproduce the issue (URL, browser, device if relevant)
- Any proof-of-concept code or screenshots
- Your suggested fix (optional but appreciated)

We will acknowledge your report within **48 hours** and aim to release a fix or mitigation within **7 days** for critical issues.

---

## What We Consider a Security Issue

| Category | Examples |
|----------|---------|
| **Content injection** | XSS via user-controlled input rendered in the DOM |
| **Data integrity** | Incorrect document requirements that could cause citizens to be turned away |
| **Supply-chain** | Compromised CDN assets or dependencies referenced in `index.html` |
| **Phishing risk** | External links that redirect to malicious sites |
| **Privacy** | Any unintended collection or leakage of user data |

---

## What Is Out of Scope

- Issues in browsers or operating systems themselves
- Social engineering attacks on team members
- Denial-of-service against the static hosting provider (Vercel / GitHub Pages)
- Theoretical vulnerabilities with no practical impact

---

## Responsible Disclosure

We follow a **coordinated disclosure** model:

1. Reporter submits issue privately.
2. Team confirms and investigates (≤ 48 h).
3. Fix is developed and tested.
4. Fix is deployed.
5. Reporter is credited in the release notes (with their permission).
6. Issue details may be shared publicly after the fix is live.

Thank you for helping keep DocReady safe for every citizen who uses it. 🙏
