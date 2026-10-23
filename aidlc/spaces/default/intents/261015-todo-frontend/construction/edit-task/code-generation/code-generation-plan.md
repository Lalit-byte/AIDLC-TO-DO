# Code Generation Plan: edit-task (U4), Todo List Frontend (Phase 1)

## Summary

- Builds: editing a task's title in place: an Edit button on each row, the editing field with Save, Cancel and the hint, the `edit` action, only one task edited at a time, and the focus moves around editing
- Touches: `frontend/src/hooks/useTasks.js`, `frontend/src/components/TaskItem.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/components/TaskForm.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`, new files `frontend/src/components/TaskEditField.jsx` and `frontend/src/components/titleMessages.js`, and their test files
- Tests: a lean set of about 25 new automated tests (hook, field, row, list, form messages, page) covering each acceptance criterion, the three answered choices, keyboard-only use and a failed save, kept short at the person's request; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U4 edit-task, story US4.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflows W1 to W6, rules BR4.1 to BR4.13, edit state machine, components): `aidlc/spaces/default/intents/261015-todo-frontend/construction/edit-task/functional-design/functional-spec.md` and `frontend-components.md`
- The earlier designs and code this Unit builds on (title rules, save after the draw, notices, the delete Unit's focus request): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`, `.../delete-task/functional-design/functional-spec.md`, and the existing code in `frontend/src/`
- NFR requirements and design of add-task (inherited unchanged; NFR Requirements, NFR Design and Infrastructure Design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Contracts C3 to C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
- Answers [Q1] to [Q3] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/edit-task/functional-design/functional-design-questions.md`
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

Test-after, layer by layer: the hook first (business logic), then the field, row, list, form messages and page (frontend behavior). The project, test runner and tools already exist, so no setup or bootstrap step is needed; the runner command is run from the `frontend/` folder. Storage needs no change: `edit` changes the list and the existing whole-list `save` writes it. Repository, API and database layers do not apply.

- [x] **Step 1: Claim the work on the shared board.** Add a row for U4 edit-task in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US4.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Implement `edit` in the hook.** In `frontend/src/hooks/useTasks.js` add `edit(id, rawTitle)` (return it beside `add`, `toggle` and `remove`), in this order (BR4.8): (1) if the id is not in the latest list (`tasksRef`), change nothing, start no save and return `{ ok: true }`, whatever the text is; (2) run the existing `checkTitle`; if refused, change nothing, start no save and return `{ ok: false, reason }`; (3) if the trimmed title equals the task's current title, change nothing, leave `updatedAt` alone, start no save and return `{ ok: true }` (BR4.5); (4) otherwise build a new list in which only that task has the new trimmed title and `updatedAt` set to the time of the change, same position, `id`, `completed`, `createdAt` and every other task unchanged (BR4.2); put it on screen, raise the same "save is due" record the other actions use so the save runs after the row is drawn and a failed save keeps the change and shows the notice (BR4.9); return `{ ok: true }`. Update the file's header comment to list `add`, `toggle`, `remove` and `edit`. Stories: US4.1 (AC4.1.2, AC4.1.4, AC4.1.5). Files: `frontend/src/hooks/useTasks.js`.
- [x] **Step 3: Write and run the tests for the hook.** Extend `frontend/src/hooks/useTasks.test.jsx`: edit replaces only the named task's title with the trimmed text and sets `updatedAt`; `id`, `completed`, `createdAt`, position and other tasks stay; a complete task stays complete; an empty and a spaces-only title are refused with `empty` and change nothing and start no save; 200 visible characters are accepted and 201 refused with `too-long`; the same title (also with spaces around it) returns `{ ok: true }`, leaves `updatedAt` as it was and starts no save; an unknown id returns `{ ok: true }`, changes nothing, starts no save, even with an empty title; two tasks with the same title are allowed; after a failed save the change stays and the notice is `save-failed`, and the next successful save writes it and clears the notice; the saved list holds the new title after the post-paint step. Run: `npx vitest run src/hooks/useTasks.test.jsx` (from `frontend/`). Stories: US4.1, BR4.2, BR4.4, BR4.5, BR4.8, BR4.9. Files: `frontend/src/hooks/useTasks.test.jsx`.
- [x] **Step 4: Implement the field, the Edit button and the page wiring.**
  - `frontend/src/components/titleMessages.js` (new): the two refusal messages ("Please enter a task title." and "Title must be 200 characters or fewer.") and a function that turns a refusal reason into its text with the existing fallback, moved out of `TaskForm.jsx` so the add form and the row share one copy. `TaskForm.jsx` imports it and keeps exporting `MESSAGES` if existing tests import it from there. Its behaviour and texts do not change.
  - `frontend/src/components/TaskEditField.jsx` (new): the editing field for one row, mounted only while that row is being edited, so its typed text and message are fresh every time editing starts and are dropped when it ends (BR4.1, BR4.7). It renders a form with the text input (initial value the saved title, all text selected and focus on mount; accessible name "Edit title of" plus the title; the hint "Enter to save, Esc to cancel" linked as its description), Save (filled accent) and Cancel buttons, and, after a refusal, the message with the "(!)" mark as an alert linked to the field and the field marked invalid; typing clears the message. Submitting (Enter or Save) calls `onSave(text)` and shows the message for a refusal, keeping the text and focus (BR4.4); Cancel calls `onCancel()`. `data-testid` on the field, Save, Cancel and the message.
  - `frontend/src/components/TaskItem.jsx`: add the Edit button (native `button`, `data-testid="edit-button"`, accessible name "Edit" plus the title, made like Delete's), placed before Delete. When `editingId` is this task's id: render `TaskEditField` instead of the visible title and the Edit and Delete buttons (BR4.13), keep the title text in the page visually hidden with the same id so the checkbox keeps its name (BR4.10), and handle Escape pressed anywhere inside the row (field, Save, Cancel, checkbox) as Cancel (BR4.3). Pressing Edit calls `onStartEdit(task.id)`. On Save, call `onEdit(task.id, text)`; when the result is `{ ok: true }` call `onEndEdit(true)` (return focus to the Edit button); on a refusal show the message and stay (BR4.2, BR4.4, BR4.5). Cancel and Esc call `onEndEdit(true)` (BR4.3).
  - `frontend/src/components/TaskList.jsx`: accept `editingId`, `onStartEdit`, `onEndEdit` and `onEdit` and pass them to each row.
  - `frontend/src/App.jsx`: hold the id of the task being edited; pass `editingId`, `onStartEdit`, `onEndEdit` and the hook's `edit` as `onEdit` to `TaskList`. Pressing Edit on a task sets the edited id to it, which ends any other edit without saving (BR4.7). `onEndEdit(true)` clears the id and asks, through the existing focus request, for focus on that row's Edit button (extend the request's controls with the Edit button); the request falls back to the add input if the row is not shown (BR4.12). The edited id must never stay set for a task that is not in the shown list: it is cleared at the moment it is found missing, so the task is never reopened in editing when it comes back and takes no focus; use a way that passes the project's lint rules (for example, the conditional adjust-state-during-render pattern React documents, or keeping the id together with a check against the shown list); the BR4.12 test is the judge (BR4.12). Starting a delete on another row leaves the edit and its text alone (BR4.13).
  - `frontend/src/styles.css`: the Edit button beside Delete, the editing row layout (field fills the title space, Save and Cancel at the right, the hint muted under the field, the message in the danger color), the visually hidden title, and the focus ring on the new controls; no animation.
  Stories: US4.1 (AC4.1.1 to AC4.1.5). Files: `frontend/src/components/titleMessages.js`, `frontend/src/components/TaskEditField.jsx`, `frontend/src/components/TaskItem.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/components/TaskForm.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`.
- [x] **Step 5: Write and run the tests for the field, row, list, form messages and page.**
  **Lean scope (the person asked at approval not to spend much time on testing).** Write only this set, and skip every other test named in the bullets below: (a) the hook tests of Step 3 (these stay as listed); (b) in `TaskEditField.test.jsx`: opens selected and focused, Save and Enter call `onSave`, Cancel calls `onCancel`, a refusal shows the message and keeps the text; (c) in `TaskItem.test.jsx`: Edit button named and starts the edit, the editing view replaces Edit and Delete, the checkbox keeps its name while editing, Esc cancels, an accepted save ends the edit and a refused one does not; (d) in `TaskList.test.jsx`: one test that the new inputs reach the rows; (e) in `App.test.jsx`: one test per acceptance criterion AC4.1.1 to AC4.1.5, one each for the three answered choices (same title, click elsewhere, second edit including edit A, Edit B, Edit A), the keyboard-only edit, Delete on another row while editing, the BR4.12 hide-and-show check, and a failed save; (f) one shared-messages test in `TaskForm.test.jsx`. Skip the axe variations, the markup and 200-character variants beyond the hook, and any other extra. The 80% line-coverage floor is not lowered: if it is not met by this set, add the smallest test that covers the missing lines. This keeps the strategy's per-piece obligation as far as the person's request allows and is noted in the code summary.
  - Extend `frontend/src/components/TaskForm.test.jsx` with a test that the add form still shows both refusal messages from the shared file, and that the shared function maps `empty`, `too-long` and an unknown reason to the right text.
  - New `frontend/src/components/TaskEditField.test.jsx`: opens with the saved title in the field, all selected and focused; names and hint are linked; Enter and Save call `onSave` with the typed text unchanged; Cancel calls `onCancel`; a refused result shows the message with the "(!)" mark as an alert, marks the field invalid, keeps the text and the focus; typing clears the message; a title with markup is kept as typed and not run.
  - Extend `frontend/src/components/TaskItem.test.jsx`: the Edit button is present and named "Edit" plus the title; it calls `onStartEdit` with the id by click, Enter and Space; Edit and Delete are not rendered and the field, Save and Cancel are, while `editingId` names the task; the checkbox keeps the saved title as its name while editing; the checkbox still toggles and the typed text stays; Esc from the field, Save, Cancel and the checkbox each cancel; an accepted save calls `onEndEdit(true)`; a refused save does not end the edit.
  - Extend `frontend/src/components/TaskList.test.jsx`: passes the four new inputs to every row.
  - Extend `frontend/src/App.test.jsx`: Edit opens the field with the saved title selected and focused (AC4.1.1); change and Enter saves, the new title shows, position kept, complete state kept, reload keeps it (AC4.1.2, AC4.1.5); Save by button does the same; Esc and Cancel keep the old title and return focus to the Edit button (AC4.1.3); empty, spaces-only and 201 characters show the add form's messages and change nothing (AC4.1.4); 200 characters are accepted; the same title closes like Cancel with `updatedAt` untouched and nothing saved (Q1); clicking elsewhere leaves the field open with its text (Q2); Edit on a second row drops the first edit (old title stays) and opens the second with focus in its field, and edit A, type, Edit B, Edit A again shows A's saved title selected with no message (Q3, BR4.1); the whole edit by keyboard only (Tab to Edit, Enter, type, Enter) and the Tab order while editing (checkbox, field, Save, Cancel); Delete on another row while a row is edited opens the dialog with the edit and its text kept, and neither dialog result changes them; the BR4.12 check: the page rendered with the hook made to hide the edited task and then show it again leaves the task not in editing, with its saved title and no focus taken (the hook is wrapped with `vi.spyOn` as the delete Unit's test does); a failed save keeps the edit on screen and shows the notice; the axe check passes while a row is edited, with and without a message.
  Run: `npx vitest run src/components/TaskEditField.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/components/TaskForm.test.jsx src/App.test.jsx` (from `frontend/`). Stories: US4.1 (AC4.1.1 to AC4.1.5), NFR3, NFR4. Files: `frontend/src/components/TaskEditField.test.jsx`, `frontend/src/components/TaskItem.test.jsx`, `frontend/src/components/TaskList.test.jsx`, `frontend/src/components/TaskForm.test.jsx`, `frontend/src/App.test.jsx`.
- [x] **Step 6: Repository, API and database layers: not applicable.** Saving reuses the existing storage service unchanged. Stories: none. Files: none.
- [x] **Step 7: Environment and checks.** From `frontend/`, run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 8: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC4.1.1 to AC4.1.5 and BR4.1 to BR4.13, each with an existing workspace file as target; checks that were not run are marked pending, not OK) and `source-manifest.json` (every file this Unit changed, with `frontend/` paths) under `construction/edit-task/code-generation/`. Stories: US4.1. Files: those three files.

## Files this plan creates or changes

`frontend/src/hooks/useTasks.js`, `frontend/src/components/titleMessages.js` (new), `frontend/src/components/TaskEditField.jsx` (new), `frontend/src/components/TaskItem.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/components/TaskForm.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/hooks/useTasks.test.jsx`, `frontend/src/components/TaskEditField.test.jsx` (new), `frontend/src/components/TaskItem.test.jsx`, `frontend/src/components/TaskList.test.jsx`, `frontend/src/components/TaskForm.test.jsx`, `frontend/src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US4.1 AC4.1.1 (Edit opens the field with the title, focus in it) | 4, 5 |
| US4.1 AC4.1.2 (Enter saves the new title) | 2, 3, 4, 5 |
| US4.1 AC4.1.3 (Esc keeps the old title) | 4, 5 |
| US4.1 AC4.1.4 (empty, spaces-only, 201 characters refused with the add messages) | 2, 3, 4, 5 |
| US4.1 AC4.1.5 (position and complete state kept) | 2, 3, 5 |
| BR4.5 to BR4.7 (same title, click away, second edit: Q1 to Q3) | 2, 3, 4, 5 |
| BR4.8, BR4.9 (edit result and order of checks, saving) | 2, 3, 4, 5 |
| BR4.10, BR4.11 (keyboard, names, plain text) | 4, 5 |
| BR4.12, BR4.13 (edited id, delete dialog, checkbox) | 4, 5 |
| NFR7 (coverage floor, suite green) | 3, 5, 7 |

## Assumptions & Open Questions

- [assumption] Focus containment and similar real-browser behaviour are not involved in this Unit; all behaviour checked here (selection of the field's text, focus, Esc, Tab order) can be shown in the simulated browser. Where the simulated browser cannot show something (the visual layout, contrast), it is listed as pending for a hand check in `code-summary.md`: the layout of the editing row (field, Save, Cancel, hint) in a real desktop browser and the contrast of the hint and message colors.
- [assumption] The shared refusal messages move to `titleMessages.js`; texts and behaviour of the add form do not change, and its existing tests stay green.
- [assumption] The way the edited id is kept from going stale (BR4.12) is left to the developer within the project's lint rules; the test that hides and shows the task decides whether it is right.
- [assumption] No new dependency is needed; the existing test tools cover the keyboard and accessibility checks.
- [assumption] Row-level Esc handling uses the keyboard event reaching the row; the design allows any equivalent that makes Esc cancel from every control inside the editing row and do nothing outside it.
- Open question: contract C5 gets the additive inputs `editingId`, `onStartEdit` and `onEndEdit` (listed in the functional design for the contract's owner to approve); this plan builds them.
- Open question: `docs/ARCHITECTURE.md` does not list `DeleteDialog`, `TaskEditField` or `titleMessages` among the components; its owner makes that edit.
- Open question: Git is not set up, so nothing is committed.
