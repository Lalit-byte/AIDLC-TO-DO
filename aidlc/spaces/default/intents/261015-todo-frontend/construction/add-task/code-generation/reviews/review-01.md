## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-10-16T10:05:34Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/traceability.json > coverage entries NFR1.4, NFR2.1, NFR3.3 | These three entries have status "OK", but the checks they stand for were not run. NFR1.4 (timing with 100 tasks in Chrome) points at code-summary.md, which lists it as an open item. NFR2.1 (behaviour in four browsers) points at vite.config.js, and code-summary.md says it is left for Build and Test. NFR3.3 (contrast) points at styles.css, but the ratios were calculated by hand and code-summary.md says they are "to be confirmed once with a contrast checker". The only code-level evidence is a jsdom timing guard that measures code time, not paint time. Anyone reading traceability.json alone would take these as verified. | Change these three entries to a pending or manual-check status that names the owner and the checkpoint. Mark them OK only after the Chrome timing, the four-browser pass and the contrast-checker run are recorded. | New |
| R-02 | Minor | src/hooks/useTasks.js > the effect that schedules the save (requestAnimationFrame then setTimeout) | The save starts only after a paint. Browsers pause requestAnimationFrame in a background tab. If a person adds a task and switches tabs, the save is delayed until the tab is visible again, and the task is lost if the tab is closed or discarded first. There is no flush on `pagehide` or `visibilitychange`. The save-after-draw logic itself checks out: the flag is cleared before the save, the latest list comes from `tasksRef`, two adds give one save, and a repeated effect run is guarded by `scheduledRef`. | Add a `visibilitychange` or `pagehide` handler that runs `runSave` immediately when a save is due, or fall back to `setTimeout` when `document.hidden` is true. Add a test for it. | New |
| R-03 | Minor | src/main.jsx > StrictMode comment; code-summary.md > Decisions | StrictMode is left out so the saved list is read once. The hook already tolerates double invocation, because `load()` resets its own state and the schedule is guarded by a ref. Leaving StrictMode out removes the development-time check for effect and ref bugs. NFR1.5 can be tested without it, and a test already does so. | Turn StrictMode on and keep the single-read test. Or record why it stays off, with a test that renders the hook under StrictMode and shows one save and a correct notice. | New |
| R-04 | Minor | eslint.config.js > STORAGE_AND_NETWORK_PROPERTIES; src/** | The storage and network ban lists the names `window` and `globalThis` plus bare globals. It does not cover `self.localStorage`, `window['localStorage']`, or destructuring such as `const { localStorage } = window`. Nothing blocks `eslint-disable` comments, for example with `reportUnusedDisableDirectives` or a rule against them. A grep found no disable comments in `src`, and a probe file in the summary was flagged. The rule is therefore enforced for the plain cases, but the claim of full enforcement is wider than the evidence. | Add `self` to the restricted objects and forbid disable comments for these rules, for example with `linterOptions` and a check for the `no-restricted-*` names. Or state in the security design that the lint rule is a guard against slips, not a complete barrier. | New |
| R-05 | Minor | src/App.test.jsx > speed guard test | The 100 ms test times a synchronous `fireEvent.submit` in jsdom. It cannot see paint or the later save. Its name already says "code time". It is a fair regression guard, and the code-summary.md wording is accurate. It is not evidence for NFR1.3 or NFR1.4 beyond that. | No code change needed. Make sure the traceability entry for NFR1.3 says "code-time guard only". | New |
| R-06 | Minor | aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/source-manifest.json > writes | The manifest lists whole directories (`src/`, `node_modules/`, `dist/`, `coverage/`) instead of each file. Every named path is related to the Unit, and nothing unrelated is claimed. The directory entries do not let a reviewer see which files under `src/` changed. | List the individual files under `src/`, or keep the directory entries and rely on the file table in code-summary.md. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| npm test | PASS: 7 files, 91 tests | All tests pass. I read the tests for BR1.16 (double submit), the backup rules (BR1.13), the notice transitions, plain-text rendering, and the one-save-for-two-adds case, and they assert real behaviour. |
| npm run test:coverage | PASS: lines 97.4%, statements 97.46%, branches 97.14%, functions 100% | Well above the 80% floor. The threshold in vite.config.js is still 80. Only test files, test helpers and src/main.jsx are excluded. The uncovered lines are defensive branches. |
| npm run lint | PASS: no problems | Includes the restricted globals and properties, `react/no-danger`, and the test-file override that allows only `localStorage` and `fetch`. |
| npm run format:check | PASS | All files match Prettier. |
| npm run build | PASS: 22 modules | Builds to dist. |

### Summary

I found no architectural flaw. BR1.1 to BR1.16 are implemented and tested. The backup, shape check and notice state machine in `taskStorage.js` and `useTasks.js` match the functional spec, and titles render as plain text. The one Major finding is that traceability.json marks the manual and cross-browser checks (NFR1.4, NFR2.1, contrast) as OK when they are still open. The remaining items are Minor: a save that may not run in a background tab, StrictMode left off, gaps in the lint ban, and a coarse manifest.
