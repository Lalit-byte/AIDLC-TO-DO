# Practices Discovery Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Draft practices and evidence: `team-practices.md` and `evidence.md` in this folder (suggested defaults from the space rules `aidlc/spaces/default/memory/org.md` and from the project's `docs/RULES.md`, `docs/ARCHITECTURE.md`).
- Constraints from earlier stages: local run only, no cloud accounts, no budget, 7 calendar days, desktop browsers only.

This is a new project, so every practice below starts as a suggested default that you confirm or change. Each answer becomes a team practice saved for later stages.

## Q1. How will the work be tracked and combined?

Git (version control that keeps a history of changes) is not set up in this folder yet. The suggested default is trunk-based development: one main line of work, short-lived branches resolved within a day or two, each task squashed into a single commit on `main`. `docs/RULES.md` already says the same once Git is enabled.

A. Use Git, follow the suggested default (short-lived branches, squash-merge into `main`)
B. Use Git, but commit straight to `main` because I work alone
C. No Git for phase 1
D. Several developers will join, use Git with the suggested default
X. Other (please specify)

[Answer]: D

## Q2. Build a thin end-to-end slice first? A walking skeleton is a minimal version that runs the whole way through, built first to prove the pieces connect before the real features go in.

For this app the slice would be adding a task and seeing it in the list (FR-1). The scope backlog already puts adding a task first.

A. Yes, build the thin slice first and check it runs before the other features
B. No, build the features in the backlog order without a separate slice step
C. Not sure
X. Other (please specify)

[Answer]: A

## Q3. When should tests be written relative to the code?

The suggested default is test-after: build a piece (component, hook or storage), then write and run its tests before moving to the next piece. The project's tools are Vitest and React Testing Library.

A. Test-after: write the piece, then its tests (suggested default)
B. Test-first (TDD): write a failing test, then the code that makes it pass
C. Describe behavior in plain scenarios first (BDD), then code, then tests
D. A mix (please explain in Other)
X. Other (please specify)

[Answer]: A

## Q4. How strict should test coverage be, and how is it checked without an automated build server?

The space default for this kind of work is that at least 80% of lines are covered by tests and the tests run before anything is merged. No automated build server (CI) exists, because there are no cloud accounts and no budget.

A. Keep the 80% floor and run the full tests on my own machine before each merge
B. Keep the 80% floor and add a free automated build server later (record it as future work)
C. Different floor (please specify; note that a lower floor needs a reason and conflicts with the space default)
X. Other (please specify)

[Answer]: A

## Q5. What should "deployed" mean for phase 1?

The space default is to deploy to a staging area on every merge and to need a manual approval for production. Phase 1 runs only on your own machine, with no cloud accounts and no public launch.

A. No deployment in phase 1; "done" means the app runs locally and the full tests pass; revisit hosting with phase 2
B. Deploy to a free static host after all (please name it in Other)
C. Not sure
X. Other (please specify)

[Answer]: C

## Q6. Which language and code-style tools should the code follow?

`docs/RULES.md` already asks for Prettier (automatic formatting) and ESLint (automatic checks for mistakes), and for React function components with hooks. `docs/ARCHITECTURE.md` names the storage file `taskStorage.js` (JavaScript), while the task shape is written as a TypeScript type, and no configuration files exist yet.

A. JavaScript with Prettier and ESLint, as the project documents say
B. TypeScript with Prettier and ESLint
C. JavaScript for now; decide on TypeScript when phase 2 starts
X. Other (please specify)

[Answer]: B

## Q7. Which of these rules from `docs/RULES.md` are hard rules that must never be broken? (select all that apply)

Hard rules are saved so every later stage obeys them. Ones you leave out stay as guidance only.

A. Always keep all browser storage and network access inside the storage service folder (`src/services/`)
B. Always trim and check input at the boundary (title 1 to 200 characters)
C. Always handle and show errors instead of catching them silently
D. Always pass Prettier formatting and ESLint checks
E. Always run the full test suite before marking a task done
F. Never hardcode secrets (use environment variables)
G. Never use class components; function components and hooks only
H. Never weaken a test to make it pass
X. Other (please specify)

[Answer]: H

## Q8. Follow-up on Q5 (not sure what "deployed" means): which should be recorded until you decide?

Phase 1 runs only on your own machine, with no cloud accounts, no budget and no public launch (Scope Definition and Feasibility), so the only answer consistent with the project so far is no deployment.

A. Record "no deployment in phase 1; done means it runs locally and the full tests pass; hosting is revisited with phase 2"
B. Leave deployment unrecorded for now (the space default of staging on every merge would stay in effect)
X. Other (please specify)

[Answer]: B

## Q9. Follow-up on Q7 (hard rules): no answer came back for the first group of rules. Which of these should be hard rules?

Only "Never weaken a test to make it pass" was chosen from the second group. The first group could not be read, so it is asked again, one choice per rule. Rules you leave out stay as guidance only. (select all that apply)

A. Always keep browser storage and network access inside `src/services/`
B. Always trim and check input at the boundary (title 1 to 200 characters)
C. Always handle and show errors instead of catching them silently
D. Always pass Prettier formatting and ESLint checks
E. None of these four are hard rules
X. Other (please specify)

[Answer]: A, B, C, D

## Q10. Follow-up on Q6 (TypeScript): the project documents say JavaScript. Which should be changed?

`docs/ARCHITECTURE.md` names the storage file `taskStorage.js` and `docs/PRD.md` has no language. You chose TypeScript, so the file would be `taskStorage.ts`.

A. Treat TypeScript as the decision and update `docs/ARCHITECTURE.md` (and `docs/RULES.md` if it names JavaScript) when Construction starts
B. Keep JavaScript after all; TypeScript can come in phase 2
X. Other (please specify)

[Answer]: B

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
