# Code Generation Plan: count-remaining (U7), Todo List Frontend (Phase 1)

## Summary

- Builds: the "N items left" line below the list: the hook returns `remaining`, a new `Counter` block shows it, and the page places it in a summary line under the list
- Touches: `frontend/src/hooks/useTasks.js`, `frontend/src/App.jsx`, `frontend/src/styles.css`, a new file `frontend/src/components/Counter.jsx`, and their test files
- Tests: a lean set of about 10 new automated tests (hook, block, page), kept short as asked earlier; the 80% line-coverage floor stays

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U7 count-remaining, story US7.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflows W1 to W3, rules BR7.1 to BR7.7, components): `aidlc/spaces/default/intents/261015-todo-frontend/construction/count-remaining/functional-design/functional-spec.md` and `frontend-components.md`
- The existing code this builds on: `frontend/src/hooks/useTasks.js` and `frontend/src/App.jsx`
- NFR requirements and design of add-task (inherited unchanged; NFR Requirements, NFR Design and Infrastructure Design were skipped for this Unit): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/`
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`
- Clarifications from the design review, taken into this plan (the review was recorded on the design as written): the `Counter` is rendered on every render of the page, including the first, and only its text changes, because a live region added later together with its text is not reliably announced; it is one text element with no child elements that carries the status role (the role is an attribute, not markup); the spoken announcement cannot be heard by the automated suite and is checked by hand; the filter unit must derive `remaining` from the full list, not from the shown list, and add the test that switches All, Active and Completed with a mixed list and asserts the count is unchanged (AC7.1.4 is fully verified only then); the line uses the normal text color, a deliberate departure from the design-system mapping's muted color, listed below for the owner.
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

Test-after, layer by layer: the hook first (business logic), then the display block and the page (frontend behavior). The project, test runner and tools already exist; the runner command is run from the `frontend/` folder. The storage, API and database layers do not apply.

- [x] **Step 1: Claim the work on the shared board.** Add a row for U7 count-remaining in `docs/TASKS.md` listing the files below and set it to `in-progress`. Stories: US7.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Return `remaining` from the hook.** In `frontend/src/hooks/useTasks.js` return `remaining`: the number of tasks in the full list held by the hook (`tasks`, not `visibleTasks` or any shown list) whose `completed` is false, derived on every render, never saved and held in no state of its own (BR7.1, BR7.3, BR7.4, BR7.7). Update the file's header comment. Stories: US7.1 (AC7.1.1 to AC7.1.4). Files: `frontend/src/hooks/useTasks.js`.
- [x] **Step 3: Write and run the tests for the hook.** Extend `frontend/src/hooks/useTasks.test.jsx`: `remaining` is 2 with three tasks of which one is complete; it is 0 with no tasks and with all tasks complete; it goes down on tick and on deleting an incomplete task, up on untick and on add, and does not change on deleting a complete task or on editing a title; it follows a list replaced by another tab. Run: `npx vitest run src/hooks/useTasks.test.jsx` (from `frontend/`). Stories: US7.1, BR7.1, BR7.3. Files: `frontend/src/hooks/useTasks.test.jsx`.
- [x] **Step 4: Implement the block and the page wiring.** New `frontend/src/components/Counter.jsx`: input `remaining` (a number); renders one text element, with no child elements, whose text is "1 item left" for exactly one and "N items left" for every other number including 0 (digits), with the status role and a polite live setting and `data-testid="counter"` (BR7.2, BR7.6). `frontend/src/App.jsx`: take `remaining` from the hook and render `Counter` on every render of the page (never conditionally), in a summary line directly below the list, separated from it by a thin rule, with the count at the left and the right side left free for the filter buttons that arrive later (BR7.5). `frontend/src/styles.css`: the summary line (rule above, spacing, count at the left; normal text color; no animation). Stories: US7.1 (AC7.1.1 to AC7.1.3), AC9.1.1 (count part). Files: `frontend/src/components/Counter.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`.
- [x] **Step 5: Write and run the tests for the block and the page.** Lean scope (the person asked earlier not to spend much time on testing): new `frontend/src/components/Counter.test.jsx`: "2 items left" for 2, "1 item left" for 1, "0 items left" for 0, "100 items left" for 100; one text element with the status role and no alert role. Extend `frontend/src/App.test.jsx`: the element with the status role exists on the first render with the correct text; on a first visit with an empty list the line reads "0 items left" (the count part of AC9.1.1); three tasks of which one is complete read "2 items left" (AC7.1.1); its text changes after tick, untick, add and delete and after a reload with saved tasks (AC7.1.3); it is shown beside the load-failed message. The spoken announcement cannot be heard in the automated suite and is checked by hand. Adjust any earlier test that looks for the status role by the minimum needed (for example one that expects a single status element), weakening no assertion. Run: `npx vitest run src/components/Counter.test.jsx src/App.test.jsx` (from `frontend/`). Stories: US7.1 (AC7.1.1 to AC7.1.3), AC9.1.1 (count part). Files: `frontend/src/components/Counter.test.jsx`, `frontend/src/App.test.jsx`.
- [x] **Step 6: Storage, API and database layers: not applicable.** Nothing is saved or changed in storage by this Unit. Stories: none. Files: none.
- [x] **Step 7: Environment and checks.** From `frontend/`, run the whole suite (`npm test`), `npm run lint`, `npm run format:check`, `npm run build`, the coverage report (at least 80% of lines; the threshold is not lowered) and `npm audit` (read, not blocking). No configuration file changes are planned. Stories: NFR7. Files: none unless a check needs a fix inside this Unit's files.
- [x] **Step 8: Documentation and traceability.** Write `code-summary.md`, `traceability.json` (AC7.1.1 to AC7.1.4 and BR7.1 to BR7.7, each with an existing workspace file as target; AC7.1.4 is marked pending, with a target text saying it is fully verified only when the filter unit adds the filter and its test; checks that were not run are marked pending, not OK) and `source-manifest.json` (every file this Unit changed, with `frontend/` paths) under `construction/count-remaining/code-generation/`. Stories: US7.1. Files: those three files.

## Files this plan creates or changes

`frontend/src/hooks/useTasks.js`, `frontend/src/components/Counter.jsx` (new), `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/src/hooks/useTasks.test.jsx`, `frontend/src/components/Counter.test.jsx` (new), `frontend/src/App.test.jsx`, `docs/TASKS.md`.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US7.1 AC7.1.1 (2 items left for three tasks of which one is complete) | 2, 3, 4, 5 |
| US7.1 AC7.1.2 (1 item left, 0 items left) | 2, 3, 4, 5 |
| US7.1 AC7.1.3 (updates after add, tick, untick, delete, reload) | 2, 3, 4, 5 |
| US7.1 AC7.1.4 (independent of the filter) | 2 (derived from the full list); the test belongs to the filter unit |
| AC9.1.1 (count part: "0 items left" with an empty list) | 4, 5 |
| BR7.5, BR7.6 (always shown below the list, polite live region, plain text) | 4, 5; the spoken announcement by hand |
| NFR7 (coverage floor, suite green) | 3, 5, 7 |

## Assumptions & Open Questions

- [assumption] The simulated browser can show everything this Unit does except the spoken announcement and the look; the announcement with a real screen reader, the look of the summary line and the contrast of the normal text color on white are listed as pending for a hand check in `code-summary.md`.
- [assumption] The line uses the normal text color; the design-system mapping gives the count the muted color, so this is a deliberate departure for the owner of the design file to confirm; either color meets 4.5 to 1.
- [assumption] No new dependency is needed.
- Open question: when the filter unit is built it must read `remaining` as the hook returns it (from the full list) and add the All, Active and Completed test; AC7.1.4 is fully verified only then.
- Open question: Git is not set up, so nothing is committed.
