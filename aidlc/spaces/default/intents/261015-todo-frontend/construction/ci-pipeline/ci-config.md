# CI Configuration, Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Answers [Q1] and [Q2] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/ci-pipeline/ci-pipeline-questions.md`
- Team practices (trunk-based `main`, squash-merge, no build server, no budget): `aidlc/spaces/default/memory/team.md`
- Build and Test results and commands: `aidlc/spaces/default/intents/261015-todo-frontend/construction/build-and-test/build-and-test-summary.md` and `test-results.md`
- Per-unit code summaries: `aidlc/spaces/default/intents/261015-todo-frontend/construction/filter-tasks/code-generation/code-summary.md` (and the other eight units' summaries beside it)

## Decision

There is no CI server and no account (Q1: A). The CI pipeline is one local command, run by the person merging before every merge to `main`:

```
npm run verify --prefix frontend
```

It is defined in `frontend/package.json` as the `verify` script and stops at the first failing step:

| Order | Step | Command | Fails when |
|-------|------|---------|------------|
| 1 | Format check | `npm run format:check` | any file is not Prettier-formatted |
| 2 | Lint | `npm run lint` | any ESLint error |
| 3 | Full test suite | `npm run test` (`vitest run`) | any test fails, including the three "under 100 ms" speed guards |
| 4 | Coverage gate | `npm run test:coverage:gate` | line coverage under 80% (`thresholds: { lines: 80 }` in `frontend/vite.config.js`) or any test fails |
| 5 | Build | `npm run build` | the build fails |

`npm audit --prefix frontend` is run and read by the person but is not part of the command and never blocks (Q2: A).

## Why the speed guards run in step 3 only

The three NFR1 speed guards (the tests whose names contain "under 100 ms of code time") measure code time. Coverage tracking slows the code, so under coverage they missed the 100 ms limit by 1 to 40 ms in repeated runs on this machine while passing without it. Step 3 runs every test, the speed guards included, without coverage tracking. Step 4 then runs everything else with coverage (244 of 247 tests; line coverage 97.96%, still well over the floor). No test was changed, skipped in the suite or weakened, and the coverage threshold is unchanged. If a speed guard misses in step 3 by a few milliseconds when the machine is busy, run `npx vitest run src/App.test.jsx` from `frontend/` before treating it as a real slowdown.

## Branches and merging

Trunk-based, as the team recorded: one `main`, a short branch per task, squash-merge. The command above is run on the branch before the merge. Git is not yet initialised in this folder (the branch `task-filter` named in the work records needs it); the practice takes effect once it is.

## Artifacts and deployment

No artifact repository: the build output (`frontend/dist/`) is static files that nobody publishes in phase 1. No deployment target is invented; what "deployed" means for phase 1 is the person's open decision recorded in `team.md`.

## Assumptions & Open Questions

- [assumption] The person merging has Node 24.11 or newer (the `engines` field in `frontend/package.json`) and has run `npm install --prefix frontend` once.
- [assumption] A free hosted CI (for example GitHub Actions) can be added later with the same five steps; it is not decided.
- Open question: where the app is hosted, if anywhere, in phase 1 (see `team.md`, Deployment).
