# Feature Spec: Core Document Checklist

## Overview
The core checklist feature lets any Indian citizen select a government service, answer 2–3 personalisation questions, and instantly receive a tailored list of documents to carry — without needing to browse PDFs or government websites.

## Problem Statement
Indian citizens make repeated trips to government offices because they don't know exactly which documents to bring for their specific situation. Generic lists online don't account for individual circumstances (age, category, state, purpose).

## User Stories

### Primary
- As a **first-time passport applicant**, I want to see exactly which documents to carry for a fresh adult passport application so that I don't make a wasted trip to the PSK.
- As a **citizen applying for a ration card**, I want to filter by my state and category (APL/BPL) so that I get a checklist relevant to my situation.

### Secondary
- As a **user with low literacy**, I want to share my checklist on WhatsApp so that a family member can help me gather documents.
- As a **user in a rural area with poor internet**, I want the checklist to work offline after first load so that I can reference it at the government office.

## Acceptance Criteria
- [ ] User can select from 6 supported government services
- [ ] User is shown 2–3 personalisation questions relevant to their service
- [ ] Checklist renders with required and optional document sections
- [ ] WhatsApp share and copy-to-clipboard work correctly
- [ ] App works offline after initial page load
- [ ] Checklist is accurate against official government sources

## Out of Scope
- Backend API or server-side rendering
- User accounts or saved checklists
- Services beyond the 6 currently supported

## References
- Passport Seva: https://www.passportindia.gov.in
- Driving Licence: https://sarathi.parivahan.gov.in
- Voter ID: https://voters.eci.gov.in
