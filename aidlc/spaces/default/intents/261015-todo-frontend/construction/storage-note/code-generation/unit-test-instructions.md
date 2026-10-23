# Unit Test Instructions: storage-note (U8), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan for this Unit: `code-generation-plan.md` in this folder (Steps 2, 3 and 5).
- Testing Contract (test-after; standard strategy; 80% line coverage): the `## Testing Contract` block of `code-generation-plan.md`.
- The setup, helpers and conventions already built: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/unit-test-instructions.md`
- Functional design of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/storage-note/functional-design/functional-spec.md`

## Framework and setup

The test setup is reused unchanged: Vitest with the jsdom simulated browser, React Testing Library with user-event and jest-dom; `frontend/vite.config.js` holds the configuration and the 80% line threshold; `frontend/src/test/setup.js` clears browser storage before every test; `frontend/src/test/tasks.js` builds valid tasks and saved text. Nothing new is installed and no new helper is needed.

## How to run this Unit's tests

Run from the `frontend/` folder; the commands name exact test files. The file is shared with earlier Units (this Unit adds tests to it), so the commands also run those Units' tests in the same file.

| Layer | Command |
|-------|---------|
| Page (plan Step 3) | `npx vitest run src/App.test.jsx` |
| This whole Unit with the coverage report (plan Step 5) | `npx vitest run --coverage src/App.test.jsx` |

Before each merge the whole suite is run as well (`npm test` in `frontend/`), with the lint, format and build checks.

## Coverage targets

- At least 80% of lines for the project's source, as set in the Vitest configuration threshold. The threshold is never lowered and no source file is excluded to reach it.
- Lean scope, as the person asked earlier not to spend much time on testing: about 3 new tests, each covering an acceptance criterion or a rule of this Unit.

## What the tests must show

| Area | Examples that must exist |
|------|--------------------------|
| Page | the line shows with the exact text on a first visit with an empty list; the same line shows with saved tasks; the line shows while a load or save message is showing and sits after the page title and before the message line |

## Mocking and stubbing guidance

Same as the earlier Units: use the simulated browser's own storage; put invalid text in storage to show the load message. Never weaken an assertion or lower the coverage threshold.

## Test data management

Use the helpers in `frontend/src/test/`; each test starts from cleared storage.

## Manual checks recorded at the checkpoint

Pending until a person does them in a real desktop browser, noted in `code-summary.md`: how the line looks under the title and the contrast of its muted color.

## Assumptions & Open Questions

- [assumption] The shared test file is extended, not replaced; earlier Units' tests in it must stay green.
- Open question: none.
