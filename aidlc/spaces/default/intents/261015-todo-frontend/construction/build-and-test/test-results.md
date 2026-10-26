# Test Results: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`; Test Strategy: standard.
- Commands as documented in `aidlc/spaces/default/intents/261015-todo-frontend/construction/build-and-test/build-instructions.md` and `integration-test-instructions.md`, run on 2026-10-26 from the repository root with `--prefix frontend` (Node 24.11.1, Windows).
- Per-unit commands in the nine `unit-test-instructions.md` files are subsets of the project-wide command and were not run separately (run once, not N times).
- Target matrix: `build-and-test-summary.md` in this folder.

## Commands run

| Check | Command | Exit | Result |
|-------|---------|------|--------|
| Build | `npm run build --prefix frontend` | 0 | Vite 8.3.4, 28 modules, `dist/index.html` 0.39 kB, CSS 5.19 kB (gzip 1.25), JS 232.46 kB (gzip 72.73), built in 248 ms |
| Lint | `npm run lint --prefix frontend` | 0 | No output, no problems |
| Format | `npm run format:check --prefix frontend` | 0 | All matched files use Prettier code style |
| Unit and integration tests | `npm run test --prefix frontend` (once) | 0 | 12 files, 247 passed, 0 failed, 0 skipped, 45.70 s |
| Coverage | `npm run test:coverage --prefix frontend` | 0 | 12 files, 247 passed; threshold (lines 80%) met; see below |
| Package report | `npm audit --prefix frontend` | 0 | found 0 vulnerabilities |

`npm install` was not run: `frontend/node_modules` already existed.

## Test results

- Total 247, passed 247, failed 0, skipped 0 (stage-level and per-unit commands were a single project-wide command, so nothing is double counted).
- The full suite was run twice (once as `npm run test`, once inside `npm run test:coverage`); both runs were green with 247 passed (45.70 s and 43.48 s).
- Declared test blocks per file (static count; parameterised cases expand at run time, which is why the run total exceeds the sum): `App.test.jsx` 73, `useTasks.test.jsx` 56, `taskStorage.test.js` 34, `TaskItem.test.jsx` 20, `TaskList.test.jsx` 13, `DeleteDialog.test.jsx` 10, `TaskForm.test.jsx` 10, `titleRules.test.js` 9, `TaskEditField.test.jsx` 4, `FilterBar.test.jsx` 3, `MessageBar.test.jsx` 3, `Counter.test.jsx` 2.

### Known NFR1 speed-guard flake

Three guards in `frontend/src/App.test.jsx` ("under 100 ms of code time": add at line 777, toggle at line 259, delete at line 370) have missed by 1 to 40 ms in earlier whole-suite runs under parallel load. In both full runs of this stage they passed, so no standalone re-run of `src/App.test.jsx` was needed and none was made. The flake did not occur this time; it has not been fixed and may recur. The guards are code-time regression guards in jsdom, not a measure of painted speed (see the Unverified rows in the matrix). The test output does not print the measured milliseconds, so no actual millisecond figures are claimed.

## Failure details

None. No build, lint, format, test, coverage or audit command failed.

## Coverage report (v8, `npm run test:coverage`)

| Scope | Statements | Branches | Functions | Lines |
|-------|-----------|----------|-----------|-------|
| All files | 98.04% (351/358) | 95.13% (215/226) | 100% (80/80) | 97.96% (337/344) |

Floor: 80% lines (`thresholds: { lines: 80 }` in `frontend/vite.config.js`, read and unchanged). Files with uncovered lines (files at 100% are not listed by the reporter): `App.jsx` line 65 (98.03% lines), `DeleteDialog.jsx` line 18 (94.73%), `useTasks.js` line 50 (98.95%), `taskStorage.js` lines 33, 67, 132 and 177 (95.91%). All uncovered lines are defensive branches named in the Unit code summaries.

## Loop-Back Log

No loop-back was fired.

## Accepted failure

On 2026-10-26 the person chose "Accept failure" at the halt-and-ask (loop-backs used: 0/3). Accepted open items: 10 `Unverified` real-browser targets (no owning stage scheduled); TV-27 `Not Met` (the lean test volume the person asked for); AC2.1.2 and AC6.1.5 need a real browser; the AC7.1.4 and AC9.1.1 ledger entries stay marked deferred although their tests pass (App.test.jsx, BR5.6 and the "0 items left" test). The candidate fix (update those two entries and reopen the owning units for re-review) was offered and declined.

## Outstanding checks that no command here could run

Real-browser items (painted speed, four browsers, dialog focus trap, real two-tab sync, contrast, screen reader, keyboard run) were not executed; they are `Unverified` rows in the matrix.

## Assumptions & Open Questions

- [assumption] Static test-block counts come from a text search of `it(` and `test(` lines and are approximate; the authoritative total is the runner's 247.
- Open question: whether to keep the NFR1 speed guards as they are or let the owner decide a more robust measure; changing them is outside this stage (no test or threshold was changed here).
