# Unit Test Instructions: delete-task (U3), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2 to 7).
- Testing Contract (test-after, layer by layer; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built in add-task: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/delete-task/functional-design/functional-spec.md`

## Framework and setup

The test setup from add-task is reused: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom, and the axe wrapper; `frontend/vite.config.js` holds the configuration and the 80% line threshold; `frontend/src/test/setup.js` clears browser storage before every test; `frontend/src/test/tasks.js` builds valid tasks and a list of 100; `frontend/src/test/axe.js` runs the accessibility check. Nothing new is installed.

One addition: `frontend/src/test/dialog.js`, loaded by `setup.js`, is a small stand-in for the dialog element's `showModal` and `close` calls. It adds them only where the simulated browser lacks them (open sets the `open` attribute; close clears it and fires `close`). It does not move focus and does not trap it.

## How to run this Unit's tests

All commands are run from the `frontend/` folder and name exact test files. The row, list and page files are shared with earlier Units (this Unit adds tests to them), so those commands also run the earlier Units' tests in the same files; they are still scoped to the files this Unit changed.

| Layer | Command |
|-------|---------|
| State hook (plan Step 3) | `npx vitest run src/hooks/useTasks.test.jsx` |
| Dialog, row, list and page (plan Step 5) | `npx vitest run src/components/DeleteDialog.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 7) | `npx vitest run --coverage src/hooks/useTasks.test.jsx src/components/DeleteDialog.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test` in `frontend/`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Standard strategy: five to eight tests per piece changed (hook, dialog, row, list, page): about 30 new tests, each piece with its happy path and at least two edge or error cases.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Hook | removes only the named task, order of the rest kept, other tasks untouched, removing the only task gives an empty list, unknown id is a no-op with no save, two quick removes of one id give one removal and one save, failed save keeps the removal and the notice, saved list no longer holds the task |
| Dialog | closed for `null`, open with heading, quoted title and both buttons, Cancel focused on open, Cancel calls `onCancel`, the cancel event (Esc) calls `onCancel` and is default-prevented, Delete calls `onConfirm` with the id, a click on the backdrop does nothing, markup and very long titles shown as plain text, closes when `task` goes back to `null` |
| Row | Delete button present and named "Delete" plus the title, click calls `onAskDelete` with the id, Enter and Space do the same, it does not toggle the task |
| List | passes `onAskDelete` to every row |
| Page | dialog opens with Cancel focused and the task still listed, Delete removes it and a reload keeps it gone, Cancel and Esc keep it and return focus to that row's Delete button, backdrop click does nothing, the whole delete by keyboard only, 100-task speed guard measured from the confirming key press to the row being absent from the document, focus after a delete (next row's checkbox, row above when the last row goes, add input when the list is empty), the rest keep their order, failed save keeps the removal and shows the notice, axe check passes with the dialog open and closed, a task that leaves the list while the dialog is open closes it with nothing removed |

## Mocking and stubbing guidance

Same as add-task: use the simulated browser's own storage; make `setItem` throw to simulate a failed save; use fake timers for the post-paint callbacks when a test looks between the draw and the save. The dialog stand-in is the only new stub. Never weaken an assertion, raise the 100 ms guard or lower the coverage threshold.

## Test data management

Use the helpers in `frontend/src/test/`; each test starts from cleared storage and restores any spy it sets.

## Manual checks recorded at the checkpoint

Pending until a person does them in a real desktop browser, noted in `code-summary.md`: focus stays inside the open dialog and Tab cycles Cancel and Delete (BR3.5); Esc closes it; the page behind is dimmed and a click on it does nothing; the keyboard-only delete in Chrome, with the time from the confirming key press to the row disappearing recorded for 100 tasks; the contrast of the white-on-red Delete button.

## Assumptions & Open Questions

- [assumption] The shared test files are extended, not replaced; earlier Units' tests in them must stay green.
- [assumption] Focus containment and the dimmed backdrop are browser behaviour and are not claimed by the automated tests, which cannot show them.
- Open question: none.
