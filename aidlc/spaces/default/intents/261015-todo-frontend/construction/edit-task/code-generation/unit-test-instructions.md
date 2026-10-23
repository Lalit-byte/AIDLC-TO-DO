# Unit Test Instructions: edit-task (U4), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2 to 7).
- Testing Contract (test-after, layer by layer; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md` and `aidlc/spaces/default/intents/261015-todo-frontend/construction/delete-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/edit-task/functional-design/functional-spec.md`

## Framework and setup

The test setup is reused unchanged: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom, and the axe wrapper; `frontend/vite.config.js` holds the configuration and the 80% line threshold; `frontend/src/test/setup.js` clears browser storage before every test and loads the dialog stand-in; `frontend/src/test/tasks.js` builds valid tasks and a list of 100; `frontend/src/test/axe.js` runs the accessibility check. Nothing new is installed and no new test helper is needed.

## How to run this Unit's tests

All commands are run from the `frontend/` folder and name exact test files. The row, list, form and page files are shared with earlier Units (this Unit adds tests to them), so those commands also run the earlier Units' tests in the same files; they are still scoped to the files this Unit changed.

| Layer | Command |
|-------|---------|
| State hook (plan Step 3) | `npx vitest run src/hooks/useTasks.test.jsx` |
| Field, row, list, form and page (plan Step 5) | `npx vitest run src/components/TaskEditField.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/components/TaskForm.test.jsx src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 7) | `npx vitest run --coverage src/hooks/useTasks.test.jsx src/components/TaskEditField.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/components/TaskForm.test.jsx src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test` in `frontend/`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Standard strategy asks for five to eight tests per piece changed; at the person's request (given at plan approval: do not spend much time on testing) this Unit writes a lean set of about 25 new tests, defined in plan Step 5, each piece with its happy path and the edge cases the acceptance criteria and the three answered choices name. The 80% line-coverage floor is not lowered; the smallest extra test is added if it is missed. The table below lists the full set the design could justify; the lean scope in plan Step 5 decides which of them are written.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Hook | title replaced and trimmed, `updatedAt` set, other fields, position and other tasks kept, complete task stays complete, empty and spaces-only refused, 200 accepted and 201 refused, same title (also with spaces around it) changes nothing and starts no save, unknown id is a no-op returning ok even with an empty title, duplicates allowed, failed save keeps the change and the notice, saved list holds the new title |
| Field | opens with the saved title selected and focused, names and hint linked, Enter and Save call `onSave` with the typed text, Cancel calls `onCancel`, refusal shows the message with the "(!)" mark as an alert and keeps text and focus, typing clears it, markup kept as typed |
| Row | Edit button present and named, start by click, Enter and Space, editing view replaces Edit and Delete, checkbox keeps its name and still toggles while editing, Esc cancels from the field, Save, Cancel and the checkbox, accepted save ends the edit, refused save does not |
| List | passes the new inputs to every row |
| Form | the add form still shows both refusal messages from the shared file; the shared function maps the reasons and an unknown reason |
| Page | AC4.1.1 to AC4.1.5 flows, Save by button, Cancel and Esc return focus to the Edit button, 200 accepted, same title closes like Cancel (Q1), clicking elsewhere leaves the field open (Q2), Edit on a second row drops the first and edit A, Edit B, Edit A shows A's saved title with no message (Q3), keyboard-only edit and the Tab order while editing, Delete on another row while editing keeps the edit, the task hidden then shown again is not in editing and takes no focus (BR4.12), failed save keeps the change and shows the notice, axe check passes while editing with and without a message |

## Mocking and stubbing guidance

Same as the earlier Units: use the simulated browser's own storage; make `setItem` throw to simulate a failed save; use fake timers for the post-paint callbacks when a test looks between the draw and the save; wrap the real hook with `vi.spyOn` to hide and show a task for the BR4.12 test. Never weaken an assertion or lower the coverage threshold.

## Test data management

Use the helpers in `frontend/src/test/`; each test starts from cleared storage and restores any spy it sets.

## Manual checks recorded at the checkpoint

Pending until a person does them in a real desktop browser, noted in `code-summary.md`: the layout of the editing row (field, Save, Cancel, hint) including a long title; the contrast of the hint and message colors; a keyboard-only edit from Tab to Enter.

## Assumptions & Open Questions

- [assumption] The shared test files are extended, not replaced; earlier Units' tests in them must stay green, and if the row's new buttons or layout force a change to an earlier test (as the delete Unit's did), the change is the minimum needed and weakens no assertion.
- Open question: none.
