# NFR Requirements Questions: add-task (U1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Non-functional requirements NFR1 to NFR8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Contracts: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Stack already decided in `docs/ARCHITECTURE.md` (React with functional components and hooks, Vite, plain CSS, Vitest and React Testing Library) and in the team practices (JavaScript, Prettier, ESLint, 80% line coverage).

Context: nearly every target for this Unit is already fixed by NFR1 to NFR8 (under 100 ms for 100 tasks, desktop browsers, keyboard and contrast rules, plain-text titles, no data leaving the browser, the five-field task shape, 80% coverage, all-or-nothing saving). Scalability, reliability and observability need no separate targets for a single-user page that runs in the browser with no server. The questions below are only the choices that are still open.

## Question 1: How is the "under 100 ms for 100 tasks" target checked?

NFR1 sets the target. A test run in a simulated browser (the kind Vitest uses) does not measure real screen speed.

A. A timing test in the test suite that adds a task to a list of 100 and fails if the work takes longer than a generous limit (for example 100 ms of code time), plus a manual look in a real browser at the first checkpoint.
B. Only a manual check in a real browser at the Unit checkpoint.
C. Only the timing test in the suite.
X. Other (please specify)

[Answer]: A

## Question 2: Which versions of the tools?

`docs/ARCHITECTURE.md` names React and Vite but no versions.

A. The current stable version of React, Vite and the test tools at the time the project is created, fixed by the lock file so every developer gets the same ones.
B. React 18 (the long-established release) with a matching Vite, fixed by the lock file.
X. Other (please specify)

[Answer]: A

## Question 3: Which package manager?

A. npm: it comes with Node, so nothing extra must be installed by the developers who will join.
B. pnpm: faster installs and a stricter folder layout, but each developer installs it first.
X. Other (please specify)

[Answer]: A

## Question 4: How is the accessibility rule checked?

NFR3 requires an automated accessibility scan with no contrast or missing-name failures.

A. Add an automated accessibility check (axe, through a test helper) to the component tests, plus a manual keyboard run at the checkpoint.
B. Manual keyboard and screen-reader checks only; no automated scan.
X. Other (please specify)

[Answer]: A

## Question 5: Should known-vulnerability checks on installed packages be part of the merge checks?

The merge checks already include formatting, linting and the full test suite. Phase 1 sends no data anywhere and runs locally, so the risk is small, but installed packages can carry known problems.

A. Run the package manager's vulnerability report before each merge and read it; do not block the merge on it.
B. Run it and block the merge on high-severity findings.
C. Do not run it in phase 1.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] Scalability, reliability and observability need no targets for this Unit: one person, one browser, no server, and failures are already covered by the functional design (notices and the all-or-nothing save). Those three documents are not produced for a UI Unit.
- [assumption] The 100 ms and 100 tasks figures are NFR1's; this stage adds no new numbers.
- [assumption] No content security policy or hosting headers apply in phase 1, because nothing is hosted.

## Consolidated Summary Confirmation

- Speed: a timing test with a generous code-time limit in the suite, plus a manual look in a real browser at the first checkpoint (Q1: A).
- Tools: current stable React, Vite and test tools at project creation, fixed by the lock file (Q2: A).
- Package manager: npm (Q3: A).
- Accessibility: an automated axe check in the component tests, plus a manual keyboard run at the checkpoint (Q4: A).
- Vulnerabilities: run the package report before each merge and read it; it does not block the merge (Q5: A).

- Looks correct
- Request changes

[Answer]: Looks correct
