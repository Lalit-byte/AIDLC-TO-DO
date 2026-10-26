# Integration Test Instructions: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`; Test Strategy: standard (only this instruction file is generated).
- Per-unit test instructions: `aidlc/spaces/default/intents/261015-todo-frontend/construction/*/code-generation/unit-test-instructions.md`.
- Contracts C1 to C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`.
- Requirements and stories: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`, `.../user-stories/stories.md`.

## What an integration test is here

There is no server, so the integration boundary is the page (`App`) driven through the real `useTasks` hook and the real `TaskStorage` service on the simulated browser's own `localStorage` (jsdom). Those tests live in `frontend/src/App.test.jsx` (73 declared tests) and cross all nine Units. Hook-level tests (`frontend/src/hooks/useTasks.test.jsx`) cover the hook-to-storage boundary with the real service.

## Framework and setup

- Vitest 5 with jsdom, React Testing Library, user-event, jest-dom, jest-axe. Configuration: `frontend/vite.config.js`; `frontend/src/test/setup.js` clears `localStorage` before each test; `frontend/src/test/dialog.js` stands in for the modal dialog functions jsdom lacks.
- No test data files: helpers in `frontend/src/test/tasks.js` build valid tasks and a list of 100.

## How to run

From the repository root:

| Purpose | Command |
|---------|---------|
| Whole suite (all integration and unit tests, run once) | `npm run test --prefix frontend` |
| Whole suite with the coverage report and the 80% line threshold | `npm run test:coverage --prefix frontend` |
| Page-level integration tests only | `cd frontend && npx vitest run src/App.test.jsx` |
| One test by name | `cd frontend && npx vitest run src/App.test.jsx -t "<part of the name>"` |

## Key boundaries and cross-unit interactions covered

| Boundary | Units | Covered by |
|----------|-------|-----------|
| Add then reload: saved list shown in the same order and states | add-task, keep-tasks | `App.test.jsx` (reload tests), `taskStorage.test.js` |
| Add, tick, edit, delete each save after the row is drawn; one save of the latest list for quick repeats | add-task, complete-task, edit-task, delete-task | `useTasks.test.jsx`, `App.test.jsx` |
| Count line follows add, tick, delete, reload and is unchanged under every filter | count-remaining, filter-tasks | `App.test.jsx` (count and filter tests) |
| Filter with tick, edit and add (focus and hidden-edit rules) | filter-tasks, complete-task, edit-task | `App.test.jsx` |
| Empty hint after the last delete; filtered-empty message | empty-guidance, filter-tasks, delete-task | `App.test.jsx`, `TaskList.test.jsx` |
| Unreadable or blocked storage shows the notice; failed save keeps the change; backup copy before overwrite | keep-tasks, add-task | `App.test.jsx`, `taskStorage.test.js` |
| Other tab's change replaces the list (simulated storage event) | keep-tasks | `App.test.jsx`, `useTasks.test.jsx` |
| Storage note visible with an empty and a full list | storage-note | `App.test.jsx` |
| No network call (`fetch`, `XMLHttpRequest`, `sendBeacon`) while adding and reloading | all | `App.test.jsx` (NFR5.1 test) |
| Accessibility scan (axe) on empty, full, refused, notice, dialog and edit states | all | `App.test.jsx` |

## Coverage targets (standard strategy, scope mvp)

- At least 80% of lines for the whole project (`thresholds: { lines: 80 }` in `frontend/vite.config.js`). Never lower it; no source file is excluded beyond test files, test helpers and `src/main.jsx`.
- Standard volume (five to eight tests per piece, plus key-boundary integration tests) as stated in each Unit's Testing Contract.

## What these tests cannot show (needs a real browser)

Dialog focus trap and Esc behaviour, real two-tab synchronisation, painted speed under 100 ms, colour contrast and visual look, screen-reader announcements, and behaviour in Chrome, Edge, Firefox and Safari. These are listed as outstanding in `build-and-test-summary.md`.

## Assumptions & Open Questions

- [assumption] A separate end-to-end browser suite is out of scope for standard strategy and for the "keep testing lean" request; none is generated.
- Open question: whether a free browser test runner is wanted for the real-browser items before phase 1 ends (no owner or stage is scheduled today).
