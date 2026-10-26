# Code Generation Plan: filter-tasks (U5), Todo List Frontend (Phase 1)

## Summary

- Builds: the All, Active and Completed filter: filter state in the hook, a new `FilterBar` block at the right of the summary line, the "No tasks match this filter." message, and the focus move when a tick takes a row out of view
- Touches: `frontend/src/hooks/useTasks.js`, `frontend/src/App.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/styles.css`, a new file `frontend/src/components/FilterBar.jsx`, and their test files
- Tests: a lean set of about 16 new automated tests (hook, block, list, page) including the count-unchanged test handed over by count-remaining, kept short as asked earlier; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U5 filter-tasks, story US5.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflows W1 to W4, rules BR5.1 to BR5.11, components): `aidlc/spaces/default/intents/261015-todo-frontend/construction/filter-tasks/functional-design/functional-spec.md` and `frontend-components.md`
- The earlier designs and code this builds on (count line and `remaining`, empty-list hint, delete focus rule, edit rule BR4.12): `aidlc/spaces/default/intents/261015-todo-frontend/construction/count-remaining/functional-design/functional-spec.md` and the existing code in `frontend/src/`
- NFR requirements and design of add-task (inherited unchanged; NFR Requirements, NFR Design and Infrastructure Design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
- Answers [Q1] and [Q2] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/filter-tasks/functional-design/functional-design-questions.md`
- Three clarifications from the design review, taken into this plan (the review was recorded on the design as written): (1) the edit-under-filter check handed over by edit-task is written here: start editing a row, choose a filter that hides it, then choose All again; the row shows its saved title and is not in editing; (2) the page sets a focus request for a tick only when the task is still in the shown list and the tick will take effect, so a request cannot be left over after an ignored tick; (3) a tick can only make a shown row leave the list (the case of a row starting to match happens only through another tab's change), so no tick test is written for a row that appears.
- The app lives in the `frontend/` folder; every source path below starts with `frontend/`.
- The work is done on the Git branch `task-filter`.

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

Test-after, layer by layer: the hook first (business logic), then the block, the list and the page (frontend behavior). The project, test runner and tools already exist; the runner command is run from the `frontend/` folder. The storage, API and database layers do not apply.

- [x] **Step 1: Claim the work on the shared board.** Add a row for U5 filter-tasks in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US5.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Add the filter to the hook.** In `frontend/src/hooks/useTasks.js` hold the chosen filter (`all`, `active` or `completed`; starts as `all` on every page load; never saved) and return `filter` and `setFilter(value)` (a value that is not one of the three is ignored). Return `visibleTasks` as the full list narrowed by the filter, in the full list's order (all: every task; active: `completed` false; completed: `completed` true). Keep `hasTasks` and `remaining` derived from the full list (`tasks`), never from `visibleTasks` (BR5.1, BR5.4, BR5.6, BR5.7). A list replaced by another tab does not change the filter. Update the file's header comment. Stories: US5.1 (AC5.1.1, AC5.1.4). Files: `frontend/src/hooks/useTasks.js`.
- [x] **Step 3: Write and run the tests for the hook.** Extend `frontend/src/hooks/useTasks.test.jsx`: the filter starts as all and `visibleTasks` is every task; with one active and one complete task the three filters give 2, 1 and 1 tasks in the full list's order (AC5.1.1); `remaining` and `hasTasks` do not change with the filter; a task that is ticked under active leaves `visibleTasks` at once; the filter is not saved (a new hook starts at all) and a list replaced by another tab keeps the chosen filter; an unknown filter value is ignored. Run: `npx vitest run src/hooks/useTasks.test.jsx` (from `frontend/`). Stories: US5.1, BR5.1, BR5.4, BR5.6, BR5.7. Files: `frontend/src/hooks/useTasks.test.jsx`.
- [x] **Step 4: Implement the block, the message and the page wiring.**
  - New `frontend/src/components/FilterBar.jsx`: inputs `filter` and `onChange(value)`; a group labeled "Filter tasks" with three native buttons All, Active, Completed in that order; the chosen one has a pressed state and an accent border with bold text, the others not pressed; pressing a button calls `onChange` with its value; `data-testid` on the group and each button (BR5.2, BR5.5).
  - `frontend/src/components/TaskList.jsx`: when `hasTasks` is true and `tasks` is empty, render a plain paragraph "No tasks match this filter." with `data-testid="filter-empty"`; the "No tasks yet. Add one above." hint stays for `hasTasks` false; the two never show together (BR5.3).
  - `frontend/src/App.jsx`: take `filter` and `setFilter` from the hook and render `FilterBar` in the summary line at the right of the `Counter` (BR5.11). Wrap the toggle: when the toggled task is in the shown list and the tick or untick will take it out of view (a tick while active is chosen, an untick while completed is chosen), work out the focus target from the shown list before the change (the checkbox of the task now at the row's place, else the one above, else the add input), set the focus request only then, and call `toggle`; otherwise just call `toggle` and set no request (BR5.8). Pressing a filter button moves no focus.
  - `frontend/src/styles.css`: the summary line holds the count at the left and the buttons at the right; the button look (accent border and bold for the chosen one, focus ring on each); no animation.
  Stories: US5.1 (AC5.1.1 to AC5.1.5). Files: `frontend/src/components/FilterBar.jsx`, `frontend/src/components/TaskList.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`.
- [x] **Step 5: Write and run the tests for the block, the list and the page.** Lean scope (the person asked earlier not to spend much time on testing): new `frontend/src/components/FilterBar.test.jsx`: three buttons in order inside a group labeled "Filter tasks"; the chosen one is pressed and the others not; pressing calls `onChange` with the value; Enter and Space work by keyboard. Extend `frontend/src/components/TaskList.test.jsx`: "No tasks match this filter." when `hasTasks` is true and `tasks` is empty, and not the empty hint; the hint when `hasTasks` is false, and not the filter message. Extend `frontend/src/App.test.jsx`: choosing All, Active and Completed shows 2, 1 and 1 tasks for one active and one complete task (AC5.1.1); the chosen button is pressed (AC5.1.2); the filter message shows when nothing matches (AC5.1.3); after choosing Active and reloading, All is chosen (AC5.1.4); the buttons are reachable and chosen by keyboard only (AC5.1.5); the count line reads the same under every filter with a mixed list (BR5.6, the test handed over by count-remaining); a tick under Active removes the row and moves focus to the next row's checkbox, the one above when it was last, the add input when none is left (Q1, BR5.8); a task added while Completed is chosen is not shown, the filter stays Completed and the count goes up (Q2, BR5.9); a row being edited that a filter hides ends its edit, and after choosing All again it shows its saved title and is not in editing (BR5.10, the test handed over by edit-task). Run: `npx vitest run src/components/FilterBar.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` (from `frontend/`). Adjust any earlier test that the new summary line or the filtered list changes by the minimum needed, weakening no assertion. Stories: US5.1 (AC5.1.1 to AC5.1.5), NFR3. Files: `frontend/src/components/FilterBar.test.jsx`, `frontend/src/components/TaskList.test.jsx`, `frontend/src/App.test.jsx`.
- [x] **Step 6: Storage, API and database layers: not applicable.** The filter is screen state and is never saved. Stories: none. Files: none.
- [x] **Step 7: Environment and checks.** From `frontend/`, run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 8: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC5.1.1 to AC5.1.5 and BR5.1 to BR5.11, each with an existing workspace file as target; checks that were not run are marked pending, not OK; the count-unchanged test of BR5.6 closes the item count-remaining left deferred) and `source-manifest.json` (every file this Unit changed, with `frontend/` paths) under `construction/filter-tasks/code-generation/`. Stories: US5.1. Files: those three files.

## Files this plan creates or changes

`frontend/src/hooks/useTasks.js`, `frontend/src/components/FilterBar.jsx` (new), `frontend/src/components/TaskList.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/hooks/useTasks.test.jsx`, `frontend/src/components/FilterBar.test.jsx` (new), `frontend/src/components/TaskList.test.jsx`, `frontend/src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US5.1 AC5.1.1 (All, Active, Completed show 2, 1, 1) | 2, 3, 4, 5 |
| US5.1 AC5.1.2 (chosen button highlighted and pressed) | 4, 5 |
| US5.1 AC5.1.3 ("No tasks match this filter.") | 4, 5 |
| US5.1 AC5.1.4 (All after a reload) | 2, 3, 5 |
| US5.1 AC5.1.5 (keyboard only) | 4, 5 |
| BR5.6 (count unchanged by the filter; AC7.1.4 handed over) | 2, 3, 5 |
| BR5.8, BR5.9 (focus after a tick, add under Completed: Q1 and Q2) | 4, 5 |
| BR5.10 (edit hidden by a filter; handed over by edit-task) | 5 |
| NFR7 (coverage floor, suite green) | 3, 5, 7 |

## Assumptions & Open Questions

- [assumption] The simulated browser can show everything this Unit does; the look of the buttons at the right of the summary line, the chosen state and the contrast are listed as pending for a hand check in `code-summary.md`.
- [assumption] No new dependency is needed.
- Open question: Git: the work is on the branch `task-filter`; nothing is committed by this plan.
