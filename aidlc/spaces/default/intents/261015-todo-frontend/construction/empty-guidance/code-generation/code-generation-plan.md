# Code Generation Plan: empty-guidance (U9), Todo List Frontend (Phase 1)

## Summary

- Builds: the hint "No tasks yet. Add one above." in the list area when there are no tasks at all
- Touches: `frontend/src/components/TaskList.jsx`, `frontend/src/styles.css` and the test files `frontend/src/components/TaskList.test.jsx` and `frontend/src/App.test.jsx`; no new files
- Tests: about 6 new automated tests (list block and page) covering both acceptance criteria and the load-failed case, kept lean as asked earlier; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U9 empty-guidance, story US9.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflows W1 to W3, rules BR9.1 to BR9.7): `aidlc/spaces/default/intents/261015-todo-frontend/construction/empty-guidance/functional-design/functional-spec.md` and `frontend-components.md`
- The earlier designs and code this Unit builds on (the list block, the notices): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and the existing code in `frontend/src/`
- NFR requirements and design of add-task (inherited unchanged; NFR Requirements, NFR Design and Infrastructure Design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
- Answer [Q1] in `aidlc/spaces/default/intents/261015-todo-frontend/construction/empty-guidance/functional-design/functional-design-questions.md`
- Two clarifications from the design review, taken into this plan (the review was recorded on the design as written): the empty branch of `TaskList` is decided by `hasTasks`, not by the length of `tasks`, so it stays right once the filter unit makes `tasks` a filtered list (when `hasTasks` is true and `tasks` is empty the filter unit's own message applies, not this hint); and the hint's test id is `empty-hint`.
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

Test-after: this Unit is one frontend behaviour, so there is one implement step and one test step. The hook, storage, repository, API and database layers are not touched. The project, test runner and tools already exist; the runner command is run from the `frontend/` folder.

- [x] **Step 1: Claim the work on the shared board.** Add a row for U9 empty-guidance in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US9.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Implement the hint.** In `frontend/src/components/TaskList.jsx`, accept `hasTasks` (the page already passes it) and decide the empty branch by it: when `hasTasks` is false, render a paragraph (not a list item, no empty list element) with the exact text "No tasks yet. Add one above." and `data-testid="empty-hint"`; when `hasTasks` is true render the list as it does now; when `hasTasks` is true and `tasks` is empty render nothing (the filter unit's message is its own) (BR9.1 to BR9.4, BR9.6). Update the file's header comment, which says the empty message arrives later. In `frontend/src/styles.css` add the muted style for the hint (the `--muted` color, a little space above; no animation) (BR9.5). The hint is plain text, not a live region, not a control. Stories: US9.1 (AC9.1.1, AC9.1.2). Files: `frontend/src/components/TaskList.jsx`, `frontend/src/styles.css`.
- [x] **Step 3: Write and run the tests.** Lean scope (the person asked earlier not to spend much time on testing): extend `frontend/src/components/TaskList.test.jsx` with: the hint shows with the exact text when `hasTasks` is false; no hint and the rows show when tasks exist; nothing shows when `hasTasks` is true and `tasks` is empty. Extend `frontend/src/App.test.jsx` with: a first visit shows the hint (AC9.1.1, hint part); adding the first task removes the hint and deleting the last task brings it back (AC9.1.2, BR9.3); with the saved data unreadable the hint shows beside the load-failed notice (Q1, BR9.4). The existing tests that assert the empty list shows no rows stay green. The "0 items left" part of AC9.1.1 is checked in the count unit, not here. Run: `npx vitest run src/components/TaskList.test.jsx src/App.test.jsx` (from `frontend/`). Stories: US9.1 (AC9.1.1, AC9.1.2). Files: `frontend/src/components/TaskList.test.jsx`, `frontend/src/App.test.jsx`.
- [x] **Step 4: Repository, API, database and hook layers: not applicable.** Nothing is saved or changed in state by this Unit. Stories: none. Files: none.
- [x] **Step 5: Environment and checks.** From `frontend/`, run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 6: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC9.1.1, AC9.1.2 and BR9.1 to BR9.7, each with an existing workspace file as target; BR9.7 and the count part of AC9.1.1 are marked as belonging to the count unit, not OK here; checks that were not run are marked pending, not OK) and `source-manifest.json` (every file this Unit changed, with `frontend/` paths) under `construction/empty-guidance/code-generation/`. Stories: US9.1. Files: those three files.

## Files this plan creates or changes

`frontend/src/components/TaskList.jsx`, `frontend/src/styles.css`, `frontend/src/components/TaskList.test.jsx`, `frontend/src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US9.1 AC9.1.1 (first visit shows the hint; the count line is the count unit's) | 2, 3 |
| US9.1 AC9.1.2 (hint after the last task is deleted) | 2, 3 |
| BR9.3 (hint goes when a task exists) | 2, 3 |
| BR9.4 (hint beside the load-failed notice, Q1) | 2, 3 |
| BR9.5, BR9.6 (plain muted text, nothing else changes, independent of the filter) | 2, 3 |
| NFR7 (coverage floor, suite green) | 3, 5 |

## Assumptions & Open Questions

- [assumption] The simulated browser can show everything this Unit does; the contrast of the muted hint (`#6b7280` on white, 4.83 to 1 as calculated earlier) is listed as pending for a hand check in `code-summary.md`, with the look of the hint in a real desktop browser.
- [assumption] The existing tests that call `TaskList` with an empty `tasks` and no `hasTasks` (written before this Unit) may need `hasTasks` passed or the expectation adjusted; any such change is the minimum needed and weakens no assertion.
- [assumption] No new dependency is needed.
- Open question: the "0 items left" line of AC9.1.1 belongs to the count unit (U7), which is built later.
- Open question: Git is not set up, so nothing is committed.
