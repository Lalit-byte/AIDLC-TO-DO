# Build and Test Summary: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`; Test Strategy: standard; lean testing requested by the person (no new tests, source, config or thresholds changed in this stage).
- Requirements and stories: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`, `.../user-stories/stories.md`.
- Target inventory sources: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/` (performance, security, tech stack), `.../add-task/nfr-design/` (performance, security, logical components), the `## Testing Contract` of each `code-generation-plan.md`, the nine `code-summary.md` files, and `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/accessibility-checklist.md`.
- Run evidence: `test-results.md` in this folder (commands run 2026-10-26).
- Related files in this folder: `build-instructions.md`, `integration-test-instructions.md`, `cross-unit-traceability.md`.

## Overall status

Build and Test has FAILED under the stage's failure predicate: every command passed, but the matrix holds 1 `Not Met` and 10 `Unverified` targets, and the cross-unit coverage gate found uncovered IDs (see `cross-unit-traceability.md`). Nothing was weakened to reach a pass.

| Command | Result |
|---------|--------|
| Build | Passed (exit 0) |
| Lint | Passed (exit 0) |
| Format check | Passed (exit 0) |
| Tests | 247 of 247 passed (12 files), run twice |
| Coverage | Lines 97.96% (floor 80%), statements 98.04%, branches 95.13%, functions 100% |
| `npm audit` | 0 vulnerabilities |

## Test type inventory

| Type | Generated | Note |
|------|-----------|------|
| Unit tests | Per Unit by Code Generation (nine Units) | Run as one project-wide command |
| Integration tests | `integration-test-instructions.md` | Page-level tests in `App.test.jsx` on real hook and real storage service (jsdom) |
| Performance test instructions | Not generated | The only measurable speed target (under 100 ms, 100 tasks) needs a real browser, which no instruction file here can run; the in-suite code-time guards already exist and passed |
| Security test instructions | Not generated | No server, accounts or secrets; every security target (plain-text titles, no network, storage inside `src/services/`, shape check, backup, `npm audit`) is checked by existing tests, lint rules or the audit command |
| Accessibility | Existing axe checks in the component and page tests | Real-browser checks are listed as outstanding |

## Coverage expectations per Unit

All Units share one floor: 80% lines project-wide, met at 97.96%. Per-Unit figures from the code summaries (for reference): add-task 97.4%, delete-task files 91.22%, later Units 97.8% to 97.98% overall. Uncovered lines are defensive branches only (`App.jsx` 65, `DeleteDialog.jsx` 18, `useTasks.js` 50, `taskStorage.js` 33, 67, 132, 177).

## Target Verification Matrix

Verdict counts: Met 17, Not Met 1, Unverified 10, total 28. No `Pending` remains.

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|-----------|--------|----------|--------|----------|--------------|---------|
| TV-01 | NFR1, NFR1.1, AC1.1.6, AC2.1.4, AC3.1.4 (`performance-requirements.md`) | Add, complete and delete each show their result in under 100 ms with 100 tasks, measured in a real desktop browser | Not measured in a real browser; only the jsdom code-time guards (TV-02) ran | `test-results.md` | none scheduled | Unverified |
| TV-02 | NFR1.3 (`performance-requirements.md`, `performance-design.md` D5) | Timing guards (add, toggle, delete with 100 tasks, 100 ms of code time) exist, run in the full suite and pass | All three passed in both full runs (`App.test.jsx` lines 777, 259, 370); milliseconds not printed. Earlier known flake did not occur this time | `test-results.md` (Known NFR1 speed-guard flake) | none (met locally) | Met |
| TV-03 | NFR1.2 | New row on screen before the save result is known | Test "shows the new row before the save runs (NFR1.2)" passed | `useTasks.test.jsx` line 126; `test-results.md` | none (met locally) | Met |
| TV-04 | NFR1.4 | One manual add timing in Chrome with 100 tasks, noted at the checkpoint | Not done (no record found) | `add-task/code-generation/code-summary.md` item 2 (open) | none scheduled | Unverified |
| TV-05 | NFR1.5 | One read at page open, none on add; one write per successful add | Test "reads the saved list once, not again on an add (NFR1.5)" passed | `useTasks.test.jsx` line 36 | none (met locally) | Met |
| TV-06 | NFR2, NFR2.1 | The features work in current Chrome, Edge, Firefox, Safari on desktop | No browser run; Vite default build targets only | `vite.config.js`; code summaries | none scheduled | Unverified |
| TV-07 | NFR3, NFR3.1 (automated part) | A test adds a task with the keyboard alone; keyboard paths tested for the other actions | Keyboard tests passed (`App.test.jsx` line 49 and later keyboard tests) | `test-results.md` | none (met locally) | Met |
| TV-08 | NFR3.1 (manual part), `accessibility-checklist.md` A1, A2 | Manual keyboard run in a real browser with visible focus ring | Not done | Code summaries "Pending" lists | none scheduled | Unverified |
| TV-09 | NFR3.2, NFR3.4, `accessibility-checklist.md` A4, A9 | Automated axe check reports no missing-name or role failures on empty, full, refused, notice, dialog and edit states | Eight or more axe tests passed with no violations | `App.test.jsx` lines 250, 435, 691, 795, 800, 806, 817; `TaskForm.test.jsx` | none (met locally) | Met |
| TV-10 | NFR3.3, `accessibility-checklist.md` A5 | Text contrast at least 4.5 to 1 in every state, checked with a contrast tool | Calculated ratios only (lowest 4.75 to 1 for focus ring on page background, 4.83 to 1 for muted and danger text); jsdom cannot compute contrast and no tool run happened | `add-task/code-generation/code-summary.md` contrast table | none scheduled | Unverified |
| TV-11 | `accessibility-checklist.md` A8, BR3.5, FR4.1, FR4.3 | Delete dialog keeps focus inside, starts on Cancel, closes on Esc, returns focus, in a real browser | Not run (jsdom uses a stand-in for the modal functions) | `delete-task/code-generation/code-summary.md` "Pending" | none scheduled | Unverified |
| TV-12 | FR6.4, AC6.1.4 | A change in one real tab appears in a second tab without reload | Only simulated storage events tested | `keep-tasks/code-generation/code-summary.md` "Pending manual checks" | none scheduled | Unverified |
| TV-13 | `accessibility-checklist.md` A7, A10, FR7 polite count | Messages and count changes announced by a real screen reader | Not run | Code summaries "Pending" lists | none scheduled | Unverified |
| TV-14 | AC2.1.2, FR2.2, BR5.11, FR5.2 visual | Line-through and muted look, layout, filter button look and focus rings seen in a real browser | Not run (jsdom applies no CSS) | `complete-task` and `filter-tasks` code summaries "Pending" | none scheduled | Unverified |
| TV-15 | NFR4, NFR4.1, AC1.1.5 | Title `<b>x</b>` shown literally; lint forbids raw HTML insertion | Test passed (`App.test.jsx` line 107); lint exit 0 | `test-results.md` | none (met locally) | Met |
| TV-16 | NFR5, NFR5.1, AC6.1.8 | No network request carries task data | Test "makes no network call while adding and reloading" passed | `App.test.jsx` line 755 | none (met locally) | Met |
| TV-17 | NFR5.2 | Storage and network names only inside `src/services/` | ESLint restrictions clean across the project | lint exit 0 | none (met locally) | Met |
| TV-18 | NFR5.3 | Vulnerability report run and read before merge | `found 0 vulnerabilities` | `npm audit` run this stage | none (met locally) | Met |
| TV-19 | NFR6, NFR6.1, AC6.1.7 | Saved task has exactly five fields; wrong shapes refused or unreadable | Storage tests passed | `taskStorage.test.js` | none (met locally) | Met |
| TV-20 | NFR8, NFR8.1, NFR8.2, AC6.1.6 | All-or-nothing save; backup of unreadable data never overwritten | Storage and page tests passed | `taskStorage.test.js` (backup describe at line 165) | none (met locally) | Met |
| TV-21 | NFR7, NFR7.1 (coverage), org rule for `mvp` | At least 80% of lines | 97.96% lines (337/344) | `test-results.md` coverage report | none (met locally) | Met |
| TV-22 | NFR7, NFR7.1 (suite) | Full suite passes | 247 of 247 passed, twice | `test-results.md` | none (met locally) | Met |
| TV-23 | NFR7.3, project rule "never weaken a test" | Coverage threshold and tests not weakened | `thresholds: { lines: 80 }` present in `vite.config.js`; no config, source or test change made in this stage | `frontend/vite.config.js` | none (met locally) | Met |
| TV-24 | Team code style, `project.md` Mandated | ESLint passes | Exit 0, no problems | `test-results.md` | none (met locally) | Met |
| TV-25 | Team code style, `project.md` Mandated | Prettier passes | Exit 0, all files formatted | `test-results.md` | none (met locally) | Met |
| TV-26 | Build requirement | Production build succeeds | Exit 0, 28 modules | `test-results.md` | none (met locally) | Met |
| TV-27 | Testing Contract `strategy_volume` in each plan (standard: five to eight tests per piece) | At least five declared tests per piece | Below five by the Unit summaries: `FilterBar` 3, `MessageBar` 3 (plus one parameterised case), `TaskEditField` 4, `Counter` 2 declared blocks (4 wording cases in one parameterised block). Reached under the person's request to keep testing lean; the 80% floor and happy-path plus edge cases are met | `test-results.md` (per-file counts); `edit-task` and `keep-tasks` code summaries "Lean test scope" | none (needs a human decision to accept or add tests) | Not Met |
| TV-28 | FR6.5, AC6.1.5 | Tasks added in one browser are not shown in another | Not run; the ledger entry is `pending`; storage is the browser's own `localStorage` by design | `keep-tasks/code-generation/traceability.json` | none scheduled | Unverified |

## Readiness assessment

- Build-ready: yes (build, lint, format, audit clean).
- Test-ready: yes for the simulated browser (247 passing, 97.96% lines).
- Deployment-ready: no. Ten targets need a real browser with no owning stage scheduled, one test-volume target is not met, and no deployment target exists for phase 1 (`team.md` Deployment records the unresolved conflict).

## Known limitations and outstanding items

1. Real-browser checks with no scheduled owner (TV-01, TV-04, TV-06, TV-08, TV-10 to TV-14, TV-28): painted speed with 100 tasks, the four browsers, keyboard run, contrast tool, dialog focus trap, real two-tab sync, screen reader, visual look, second-browser isolation. No stage in the current plan owns them; the human (or a later validation stage) must decide to do them by hand or schedule them.
2. TV-27: test volume for four small pieces is below the standard five-to-eight, by the person's lean-testing request; accept or add tests.
3. Cross-unit coverage gate: see `cross-unit-traceability.md`. FR and NFR IDs are not recorded in any code-generation `traceability.json`, and four ACs (AC2.1.2, AC6.1.5, AC7.1.4, AC9.1.1) have no entry with status `OK`.
4. The NFR1 speed guards flaked in earlier whole-suite runs (1 to 40 ms over under parallel load) and passed in both runs here; the flake is unfixed and may recur.
5. Git is not initialised, so nothing is committed or merged; `docs/TASKS.md` rows are still `in-progress` for several Units.
6. Phase 1 deployment meaning is unresolved (no staging target).

## Assumptions & Open Questions

- [assumption] Performance and security instruction files are not generated for the reasons in the inventory table above; no measurable target needs them.
- [assumption] `Met` for TV-03, TV-05, TV-07, TV-15, TV-16, TV-19 and TV-20 rests on the named tests existing (found by search) and the whole suite passing; the tests were not run one by one.
- Open question: who owns the real-browser items and by when (no stage owns them).
- Open question: accept TV-27 as a documented lean-testing deviation, or add tests (outside this stage's remit as instructed).
