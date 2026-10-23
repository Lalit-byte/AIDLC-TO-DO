# Code Generation Plan: delete-task (U3), Todo List Frontend (Phase 1)

## Summary

- Builds: deleting a task after confirming: a Delete button on each row, the "Delete this task?" dialog (built-in modal dialog), the `remove` action, and the focus moves after Cancel and after a delete
- Touches: `frontend/src/hooks/useTasks.js`, `frontend/src/components/TaskItem.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`, one new file `frontend/src/components/DeleteDialog.jsx`, a small dialog stand-in for tests, and their test files
- Tests: about 30 new automated tests (hook, dialog, row, list, page) including keyboard-only use, focus rules, failed save and a 100-task speed guard, added to the existing suite; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U3 delete-task, story US3.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflows W1 to W4, rules BR3.1 to BR3.11, components, dialog state machine): `aidlc/spaces/default/intents/261015-todo-frontend/construction/delete-task/functional-design/functional-spec.md` and `frontend-components.md`
- The add-task and complete-task designs and code that this Unit builds on (save after the draw, notices, accessibility and lint controls): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-design/` and `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/`, and the existing code in `frontend/src/`
- NFR requirements and design of add-task (inherited unchanged; NFR Requirements, NFR Design and Infrastructure Design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Contracts C3 to C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
- Answers [Q1] and [Q2] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/delete-task/functional-design/functional-design-questions.md`
- The app now lives in the `frontend/` folder (it was moved from the project root after the earlier Units were built); every source path below starts with `frontend/`, and the earlier Units' records still show the old `src/` paths.

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

Test-after, layer by layer: the hook first (business logic), then the dialog, row, list and page (frontend behavior). The project, test runner and tools already exist, so no setup or bootstrap step is needed; the runner command is the one already recorded, run from the `frontend/` folder. Storage needs no change: `remove` changes the list and the existing whole-list `save` writes it. Repository, API and database layers do not apply.

- [x] **Step 1: Claim the work on the shared board.** Add a row for U3 delete-task in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US3.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Implement `remove` in the hook.** In `frontend/src/hooks/useTasks.js` add `remove(id)` (return it beside `add` and `toggle`): find the task in the latest list (`tasksRef`); if it is not there, change nothing and start no save (BR3.8); otherwise build a new list without that task, every other task unchanged and in the same order (BR3.2); put the list on screen and raise the same "save is due" record `add` and `toggle` use, so the save runs after the row is gone and a failed save keeps the removal and shows the notice (BR3.9). Two quick removes of the same id remove once and give one save. Stories: US3.1 (AC3.1.2, AC3.1.4). Files: `frontend/src/hooks/useTasks.js`.
- [x] **Step 3: Write and run the tests for the hook.** Extend `frontend/src/hooks/useTasks.test.jsx`: remove drops only the named task; the order of the rest is unchanged; other tasks' fields are untouched; removing the last remaining task gives an empty list; an unknown id changes nothing and starts no save; two quick removes of one id give one removal and one save; after a failed save the removal stays and the notice is `save-failed`, and the next successful save writes the shorter list and clears the notice; the saved list no longer holds the task after the post-paint step. Run: `npx vitest run src/hooks/useTasks.test.jsx` (from `frontend/`). Stories: US3.1, BR3.2, BR3.8, BR3.9. Files: `frontend/src/hooks/useTasks.test.jsx`.
- [x] **Step 4: Implement the dialog, the Delete button and the page wiring.**
  - `frontend/src/components/DeleteDialog.jsx` (new): props `task` (a task or `null`), `onConfirm(id)`, `onCancel()`. Renders one built-in `dialog` element [Q2] with the heading "Delete this task?" (level 2), the title in quotation marks as a plain text child (also the dialog's description), and Cancel then Delete buttons (Delete in the danger color). An effect opens it as a modal when `task` is not `null` and then focuses Cancel with an explicit focus call (BR3.1), and closes it when `task` becomes `null`. The dialog's cancel event (Esc) has its default action prevented and is turned into `onCancel()`, so `task` becoming `null` is the only way the dialog closes (BR3.3, BR3.5). A click on the dimmed area is ignored (BR3.4). Delete calls `onConfirm(task.id)`. `data-testid` on the dialog and both buttons.
  - `frontend/src/components/TaskItem.jsx`: add a Delete button (native `button`, `data-testid="delete-button"`) whose accessible name is "Delete" followed by the task's title (points at its own text and at the title text) and which calls `onAskDelete(task.id)` (BR3.1, BR3.10); put `data-task-id` on the row so the page can find it.
  - `frontend/src/components/TaskList.jsx`: accept `onAskDelete` and pass it to each row.
  - `frontend/src/App.jsx`: hold the pending-delete id; find the task in the list by id and pass `DeleteDialog` the task or `null`; `onAskDelete` sets the pending id; `onCancel` clears it and asks for focus on that row's Delete button; `onConfirm` works out the focus target before the removal (the row now at the deleted position, else the row above, else the add input) [Q1], calls `remove`, clears the pending id and asks for that focus (BR3.6). The focus request is honoured in `App`'s own effect, which runs after the dialog's effect has closed the dialog, by looking the control up inside the page (the row by `data-task-id`, then its Delete button or checkbox, or the add input by its test id); it is then cleared. If the pending task is no longer in the list (BR3.8), the pending id is cleared with nothing removed and focus goes to the add input. `TaskList` and `TaskForm` need no focus code of their own: the design left the way the focus request is honoured to this plan.
  - `frontend/src/styles.css`: the Delete button at the right of the row, the dialog and its dimmed backdrop (danger color `#dc2626` with white text for Delete; no animation), the long-title wrapping in the dialog, and the focus ring on the new controls.
  Stories: US3.1 (AC3.1.1 to AC3.1.4). Files: `frontend/src/components/DeleteDialog.jsx`, `frontend/src/components/TaskItem.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`.
- [x] **Step 5: Write and run the tests for the dialog, row, list and page.**
  - A small stand-in for the dialog element's open and close calls (`frontend/src/test/dialog.js`, loaded from `frontend/src/test/setup.js`): it adds `showModal` and `close` only where the simulated browser lacks them (open sets `open`; close clears it and fires `close`). It does not move focus, so Cancel-first focus comes from the dialog's own focus call and is asserted in the tests [Q2].
  - New `frontend/src/components/DeleteDialog.test.jsx`: closed when `task` is `null`; open with the heading, the quoted title and both buttons for a task; Cancel has focus when it opens; Cancel calls `onCancel`; the cancel event (Esc) calls `onCancel` and is default-prevented, and the dialog stays open until `task` becomes `null`; Delete calls `onConfirm` with the id; a click on the dialog's own backdrop area calls neither; a title with markup (`<b>x</b>`) and a very long title are shown as plain text; closes when `task` goes back to `null`.
  - Extend `frontend/src/components/TaskItem.test.jsx`: the Delete button is present and named "Delete" plus the title; clicking it calls `onAskDelete` with the id; Enter and Space on it do the same by keyboard; it does not toggle the task.
  - Extend `frontend/src/components/TaskList.test.jsx`: passes `onAskDelete` to every row.
  - Extend `frontend/src/App.test.jsx`: Delete opens the dialog for that task with Cancel focused and the task still listed (AC3.1.1); Delete in the dialog removes the task and a reload keeps it gone (AC3.1.2); Cancel and Esc keep the task and return focus to that row's Delete button (AC3.1.3); a click on the backdrop does nothing; the whole delete by keyboard only (Tab to Delete, Enter, Tab, Enter) and a guard that, with 100 saved tasks, the time from the confirming key press to the row being absent from the document is under 100 ms of code time (AC3.1.4, a regression guard only); focus goes to the next row's checkbox after a delete, to the row above after deleting the last row, and to the add input after deleting the only task (BR3.6); the order of the rest is kept; a failed save keeps the removal and shows the notice; the axe check passes with the dialog open and closed; a task that leaves the list while the dialog is open closes it with nothing removed (BR3.8, simulated by a storage change the test makes the hook receive, or by removing the task through the hook's own action).
  Run: `npx vitest run src/components/DeleteDialog.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` (from `frontend/`). Stories: US3.1 (AC3.1.1 to AC3.1.4), NFR1, NFR3, NFR4. Files: `frontend/src/test/dialog.js`, `frontend/src/test/setup.js`, `frontend/src/components/DeleteDialog.test.jsx`, `frontend/src/components/TaskItem.test.jsx`, `frontend/src/components/TaskList.test.jsx`, `frontend/src/App.test.jsx`.
- [x] **Step 6: Repository, API and database layers: not applicable.** Saving reuses the existing storage service unchanged. Stories: none. Files: none.
- [x] **Step 7: Environment and checks.** From `frontend/`, run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 8: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC3.1.1 to AC3.1.4 and BR3.1 to BR3.11, each with an existing workspace file as target; checks that were not run are marked pending, not OK) and `source-manifest.json` (every file this Unit changed, with `frontend/` paths) under `construction/delete-task/code-generation/`. Stories: US3.1. Files: those three files.

## Files this plan creates or changes

`frontend/src/hooks/useTasks.js`, `frontend/src/components/DeleteDialog.jsx` (new), `frontend/src/components/TaskItem.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/test/dialog.js` (new), `frontend/src/test/setup.js`, `frontend/src/hooks/useTasks.test.jsx`, `frontend/src/components/DeleteDialog.test.jsx` (new), `frontend/src/components/TaskItem.test.jsx`, `frontend/src/components/TaskList.test.jsx`, `frontend/src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US3.1 AC3.1.1 (dialog opens, title, Cancel focused, task still listed) | 4, 5 |
| US3.1 AC3.1.2 (Delete removes it; gone after reload) | 2, 3, 4, 5 |
| US3.1 AC3.1.3 (Cancel or Esc keeps it) | 4, 5 |
| US3.1 AC3.1.4 (keyboard only, under 100 ms for 100 tasks) | 2, 4, 5 |
| BR3.4, BR3.5 (backdrop click, focus stays inside) | 4, 5 (focus containment itself is a browser behaviour, checked by hand) |
| BR3.6 (focus after a delete) | 4, 5 |
| BR3.8, BR3.9 (unknown id, saving) | 2, 3, 4, 5 |
| BR3.10, BR3.11 (names, plain text, built-in dialog) | 4, 5 |
| NFR7 (coverage floor, suite green) | 3, 5, 7 |

## Assumptions & Open Questions

- [assumption] The simulated browser may not have the dialog element's `showModal` and `close`, so the stand-in adds them only when missing; if it has them, the tests use the real ones. Focus is set by the dialog's own call, so tests do not depend on the browser's first-focus behaviour.
- [assumption] Focus containment inside the open dialog, the dimming and the click on the backdrop are browser behaviour that the simulated browser cannot show. The tests check what the code does (the explicit focus calls, ignoring the click, preventing the native close); the real-browser behaviour is listed for a hand check in `code-summary.md` as pending until done by a person, together with the Chrome timing and the contrast of the white-on-red Delete button (4.83 to 1 as calculated).
- [assumption] When the task being confirmed leaves the list while the dialog is open, focus goes to the add input. The functional design closes the dialog in this case but names no focus target (a minor point from its review); this plan chooses the add input. Not confirmed by the user.
- [assumption] No new dependency is needed; the existing test tools cover the keyboard and accessibility checks.
- [assumption] Focus moves are done by looking controls up inside the page from `App`, not by passing a request value down; this is one of the two ways the functional design allowed and keeps `TaskList` and `TaskForm` unchanged.
- Open question: the recorded verification command `npm test` is run from the project root, but the app is now in `frontend/`. The command needs to run there (for example `npm test --prefix frontend`) before the Unit checkpoint; to be settled with the person at the checkpoint.
- Open question: `docs/ARCHITECTURE.md` does not list `DeleteDialog` among the components; its owner makes that edit (noted in the unit definition).
- Open question: Git is not set up, so nothing is committed.
