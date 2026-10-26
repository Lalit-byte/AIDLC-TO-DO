# Unit Test Instructions: filter-tasks (U5), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2 to 7).
- Testing Contract (test-after, layer by layer; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/filter-tasks/functional-design/functional-spec.md`

## Framework and setup

The test setup is reused unchanged: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom; `frontend/vite.config.js` holds the configuration and the 80% line threshold; `frontend/src/test/setup.js` clears browser storage before every test; `frontend/src/test/tasks.js` builds valid tasks and saved text. Nothing new is installed and no new helper is needed.

## How to run this Unit's tests

Run from the `frontend/` folder; the commands name exact test files. Several files are shared with earlier Units (this Unit adds tests to them), so the commands also run those Units' tests in the same files.

| Layer | Command |
|-------|---------|
| State hook (plan Step 3) | `npx vitest run src/hooks/useTasks.test.jsx` |
| Block, list and page (plan Step 5) | `npx vitest run src/components/FilterBar.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 7) | `npx vitest run --coverage src/hooks/useTasks.test.jsx src/components/FilterBar.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test` in `frontend/`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Lean scope, as the person asked earlier not to spend much time on testing: about 16 new tests defined in plan Steps 3 and 5, each covering an acceptance criterion, a rule that is new in this Unit, an answered choice or a test handed over by an earlier Unit. The standard strategy's five to eight per piece is therefore only partly met; the coverage floor is met.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Hook | starts as all; the three filters give 2, 1 and 1 for one active and one complete task, in order; `remaining` and `hasTasks` unchanged by the filter; a ticked task leaves under active; not saved, and another tab's list keeps the filter; an unknown value is ignored |
| Block | three buttons in order in a group labeled "Filter tasks"; the chosen one pressed; press calls `onChange`; Enter and Space |
| List | the filter message for `hasTasks` true with no tasks shown, not the hint; the hint for `hasTasks` false, not the filter message |
| Page | AC5.1.1 to AC5.1.5; the count unchanged under every filter with a mixed list; a tick under Active removes the row and moves focus (next, above, add input); an add under Completed is not shown, the filter stays and the count goes up; an edited row hidden by a filter ends its edit and is not in editing when All is chosen again |

## Mocking and stubbing guidance

Same as the earlier Units: use the simulated browser's own storage; put saved tasks in storage for the reload case; dispatch a storage event for the other-tab case. Never weaken an assertion or lower the coverage threshold.

## Test data management

Use the helpers in `frontend/src/test/`; each test starts from cleared storage.

## Manual checks recorded at the checkpoint

Pending until a person does them in a real desktop browser, noted in `code-summary.md`: the look of the three buttons at the right of the summary line and of the chosen state (accent border, bold); the focus ring on each button; the contrast of the text and border colors.

## Assumptions & Open Questions

- [assumption] The shared test files are extended, not replaced; earlier Units' tests in them must stay green; an earlier test that the new summary line or the filtered list changes is adjusted by the minimum and weakens no assertion.
- Open question: none.
