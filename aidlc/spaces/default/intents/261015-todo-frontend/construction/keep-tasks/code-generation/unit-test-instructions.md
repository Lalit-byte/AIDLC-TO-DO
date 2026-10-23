# Unit Test Instructions: keep-tasks (U6), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2 to 9).
- Testing Contract (test-after, layer by layer; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/keep-tasks/functional-design/functional-spec.md`

## Framework and setup

The test setup is reused unchanged: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom, and the axe wrapper; `frontend/vite.config.js` holds the configuration and the 80% line threshold; `frontend/src/test/setup.js` clears browser storage before every test; `frontend/src/test/tasks.js` builds valid tasks and saved text. Nothing new is installed. A second browser tab is simulated: the test changes the stored text and dispatches a storage event on the window (with the saved-tasks key, with no key for a clear-everything, or with another key or storage area for the ignored cases).

## How to run this Unit's tests

Run from the `frontend/` folder; the commands name exact test files. Several files are shared with earlier Units (this Unit adds tests to them), so the commands also run those Units' tests in the same files.

| Layer | Command |
|-------|---------|
| Storage service (plan Step 3) | `npx vitest run src/services/taskStorage.test.js` |
| State hook (plan Step 5) | `npx vitest run src/hooks/useTasks.test.jsx` |
| Message block and page (plan Step 7) | `npx vitest run src/components/MessageBar.test.jsx src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 9) | `npx vitest run --coverage src/services/taskStorage.test.js src/hooks/useTasks.test.jsx src/components/MessageBar.test.jsx src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test` in `frontend/`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Lean scope, as the person asked earlier not to spend much time on testing: about 20 new tests defined in plan Steps 3, 5 and 7, each covering an acceptance criterion, a business rule that is new in this Unit, or an answered choice. The standard strategy's five to eight per piece is therefore not fully met; the coverage floor is.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Storage service | a good list from another tab reaches the listener; a removed list gives an empty list; a signal with no key triggers the re-read; another key and another storage area are ignored; damaged text gives unreadable and the next save backs it up first; a later good read clears the kept text; new damaged text is backed up again even after an earlier backup; a blocked read is ignored; unsubscribe stops it; an extra field and an unknown version are unreadable |
| Hook | another tab's list replaces the screen list and the list the next save writes; a save still due is dropped; save-failed clears; damage from another tab keeps the list and shows load-failed until reload; the next change saves after a backup; unsubscribe on removal |
| Message block | nothing for null; both texts with the "(!)" mark; an alert |
| Page | a second tab's add appears without a message or focus change; a clear-everything empties the list; damage from another tab keeps the list, shows the message above the add row and the next change is saved after a backup; a task removed elsewhere ends its edit and closes its delete dialog |

## Mocking and stubbing guidance

Same as the earlier Units: use the simulated browser's own storage; make `setItem` throw to simulate a failed save or a blocked read; dispatch storage events to simulate the other tab; use fake timers for the post-paint callbacks when a test looks between the draw and the save. Never weaken an assertion or lower the coverage threshold.

## Test data management

Use the helpers in `frontend/src/test/`; each test starts from cleared storage and restores any spy it sets; remove any listener a test added.

## Manual checks recorded at the checkpoint

Pending until a person does them in a real desktop browser, noted in `code-summary.md`: two real tabs of the same browser staying in step when a task is added, completed, edited and deleted in either; the look and position of the message line above the add row; the contrast of the danger color.

## Assumptions & Open Questions

- [assumption] The shared test files are extended, not replaced; earlier Units' tests in them must stay green; an earlier test that looks for the notice by position or role is adjusted by the minimum and weakens no assertion.
- Open question: none.
