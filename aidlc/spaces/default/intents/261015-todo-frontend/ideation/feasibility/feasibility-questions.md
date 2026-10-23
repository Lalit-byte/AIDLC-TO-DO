# Feasibility Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Project documents: `docs/PRD.md` (phase 1 requirements FR-1 to FR-7, localStorage persistence) and `docs/ARCHITECTURE.md` (React, Vite, plain CSS, Vitest).

Already answered in Intent Capture and not asked again: users are the general public, no accounts in phase 1, due dates/tags/drag-and-drop are left out, success is FR-1 to FR-7 passing plus under 100 ms responses.

## Q1. What is your (and any later developers') experience with React?

Decides how risky the basic React plan in `docs/ARCHITECTURE.md` (functional components and hooks) is for the people building it.

A. New to React; this project is how I am learning it
B. Some experience (built a small app before)
C. Comfortable with React and hooks
D. Mixed across the team
X. Other (please specify)

[Answer]: C

## Q2. Which browsers and devices must phase 1 work on?

The app keeps tasks in the browser's localStorage, which behaves slightly differently across browsers, so the supported set limits what we test.

A. Current desktop browsers only (Chrome, Edge, Firefox, Safari)
B. Current desktop and mobile browsers
C. Any browser including older versions
D. Not yet defined
X. Other (please specify)

[Answer]: A

## Q3. Where will phase 1 be run or hosted?

Because the general public is the audience, this decides whether phase 1 needs any hosting at all, and whether the tooling (Vite build) has to produce something deployable.

A. Locally on my machine only for now
B. A free static host (for example GitHub Pages, Netlify or Vercel)
C. A company or cloud account I already have
D. Not yet defined
X. Other (please specify)

[Answer]: A

## Q4. Are any AWS services or cloud accounts already in use for this project?

Phase 1 is a browser-only app, so none may be needed. The answer also tells us whether the phase 2 backend has an existing home.

A. No cloud accounts in use
B. AWS account available, phase 1 needs nothing from it
C. AWS account available and I want to host phase 1 there
D. Another cloud provider
X. Other (please specify)

[Answer]: A

## Q5. Does storing tasks only in each person's browser raise any privacy or regulatory concern for you?

Tasks are free text the user types, kept on the user's own device (localStorage), with no accounts and no data sent to a server in phase 1. Regulations such as GDPR apply mainly once data reaches a server.

A. No concern; nothing leaves the browser in phase 1
B. Concern: tasks may contain personal data, so a short privacy note is needed for the public
C. Regulatory requirement applies (please specify)
D. Not sure
X. Other (please specify)

[Answer]: D

## Q6. What are the time and budget limits for phase 1?

A. No deadline; spare-time learning project, no spend
B. A target date (please specify), no spend
C. A target date and a small budget (please specify)
D. Not yet defined
X. Other (please specify)

[Answer]: B

## Q7. Is there a required accessibility level for the public-facing interface?

A. No formal requirement; sensible defaults (labels, keyboard use, contrast)
B. Meet WCAG 2.1 AA
C. Meet a different standard (please specify)
D. Not yet defined
X. Other (please specify)

[Answer]: A

## Q8. Are there any blockers or competing priorities that could stop phase 1?

A. None
B. Limited time because of other work
C. Waiting on a decision or approval from someone else (please specify)
D. Not sure
X. Other (please specify)

[Answer]: A

## Q9. Follow-up on Q6 (target date, no spend): what is the target date for phase 1?

You chose a target date with no spend but did not give the date, and the feasibility assessment needs it to judge whether phase 1 fits.

A. Within 1 week
B. Within 2 to 4 weeks
C. Within 1 to 3 months
D. A specific date (please specify)
X. Other (please specify)

[Answer]: A

## Q10. Follow-up on Q5 (not sure about privacy): until you decide, which stance should this assessment record?

Since tasks stay on each person's own device and nothing is sent anywhere in phase 1, the safest default is to record privacy as a low risk to revisit when the phase 2 backend stores data on a server.

A. Record it as a low risk and revisit when phase 2 introduces server-side storage
B. Treat it as an open question that must be answered before phase 1 is approved
C. Add a short privacy note to phase 1 for the public
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
