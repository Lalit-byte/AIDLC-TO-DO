# Unit Test Instructions: complete-task (U2), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2 to 7).
- Testing Contract (test-after, layer by layer; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built in add-task: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/functional-spec.md`

## Framework and setup

The test setup from add-task is reused unchanged: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom, and the axe wrapper; `vite.config.js` holds the configuration and the 80% line threshold; `src/test/setup.js` clears browser storage before every test; `src/test/tasks.js` builds valid tasks and a list of 100; `src/test/axe.js` runs the accessibility check. Nothing new is installed.

## How to run this Unit's tests

These commands name exact test files. The files are shared with add-task (this Unit adds tests to them), so the commands also run add-task's tests in the same files; they are still scoped to the files this Unit changed.

| Layer | Command |
|-------|---------|
| State hook (plan Step 3) | `npx vitest run src/hooks/useTasks.test.jsx` |
| Row, list and page (plan Step 5) | `npx vitest run src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 7) | `npx vitest run --coverage src/hooks/useTasks.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Standard strategy: five to eight tests per piece changed (hook, row, list, page): about 20 new tests, each piece with its happy path and at least two edge or error cases.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Hook | flip both ways, `updatedAt` changes and nothing else does, position kept, other tasks untouched, unknown id is a no-op, two quick toggles end where they started with one save, failed save keeps the change and the notice, saved list holds the new value |
| Row | ticked or unticked by `completed`, click calls `onToggle` with the id, complete look, title click does nothing, the checkbox is named by the title |
| List | passes `onToggle` to every row |
| Page | Space toggles by keyboard only, position kept among three, reload shows the complete state, axe check passes, failed save keeps the change and shows the notice, 100-task speed guard |

## Mocking and stubbing guidance

Same as add-task: use the simulated browser's own storage; make `setItem` throw to simulate a failed save; use fake timers for the post-paint callbacks when a test looks between the draw and the save. Never weaken an assertion, raise the 100 ms guard or lower the coverage threshold.

## Test data management

Use the helpers in `src/test/`; each test starts from cleared storage and restores any spy it sets.

## Manual checks recorded at the checkpoint

The contrast of the complete look (muted text `#6b7280` on white) with a contrast checker and a keyboard-only run of the tick, noted in `code-summary.md` as pending until done by a person.

## Assumptions & Open Questions

- [assumption] The shared test files are extended, not replaced; add-task's tests in them must stay green.
- Open question: none.
