# Quality Gates, Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Answers [Q1] and [Q2] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/ci-pipeline/ci-pipeline-questions.md`
- The commands themselves: `aidlc/spaces/default/intents/261015-todo-frontend/construction/ci-pipeline/ci-config.md`
- Build and Test results (what each gate measured on the finished app): `aidlc/spaces/default/intents/261015-todo-frontend/construction/build-and-test/test-results.md`
- Coverage floor and testing practice: `aidlc/spaces/default/memory/team.md` (Testing Posture)

## Gates that must pass before a merge to `main`

| Gate | Threshold | Blocks merge | Last result (2026-10-26) |
|------|-----------|--------------|--------------------------|
| Format (Prettier) | no unformatted file | yes | pass |
| Lint (ESLint) | zero errors | yes | pass |
| Tests, including the three speed guards, no coverage tracking | all pass (247) | yes | pass |
| Line coverage (everything except the speed guards) | at least 80% of lines; never lowered | yes | 97.96% |
| Build | succeeds | yes | pass |
| `npm audit` | read by the person | no | 0 vulnerabilities |

## Rules

- A gate is never weakened, skipped or disabled to make a merge pass (project rule: never weaken a test; coverage floor not to be lowered).
- The merge is done by a person after the full command passes; there is no automatic merge.

## Not covered by any gate

These need a real browser and a person, and no gate checks them (carried from Build and Test): painted speed with 100 tasks, the four target browsers, colour contrast, dialog focus trap and Esc, two real tabs, screen-reader announcements, the visual look.

## Assumptions & Open Questions

- [assumption] The gates run on the machine of the person merging; there is no server run.
- Open question: none beyond the hosting decision named in `ci-config.md`.
