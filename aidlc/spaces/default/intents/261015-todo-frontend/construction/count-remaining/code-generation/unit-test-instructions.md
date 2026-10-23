# Unit Test Instructions: count-remaining (U7), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2 to 7).
- Testing Contract (test-after, layer by layer; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/count-remaining/functional-design/functional-spec.md`

## Framework and setup

The test setup is reused unchanged: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom; `frontend/vite.config.js` holds the configuration and the 80% line threshold; `frontend/src/test/setup.js` clears browser storage before every test; `frontend/src/test/tasks.js` builds valid tasks and saved text. Nothing new is installed and no new helper is needed.

## How to run this Unit's tests

Run from the `frontend/` folder; the commands name exact test files. Several files are shared with earlier Units (this Unit adds tests to them), so the commands also run those Units' tests in the same files.

| Layer | Command |
|-------|---------|
| State hook (plan Step 3) | `npx vitest run src/hooks/useTasks.test.jsx` |
| Display block and page (plan Step 5) | `npx vitest run src/components/Counter.test.jsx src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 7) | `npx vitest run --coverage src/hooks/useTasks.test.jsx src/components/Counter.test.jsx src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test` in `frontend/`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Lean scope, as the person asked earlier not to spend much time on testing: about 10 new tests defined in plan Steps 3 and 5, each covering an acceptance criterion or a rule of this Unit. The standard strategy's five to eight per piece is therefore only partly met; the coverage floor is met.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Hook | `remaining` is 2 for three tasks of which one is complete; 0 with no tasks and with all complete; down on tick and on deleting an incomplete task; up on untick and add; unchanged on deleting a complete task and on a title edit; follows a list replaced by another tab |
| Block | "2 items left", "1 item left", "0 items left", "100 items left"; one text element with the status role and no alert role |
| Page | the status element exists on the first render with the right text; "0 items left" on a first visit; "2 items left" for the acceptance example; its text changes after tick, untick, add, delete and after a reload with saved tasks; shown beside the load-failed message |

## Mocking and stubbing guidance

Same as the earlier Units: use the simulated browser's own storage; put saved tasks in storage for the reload case; dispatch a storage event for the other-tab case. The spoken announcement cannot be heard in the automated suite. Never weaken an assertion or lower the coverage threshold.

## Test data management

Use the helpers in `frontend/src/test/`; each test starts from cleared storage.

## Manual checks recorded at the checkpoint

Pending until a person does them in a real desktop browser, noted in `code-summary.md`: the count line is read out politely by a real screen reader when a task is added, ticked, unticked or deleted, and not read out when the page opens; the look of the summary line below the list; the contrast of the text color.

## Assumptions & Open Questions

- [assumption] The shared test files are extended, not replaced; earlier Units' tests in them must stay green; an earlier test that looks for the status role is adjusted by the minimum and weakens no assertion.
- Open question: the filter unit must add the test that the count does not change when the filter changes (AC7.1.4).
