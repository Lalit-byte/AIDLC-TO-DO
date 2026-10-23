# Delivery Planning Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Units and dependencies: `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md` and `unit-of-work-dependency.md`
- Contracts and their open questions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`

Context: the work is nine Units of Work (U1 add-task to U9 empty-guidance). This stage decides the order they are built in. A **Bolt** is one build pass over a piece of the work (one or more Units), ending in something that runs. The team practices already say the first Bolt is the thin end-to-end slice (add a task and see it, which is U1). No team was formed in Ideation, so every Bolt is built by the developer agent (AI); no question is asked about owners.

## Question 1: Ordering after the first slice

After U1 (the thin slice that must come first), how should the other eight Units be ordered? Each Unit adds one capability on top of the files U1 creates.

A. Risk first: build the hardest and least certain Unit (U6 keep-tasks, which handles storage failures and two-tab sync) early, then the simple features.
B. Value first: build what people use most (complete, edit, delete, filter) first, and leave U6 and the small display lines for last.
C. Dependency order only: take the Units in number order (U2, U3, ... U9), with no extra scoring.
D. Mixed: build the core actions first (U2, U3, U4), then U6, then the display Units (U5, U7, U8, U9).
X. Other (please specify)

[Answer]: D

## Question 2: How big is one Bolt?

A. One Unit per Bolt: nine Bolts. Smallest steps, each ending in one squash-merged commit, and the easiest to review.
B. Group the tiny Units: U8 and U9 (each only one fixed line or message) share a Bolt, and everything else is one Unit per Bolt: eight Bolts.
C. Group related Units: for example, U2 with U7 (both read the complete state), and U8 with U9: about six Bolts.
D. Thin slices across Units: not recommended here because every Unit already is a thin vertical slice.
X. Other (please specify)

[Answer]: B

## Question 3: Build one at a time, or several at the same time?

Several Units change the same files (`App`, `UseTasks`, `TaskItem`, `TaskStorage`, `TaskList`), so building at the same time is likely to produce merge conflicts.

A. One after another (serial). Matches the recorded Construction setting and avoids shared-file conflicts.
B. Allow the Units that do not depend on each other to be built at the same time where they touch different files (for example U8 and U9).
C. Build every independent Unit at the same time and resolve the conflicts at merge.
X. Other (please specify)

[Answer]: A

## Question 4: When to settle U6's two open decisions

U6 keep-tasks depends on two decisions still open from Domain Design and Contract Design: what a later save does after a failed save (and whether it may overwrite damaged data, which FR6.3 says to leave as it is), and which block assigns ids when a create fails. The first one also affects U1's first save.

A. Settle them in U6's own design step (Functional Design), and have U1 ship a simple save that does not yet refuse to overwrite.
B. Settle them now, in this stage, so U1 and U6 are built to the same rule from the start.
C. Settle them at the start of Functional Design for U1, before any code is written.
X. Other (please specify)

[Answer]: C

## Question 5: What does "deployed" mean for phase 1?

Phase 1 runs locally with no cloud accounts and no budget, but the team default is "deploy on merge to a staging environment", and no staging target exists. This is the open question recorded in the team practices.

A. Nothing is deployed in phase 1. "Done" means the app runs with the local development server and the full test suite, formatting check and lint pass before each merge.
B. As A, and also check that the production build works locally (build it and open it with a local preview).
C. Decide later, together with hosting in phase 2.
X. Other (please specify)

[Answer]: B

## Question 6: What worries you most about this build?

Pick all that apply. The Units behind each worry are placed early in the sequence.

A. Several Units editing the same files and clashing (shared-file conflicts).
B. Storage failures and two-tab sync (U6) being harder than expected.
C. Finishing within the 7 calendar days.
D. Keyboard use and accessibility of every control.
E. Reaching the 80% line-coverage floor.
X. Other (please specify)

[Answer]: C

## Assumptions & Open Questions

- [assumption] All Bolts are built by the developer agent (AI), because Team Formation was skipped for this `mvp` plan. Not a question; correct me at the gate if a person will own a Bolt.
- [assumption] The first Bolt is U1 add-task (the thin end-to-end slice), as recorded in the team practices (Walking Skeleton section of the team practices). The real project check that proves it is chosen after this stage's questions, in the Construction verification command step.
- Open question: whether the first-merge checks (Prettier, ESLint, test setup, all created in U1) are acceptable as part of the first Bolt, or deserve a Bolt of their own. Asked only if the answers above leave it unclear.

## Consolidated Summary Confirmation

- Order: U1 first (thin slice), then U2, U3, U4, then U6, then U5, U7, U8, U9 (Q1: D).
- Bolt size: eight Bolts; U8 and U9 share one, every other Unit is its own (Q2: B).
- Execution: one Bolt after another (Q3: A).
- U6's two open decisions are settled at the start of Functional Design, before U1 is coded (Q4: C).
- "Deployed" in phase 1 means a local build check; nothing is hosted (Q5: B).
- Biggest worry: the 7-day deadline; coverage is not a special worry (Q6: C).

- Looks correct
- Request changes

[Answer]: Looks correct
