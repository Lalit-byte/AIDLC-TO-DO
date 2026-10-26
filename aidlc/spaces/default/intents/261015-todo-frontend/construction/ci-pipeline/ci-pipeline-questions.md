# CI Pipeline Questions, Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Team practices (trunk-based `main`, squash-merge, no build server, no cloud accounts or budget, full suite run locally before every merge): `aidlc/spaces/default/memory/team.md`
- Build and Test results (the commands that passed: build, lint, format check, 247 tests, coverage 97.96%, audit 0): `aidlc/spaces/default/intents/261015-todo-frontend/construction/build-and-test/test-results.md` and `build-and-test-summary.md`
- Project documents `docs/RULES.md` and `docs/ARCHITECTURE.md`

Context: the app is a browser-only frontend with nothing to deploy yet and no artifact storage (no container images, no packages). The branch strategy is already fixed by the team: one `main`, short branches, squash-merge. Two choices are still open.

## Question 1: How should the checks run before a change is merged?

A. A single local command in `frontend/package.json` (for example `npm run verify`) that runs format check, lint, the full test suite with coverage, and the build, and stops at the first failure. Nobody needs an account or a server; the person merging runs it before every merge. This matches the team's current practice and budget.
B. A GitHub Actions workflow file in the repo that runs the same checks on every pull request, plus the local command from A. It is free for this size of project, but needs the project on GitHub and Git set up first, neither of which exists yet.
X. Other (please specify)

[Answer]: A

## Question 2: What must pass before a merge?

A. Format check, lint, all tests, the 80% line-coverage floor, and the build must pass. `npm audit` is run and read but does not block.
B. Everything in A, and `npm audit` must also report no high or critical issues.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] No artifact repository is needed in phase 1: the build output is static files that nobody publishes yet.
- [assumption] The NFR1 speed guards in `App.test.jsx` can miss by a few milliseconds when the whole suite runs at once; the gate runs the suite as it is and a near miss is re-run alone before it is treated as a real slowdown.
- Open question: where the app is hosted is not decided for phase 1 (see `team.md` Deployment); this stage does not invent a deployment target.

## Consolidated Summary Confirmation

- The checks run through one local command in `frontend/package.json` that runs format check, lint, the full tests with coverage and the build, stopping at the first failure; no CI server or account is added (Q1: A).
- Before a merge, format check, lint, all tests, the 80% line-coverage floor and the build must pass; `npm audit` is run and read but does not block (Q2: A).
- Everything else follows the team's practices: trunk-based `main` with squash-merge, no artifact repository, and no deployment target invented.

- Looks correct
- Request changes

[Answer]: Looks correct
