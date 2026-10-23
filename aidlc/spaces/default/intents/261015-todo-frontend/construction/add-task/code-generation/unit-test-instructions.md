# Unit Test Instructions: add-task (U1), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 3 to 11).
- Testing Contract (test-after, layer by layer; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- NFR requirements and design: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/` and `nfr-design/`
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`

## Framework and setup

- Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom, and an axe wrapper (`jest-axe`) for the accessibility checks. All are development packages installed in plan Step 2 and Step 3.
- Configuration lives in `vite.config.js`; `src/test/setup.js` loads the jest-dom matchers and clears `localStorage` before every test.
- Prerequisites: Node (current long-term-support release) and npm; run `npm install` once.

## How to run this Unit's tests

Each command names exact test files, so it runs this Unit only. Run the layers in this order (the team's test-after order), each after its implementation step:

| Layer | Command |
|-------|---------|
| Title rules and storage service (plan Step 5) | `npx vitest run src/services/titleRules.test.js src/services/taskStorage.test.js` |
| State hook (plan Step 7) | `npx vitest run src/hooks/useTasks.test.jsx` |
| Screen blocks and page (plan Step 9) | `npx vitest run src/components/TaskForm.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |
| This whole Unit, with the coverage report (plan Step 11) | `npx vitest run --coverage src/services/titleRules.test.js src/services/taskStorage.test.js src/hooks/useTasks.test.jsx src/components/TaskForm.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` |

Before each merge the team also runs the whole suite (`npm test`), the format check, the lint check and the build; those project-wide checks are listed in plan Step 11 and are not repeated per Unit by Build and Test.

## Coverage targets

- At least 80% of lines for this Unit's source files (title rules, storage service, hook, three components, page). The floor is set in the Vitest configuration as a threshold and is never lowered, and no source file is excluded to reach it. Test files and `src/main.jsx` are the only exclusions.
- Standard strategy: five to eight tests per piece (title rules, storage service, hook, `TaskForm`, `TaskList`, `TaskItem`, `App`), plus integration tests at the key boundary (the page with the real storage service on a simulated browser storage). About 45 tests in total.
- Each piece has its happy path and at least two edge or error cases.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Title rules | trim, empty, spaces only, 200 and 201 characters, emoji and accented letters counted once |
| Storage | missing list, valid list, damaged text, wrong version, malformed task, blocked and full storage, all-or-nothing, backup copy rules |
| Hook | add at the front, refused adds, duplicates, save after the new row is in the list, failed save then another add, notice transitions, one save for two quick adds, id fallback |
| Components and page | keyboard-only add, refused add keeps text and focus, plain-text display, input cleared and focused, one task for a double submit, reload shows saved tasks, accessibility check, no network call, 100-task speed guard |

## Mocking and stubbing guidance

- Use the simulated browser's own `localStorage`; do not replace the storage service in page-level tests. Replace it only in the hook and page tests that need a failing or slow `save` (a spy that rejects, fills the store, or stays pending).
- To simulate a refused or full store, make `localStorage.setItem` or `getItem` throw the browser's own error kinds (a quota error, a security error).
- To check "no network", spy on `fetch`, `XMLHttpRequest` and `navigator.sendBeacon`; the test files are the only place outside `src/services/` where these names may appear.
- Replace the post-paint callbacks (`requestAnimationFrame` and the timeout) with Vitest's fake timers where a test needs to look between the draw and the save.
- Never weaken an assertion, raise the 100 ms guard, or lower the coverage threshold to make a test pass.

## Test data management

- Build tasks with a small helper in `src/test/` that creates valid tasks (the five fields, a fixed ISO time) and a list of 100.
- Each test starts from a cleared `localStorage` and restores any spy it set.
- Titles with markup, emoji, 200 and 201 characters are built inside the tests, not stored in files.

## Manual checks recorded at the checkpoint

These cannot run in the simulated browser and are noted in `code-summary.md`: the add timed with 100 tasks in Chrome; a keyboard-only run; the contrast pairs (body text, muted text, danger text, accent button text, and the focus ring at 3 to 1) with a contrast checker; the `npm audit` report.

## Assumptions & Open Questions

- [assumption] `npx vitest run` with file paths is the exact unit-scoped form; the project's `npm test` script runs the whole suite and is used only for the pre-merge check.
- [assumption] jsdom does not paint, so the 100 ms guard is a regression guard on code time only.
- Open question: whether the page-level tests need a real browser (an end-to-end test) later; Standard strategy does not require it.
