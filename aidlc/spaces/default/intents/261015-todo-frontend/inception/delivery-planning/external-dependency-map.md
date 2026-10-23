# External Dependency Map: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Bolt plan: `bolt-plan.md` in this folder.
- Requirements and constraints (no server, no accounts, no cloud, no budget): `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Contracts: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Team practices (deployment conflict): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `delivery-planning-questions.md` in this folder, cited as [Q1] to [Q6].

## Summary

Phase 1 is fully contained: there is no server, no outside service, no data feed, no approval, and no other team's hand-off between you and a finished build. No Bolt (a build pass over one or more Units of Work) waits on anything outside this project.

| Item | Owner | Lead time | Bolt it blocks | If it slips |
|------|-------|-----------|----------------|-------------|
| None | none | none | none | not applicable |

## Things checked and found not to be dependencies

| Item | Why it is not a dependency |
|------|----------------------------|
| A backend or API | Phase 2. Phase 1 stores tasks in the browser and sends no task data anywhere (NFR5). |
| Accounts, login, other people's data | Out of scope; each browser keeps its own tasks. |
| Hosting or a staging environment | None exists and none is needed. "Deployed" in phase 1 means a local build check [Q5: B]. |
| A build server | None exists; the full suite runs locally before each merge (team practice). |
| Third-party packages | The project's own tools (React, Vitest, React Testing Library, Prettier, ESLint) are installed once in B1. They come from a public package registry, so B1 needs a working internet connection for installation; nothing else does. |
| Git | The team practices say Git is not yet set up in this folder; it must be (`git init`, first commit on `main`) before trunk-based work and squash-merge can start. This is a setup step inside your own project, not an outside party. |

## Assumptions & Open Questions

- [assumption] The package registry is reachable when B1 starts. Not confirmed.
- [assumption] You will set up Git before B1 is merged. Not confirmed; it is a prerequisite recorded in the team practices.
- Open question: what "deployed" means once hosting is revisited with phase 2. Deferred to phase 2 [Q5].
