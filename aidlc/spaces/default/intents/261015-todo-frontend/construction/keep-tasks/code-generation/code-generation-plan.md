# Code Generation Plan: keep-tasks (U6), Todo List Frontend (Phase 1)

## Summary

- Builds: two open tabs stay in step (the storage service notices another tab's change and the page refreshes its list), the damaged-data case from another tab, and the message line as its own block above the add row with the "(!)" mark and as an alert
- Touches: `frontend/src/services/taskStorage.js`, `frontend/src/hooks/useTasks.js`, `frontend/src/App.jsx`, `frontend/src/styles.css`, a new file `frontend/src/components/MessageBar.jsx`, and their test files
- Tests: a lean set of about 20 new automated tests (storage service, hook, message block, page with a simulated second tab), kept short as asked earlier; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U6 keep-tasks, story US6.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflows W1 to W6, rules BR6.1 to BR6.15, the extended notice state machine, components): `aidlc/spaces/default/intents/261015-todo-frontend/construction/keep-tasks/functional-design/functional-spec.md` and `frontend-components.md`
- The earlier designs and code this Unit builds on (saving all or nothing, the damaged-data backup, the notices): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and the existing code in `frontend/src/`
- NFR requirements and design of add-task (inherited unchanged; NFR Requirements, NFR Design and Infrastructure Design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Contracts C2 to C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
- Answers [Q1] to [Q3] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/keep-tasks/functional-design/functional-design-questions.md`
- The app lives in the `frontend/` folder; every source path below starts with `frontend/`.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Write each testable layer (component, hook, storage service), then write and run that layer's tests before moving to the next layer.",
  "scope": "mvp",
  "test_strategy": "standard",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: test-after\n- **Ordering**: Write each testable layer (component, hook, storage service), then write and run that layer's tests before moving to the next layer.\n- **Methodology evidence**: Human confirmed in the interview (Q3: A).\n- Tooling (`docs/ARCHITECTURE.md`, `docs/RULES.md`): Vitest and React Testing Library.\n- Coverage floor (org.md, `mvp` scope; Q4: A): 80% line coverage. Not to be weakened to pass a step.\n- No automated build server exists (no cloud accounts, no budget), so the full test suite is run locally before every merge. This is how \"CI execution before merge\" is met for now. Adding a free CI server later is not decided.\n- Test content (`docs/RULES.md`, matches construction guardrails): each new component or hook gets the happy path plus at least two edge or error cases; run the full suite before marking a task done (guidance, not a hard rule)."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:5bae8ea206b768d45f70d2614f33d153dda87a83b5f8352f98f7dc14241d6f92",
  "contract_sha256": "sha256:83f6101ff56457e58b2be6190b96d3cbe41895387a78f56e8f6ae78c468d99dc"
}
```

## Plan steps

Test-after, layer by layer: the storage service first (data access), then the state hook (business logic), then the message block and the page (frontend behavior). The project, test runner and tools already exist; the runner command is run from the `frontend/` folder. The API and database layers do not apply. Most of this Unit's rules were built in add-task (all-or-nothing saving, the checks on load, the backup, the two notices); this plan builds only what is new and re-checks nothing that is already tested.

- [x] **Step 1: Claim the work on the shared board.** Add a row for U6 keep-tasks in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US6.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Implement `subscribe` in the storage service.** In `frontend/src/services/taskStorage.js` add `subscribe(listener)` to the service returned by `createTaskStorage` (and so to `TaskStorage`), returning a function that stops the watching. It listens for the browser's storage-change signal on `window`, accepts a signal only when it comes from this browser's local storage and its key is the saved-tasks key or absent (a clear-everything), and ignores every other signal (BR6.12). On an accepted signal it reads the saved text again through the same reading code the load uses, which updates the kept unreadable text by this rule for every outcome (BR6.9, State held): a good list or a removed list clears it; damaged text (not the saved format, an unknown version, a task that fails the checks, a task with an extra field) replaces any older kept text and marks it not yet backed up (so the next `save` copies it first, as already built); a blocked or failed read leaves it as it was and is ignored (the listener is not called). It then calls the listener with `{ ok: true, tasks }` (an empty list when the saved list is gone) or `{ ok: false, reason: 'unreadable' }`. It never writes (BR6.15) and the unsubscribe also removes the browser listener. Refactor the existing `load` to share the reading code without changing its results. Stories: US6.1 (AC6.1.4). Files: `frontend/src/services/taskStorage.js`.
- [x] **Step 3: Write and run the tests for the storage service.** Extend `frontend/src/services/taskStorage.test.js`, simulating a second tab by changing the stored text and dispatching a storage event: a good list from another tab reaches the listener; the tasks key removed gives an empty list; a signal with no key (clear everything) triggers the re-read; a signal for another key and one from another storage area are ignored; damaged text gives the unreadable result and the next `save` copies it to a backup before writing; a later good read clears the kept text so the next `save` makes no backup; a new damaged text replaces one already backed up and is backed up again; a blocked read during a signal is ignored; after unsubscribing nothing is called; an extra field on a task and an unknown version both give the unreadable result. Run: `npx vitest run src/services/taskStorage.test.js` (from `frontend/`). Stories: US6.1, BR6.4, BR6.9, BR6.11, BR6.12, BR6.15. Files: `frontend/src/services/taskStorage.test.js`.
- [x] **Step 4: Implement the refresh in the hook.** In `frontend/src/hooks/useTasks.js`, subscribe to `TaskStorage` in an effect when the page opens and stop in its cleanup (do not set state in the effect body, only in the listener). On `{ ok: true, tasks }`: set both the screen list and the list the next save reads (`tasksRef`), clear the "save due" record, and clear the save-failed flag (BR6.4, BR6.14); start no save. On `{ ok: false }`: keep the list and set a new flag meaning another tab left damaged data, which together with the load-failed flag makes the load-failed notice that stays until reload (BR6.9); the notice state machine follows the table in the functional design (save-failed outranks load-failed; a good save or another tab's list returns to load-failed when load damage was seen, otherwise to nothing). Update the file's header comment. Stories: US6.1 (AC6.1.4, AC6.1.2). Files: `frontend/src/hooks/useTasks.js`.
- [x] **Step 5: Write and run the tests for the hook.** Extend `frontend/src/hooks/useTasks.test.jsx`, simulating a second tab as in Step 3: another tab's list replaces the list and the next save of this tab writes the new list, not the old (the screen list and the save list agree); a save made due but not yet run is dropped when the list arrives; the save-failed notice clears when the list arrives; damaged data from another tab keeps the list and gives the load-failed notice, and it stays after a later good save and after a later good list; the next change after that damage saves this tab's list after a backup; the unsubscribe happens when the hook is removed. Run: `npx vitest run src/hooks/useTasks.test.jsx` (from `frontend/`). Stories: US6.1, BR6.4, BR6.9, BR6.14. Files: `frontend/src/hooks/useTasks.test.jsx`.
- [x] **Step 6: Implement the message block and the page wiring.** New `frontend/src/components/MessageBar.jsx`: input `notice` (null, or `{ kind, text }`); renders nothing for null, otherwise one paragraph with the "(!)" mark before the text, role alert, the classes the old notice used (including the kind modifier) and `data-testid="notice"` (BR6.13). `frontend/src/App.jsx`: render `MessageBar` above `TaskForm` in place of the plain notice line below it. `frontend/src/styles.css`: restyle the notice as the message block (danger color, spacing above the add row; no animation). Stories: US6.1 (AC6.1.2, AC6.1.3). Files: `frontend/src/components/MessageBar.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`.
- [x] **Step 7: Write and run the tests for the message block and the page.** New `frontend/src/components/MessageBar.test.jsx`: nothing for null; each of the two texts with the "(!)" mark; it is an alert. Extend `frontend/src/App.test.jsx` with a simulated second tab: a task added in the other tab appears here without a reload, with no message and focus unchanged (AC6.1.4); the other tab clears everything and the list empties with no message; damaged data from the other tab keeps the list, shows "Your tasks could not be loaded." above the add row, and the next change is saved after a backup; a task removed in the other tab while it is edited here ends the edit and while its delete dialog is open closes it with nothing removed; the message line sits above the add row. Adjust any earlier test that looks for the plain notice below the add row by the minimum needed (the test id and class stay), weakening no assertion. Run: `npx vitest run src/components/MessageBar.test.jsx src/App.test.jsx` (from `frontend/`). Stories: US6.1 (AC6.1.2 to AC6.1.4). Files: `frontend/src/components/MessageBar.test.jsx`, `frontend/src/App.test.jsx`.
  **Lean scope (the person asked earlier not to spend much time on testing).** Write the tests named in Steps 3, 5 and 7 and no other; skip the axe variations and any extra variant; add the smallest extra test only if the 80% line-coverage floor is missed. This keeps the strategy's per-piece obligation as far as that request allows and is noted in the code summary.
- [x] **Step 8: API and database layers: not applicable.** Saving reuses the existing storage service. Stories: none. Files: none.
- [x] **Step 9: Environment and checks.** From `frontend/`, run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 10: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC6.1.1 to AC6.1.8 and BR6.1 to BR6.15, each with an existing workspace file as target; rules built in add-task point at the existing implementation and test files; checks that were not run are marked pending, not OK) and `source-manifest.json` (every file this Unit changed, with `frontend/` paths) under `construction/keep-tasks/code-generation/`. Stories: US6.1. Files: those three files.

## Files this plan creates or changes

`frontend/src/services/taskStorage.js`, `frontend/src/hooks/useTasks.js`, `frontend/src/components/MessageBar.jsx` (new), `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/services/taskStorage.test.js`, `frontend/src/hooks/useTasks.test.jsx`, `frontend/src/components/MessageBar.test.jsx` (new), `frontend/src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US6.1 AC6.1.1 (same tasks, order and states after reload; built in add-task) | already built and tested; re-checked by the whole suite in 9 |
| US6.1 AC6.1.2 (damaged data: message, empty list, data left alone) | built in add-task; message block in 6, 7; damage from another tab in 2 to 5 |
| US6.1 AC6.1.3 (save fails: message, change stays) | built in add-task; message block in 6, 7 |
| US6.1 AC6.1.4 (a second tab stays in step) | 2 to 7 |
| US6.1 AC6.1.5 to AC6.1.8 (other browsers, all or nothing, five fields, no network) | built in add-task or inherent; extra field and unknown version in 3; checked by the whole suite in 9 |
| BR6.9 to BR6.12 (damage from another tab, last save wins, version, removed list) | 2, 3, 4, 5, 7 |
| BR6.13 (message block) | 6, 7 |
| BR6.14, BR6.15 (replaced list, read only) | 2 to 5 |
| NFR7 (coverage floor, suite green) | 3, 5, 7, 9 |

## Assumptions & Open Questions

- [assumption] The simulated browser can show everything this Unit does with a second tab simulated by dispatching a storage event; the look of the message block (position above the add row, danger color) and two real tabs open in a real browser are listed as pending for a hand check in `code-summary.md`.
- [assumption] Earlier tests that look for the notice use its test id and class, which stay; any that look at its position or role are adjusted by the minimum and weaken no assertion.
- [assumption] No new dependency is needed.
- Open question: contract C3's `subscribe` behaviour (keeping damaged text for the backup) goes beyond the contract text and is listed in the functional design for the owner to approve.
- Open question: Git is not set up, so nothing is committed.
