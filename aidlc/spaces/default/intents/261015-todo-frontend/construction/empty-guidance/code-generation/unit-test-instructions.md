# Unit Test Instructions: empty-guidance (U9), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2, 3 and 5).
- Testing Contract (test-after; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/empty-guidance/functional-design/functional-spec.md`

## Framework and setup

The test setup is reused unchanged: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom; `frontend/vite.config.js` holds the configuration and the 80% line threshold; `frontend/src/test/setup.js` clears browser storage before every test; `frontend/src/test/tasks.js` builds valid tasks. Nothing new is installed and no new helper is needed.

## How to run this Unit's tests

Run from the `frontend/` folder; the commands name exact test files. The files are shared with earlier Units (this Unit adds tests to them), so the commands also run those Units' tests in the same files.

| Layer | Command |
|-------|---------|
| List block and page (plan Step 3) | `npx vitest run src/components/TaskList.test.jsx src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 5) | `npx vitest run --coverage src/components/TaskList.test.jsx src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test` in `frontend/`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Lean scope, as the person asked earlier not to spend much time on testing: about 6 new tests (the standard strategy's five to eight per piece applies to one small piece here), each covering an acceptance criterion or the answered choice.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| List | the hint shows with the exact text when `hasTasks` is false; no hint and the rows show when tasks exist; nothing shows when `hasTasks` is true and `tasks` is empty |
| Page | a first visit shows the hint; adding the first task removes it and deleting the last task brings it back; with unreadable saved data the hint shows beside the load-failed notice |

## Mocking and stubbing guidance

Same as the earlier Units: use the simulated browser's own storage; put invalid text in storage to simulate unreadable saved data. Never weaken an assertion or lower the coverage threshold.

## Test data management

Use the helpers in `frontend/src/test/`; each test starts from cleared storage.

## Manual checks recorded at the checkpoint

Pending until a person does them in a real desktop browser, noted in `code-summary.md`: how the hint looks in the list area and the contrast of its muted color.

## Assumptions & Open Questions

- [assumption] The shared test files are extended, not replaced; earlier Units' tests in them must stay green; an earlier test that needs `hasTasks` passed is adjusted by the minimum and weakens no assertion.
- Open question: none.
