# Code Generation Plan: storage-note (U8), Todo List Frontend (Phase 1)

## Summary

- Builds: the always-visible line "Your tasks are saved in this browser only." directly under the page title
- Touches: `frontend/src/App.jsx`, `frontend/src/styles.css` and the test file `frontend/src/App.test.jsx`; no new files
- Tests: about 3 new automated tests (page), kept lean as asked earlier; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U8 storage-note, story US8.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflow W1, rules BR8.1 to BR8.5): `aidlc/spaces/default/intents/261015-todo-frontend/construction/storage-note/functional-design/functional-spec.md` and `frontend-components.md`
- The existing page code this builds on: `frontend/src/App.jsx`
- NFR requirements and design of add-task (inherited unchanged; NFR Requirements, NFR Design and Infrastructure Design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
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

- [x] **Step 1: Claim the work on the shared board.** Add a row for U8 storage-note in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US8.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Implement the line.** In `frontend/src/App.jsx`, add one paragraph with the exact text "Your tasks are saved in this browser only." and `data-testid="storage-note"` directly after the page title and before the message line, add row and the rest (BR8.1 to BR8.4); it is fixed text, not a live region, not a control, and takes no state or input (BR8.5). In `frontend/src/styles.css` add the muted style for it (the `--muted` color, a little space below; no animation). Stories: US8.1 (AC8.1.1, AC8.1.2). Files: `frontend/src/App.jsx`, `frontend/src/styles.css`.
- [x] **Step 3: Write and run the tests.** Lean scope (the person asked earlier not to spend much time on testing): extend `frontend/src/App.test.jsx` with: a first visit with an empty list shows the line with the exact text (AC8.1.1); with saved tasks the same line is shown (AC8.1.2); the line is shown while a load or save message is showing and comes after the page title and before the message line in the page (BR8.3, BR8.4). Run: `npx vitest run src/App.test.jsx` (from `frontend/`). Stories: US8.1 (AC8.1.1, AC8.1.2). Files: `frontend/src/App.test.jsx`.
- [x] **Step 4: Repository, API, database and hook layers: not applicable.** Nothing is saved or changed in state by this Unit. Stories: none. Files: none.
- [x] **Step 5: Environment and checks.** From `frontend/`, run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 6: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC8.1.1, AC8.1.2 and BR8.1 to BR8.5, each with an existing workspace file as target; checks that were not run are marked pending, not OK) and `source-manifest.json` (every file this Unit changed, with `frontend/` paths) under `construction/storage-note/code-generation/`. Stories: US8.1. Files: those three files.

## Files this plan creates or changes

`frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US8.1 AC8.1.1 (the line shows with an empty list) | 2, 3 |
| US8.1 AC8.1.2 (the line shows with tasks) | 2, 3 |
| BR8.3, BR8.4 (always shown, under the title, plain muted text) | 2, 3 |
| BR8.5 (no state, storage or component) | 2 |
| NFR7 (coverage floor, suite green) | 3, 5 |

## Assumptions & Open Questions

- [assumption] The simulated browser can show everything this Unit does; the contrast of the muted line (`#6b7280` on white, 4.83 to 1 as calculated earlier) and its look under the title in a real desktop browser are listed as pending for a hand check in `code-summary.md`.
- [assumption] No new dependency is needed.
- Open question: Git is not set up, so nothing is committed.
