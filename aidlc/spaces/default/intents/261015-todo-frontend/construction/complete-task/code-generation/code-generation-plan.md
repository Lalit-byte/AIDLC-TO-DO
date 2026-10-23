# Code Generation Plan: complete-task (U2), Todo List Frontend (Phase 1)

## Summary

- Builds: ticking a task as done and unticking it again: a checkbox in each row, the muted line-through look, and the `toggle` action that keeps position and saves
- Touches: `src/hooks/useTasks.js`, `src/components/TaskItem.jsx`, `src/components/TaskList.jsx`, `src/App.jsx`, `src/styles.css` and their test files; no new files except tests
- Tests: about 20 new automated tests (hook, row, list, page) including keyboard, accessibility, failed save and a 100-task speed guard, added to the existing 91; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U2 complete-task, story US2.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflow W1, rules BR2.1 to BR2.9, components): `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/functional-spec.md` and `frontend-components.md`
- The add-task designs and code that this Unit builds on (save after the draw, notices, accessibility and lint controls): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-design/` and the existing `src/`
- NFR design and requirements of add-task (inherited unchanged; NFR requirements, NFR design and infrastructure design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Contracts C3 to C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
- Answers [Q1] and [Q2] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/functional-design-questions.md`

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

Test-after, layer by layer: the hook first (business logic), then the row, list and page (frontend behavior). The project, test runner and tools already exist from add-task, so no setup or bootstrap step is needed; the runner command is the one already recorded. Storage needs no change: `toggle` changes the list and the existing whole-list `save` writes it. Repository, API and database layers do not apply.

- [x] **Step 1: Claim the work on the shared board.** Add a row for U2 complete-task in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US2.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Implement `toggle` in the hook.** In `src/hooks/useTasks.js` add `toggle(id)` (return it beside `add`): find the task in the latest list (`tasksRef`); if it is not there, change nothing and start no save (BR2.9); otherwise build a new list in which only that task has `completed` flipped and `updatedAt` set to the time of the change, same position, other fields and tasks unchanged (BR2.1, BR2.2, BR2.4); put the list on screen and raise the same "save is due" record `add` uses, so the save runs after the row is drawn and a failed save keeps the change and shows the notice (BR2.8). Two quick toggles flip twice on the latest list and give one save. Stories: US2.1 (AC2.1.1, AC2.1.3, AC2.1.4). Files: `src/hooks/useTasks.js`.
- [x] **Step 3: Write and run the tests for the hook.** Extend `src/hooks/useTasks.test.jsx`: toggle flips an incomplete task to complete and back; `updatedAt` changes and `id`, `title`, `createdAt` do not; the task keeps its position among three; other tasks are untouched; an unknown id changes nothing and starts no save; two quick toggles end in the starting state with one save of the latest list; after a failed save the change stays and the notice is `save-failed`, and the next successful save writes it and clears the notice; the saved list holds the new `completed` value after the post-paint step. Run: `npx vitest run src/hooks/useTasks.test.jsx`. Stories: US2.1, BR2.1 to BR2.9. Files: `src/hooks/useTasks.test.jsx`.
- [x] **Step 4: Implement the checkbox and the complete look.** `src/components/TaskItem.jsx`: a native checkbox controlled by `task.completed`, with `data-testid`, named by the task's title through `aria-labelledby` pointing at the title text (the title is not a clickable label); `onToggle(task.id)` when it changes; a complete task gets a modifier class for the muted color and line-through (BR2.3, BR2.6, BR2.7). `src/components/TaskList.jsx`: accept `onToggle` and pass it to each row. `src/App.jsx`: pass the hook's `toggle` as `onToggle`. `src/styles.css`: the complete look (`#6b7280`, line-through), the row layout with the checkbox level with the first line, and the focus ring. Stories: US2.1 (AC2.1.1, AC2.1.2, AC2.1.4). Files: `src/components/TaskItem.jsx`, `src/components/TaskList.jsx`, `src/App.jsx`, `src/styles.css`.
- [x] **Step 5: Write and run the tests for the row, list and page.** Extend `src/components/TaskItem.test.jsx`, `src/components/TaskList.test.jsx` and `src/App.test.jsx`: the checkbox is unticked for an incomplete task and ticked for a complete one; clicking it calls `onToggle` with the id; the complete row has the muted line-through look and the incomplete one does not; clicking the title text does not toggle; the accessible name of the checkbox is the task's title; Space on the focused checkbox toggles it (keyboard only); the list passes `onToggle` to each row; on the page, ticking the second of three tasks leaves it second and shows it complete, a reload shows the saved complete state, the axe check passes with a complete task, a failed save keeps the change and shows the notice, and toggling in a list of 100 saved tasks takes under 100 ms of code time (a regression guard only). Run: `npx vitest run src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx`. Stories: US2.1 (AC2.1.1 to AC2.1.4), NFR3, NFR1. Files: the three test files.
- [x] **Step 6: Repository, API and database layers: not applicable.** Saving reuses the existing storage service unchanged. Stories: none. Files: none.
- [x] **Step 7: Environment and checks.** Run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 8: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC2.1.1 to AC2.1.4 and BR2.1 to BR2.9, each with an existing workspace file as target; checks that were not run are marked pending, not OK) and `source-manifest.json` (every file this Unit changed) under `construction/complete-task/code-generation/`. Stories: US2.1. Files: those three files.

## Files this plan creates or changes

`src/hooks/useTasks.js`, `src/components/TaskItem.jsx`, `src/components/TaskList.jsx`, `src/App.jsx`, `src/styles.css`, `src/hooks/useTasks.test.jsx`, `src/components/TaskItem.test.jsx`, `src/components/TaskList.test.jsx`, `src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US2.1 AC2.1.1 (tick and untick) | 2, 3, 4, 5 |
| US2.1 AC2.1.2 (muted, line through, not color alone) | 4, 5 |
| US2.1 AC2.1.3 (position unchanged) | 2, 3, 5 |
| US2.1 AC2.1.4 (Space toggles, under 100 ms for 100 tasks) | 2, 4, 5 |
| BR2.6, BR2.7 (title does not toggle, checkbox name) | 4, 5 |
| BR2.8, BR2.9 (saving, unknown id) | 2, 3 |
| NFR7 (coverage floor, suite green) | 3, 5, 7 |

## Assumptions & Open Questions

- [assumption] The checkbox name uses `aria-labelledby` with an id derived from the task's id; the exact id format is chosen in the code.
- [assumption] No new dependency is needed; the existing test tools cover the keyboard and accessibility checks.
- [assumption] The manual checks of add-task (Chrome timing, contrast checker, four browsers) are still open and are not repeated for this Unit; the complete look's contrast (muted text on white, 4.83 to 1 as calculated in add-task) is listed in the code summary for the same hand check.
- Open question: the notice-wording point from the design review (BR2.8 says the next good save clears the notice; only the save-failed notice clears) is a wording matter in the design document and does not change the code, which follows the add-task state machine.
- Open question: Git is not set up, so nothing is committed.
