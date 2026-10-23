# Requirements Analysis Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Scope document, intent backlog: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/` (FR-1 to FR-7 all required, desktop only, local run).
- Feasibility artifacts: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/feasibility/` (RAID risks R2 and R3, constraints).
- Wireframes and user flow: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/rough-mockups/`.
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`.
- Project documents: `docs/PRD.md` (FR-1 to FR-7 with pass/fail checks), `docs/DESIGN.md`, `docs/ARCHITECTURE.md`.

Depth is Standard. Already answered earlier and not asked again: which features are in scope and their order, desktop-only support, delete asks first, long titles wrap, the whole page scrolls, accessibility at sensible defaults, 80% coverage floor, tests written after each piece.

The questions below cover the unusual situations that the requirements must settle (an empty list, two tabs, storage that fails) and the open items left by earlier stages.

## Q1. What is the largest number of tasks one person should be able to keep and still get a fast response?

The requirement that add, toggle and delete respond in under 100 ms (from Intent Capture) is only testable once a list size is named. Risk R3 in the RAID log left this open.

A. Up to 100 tasks
B. Up to 500 tasks
C. Up to 1,000 tasks
D. No stated limit; the 100 ms target applies to ordinary lists and larger ones are not tested
X. Other (please specify)

[Answer]: A

## Q2. What should happen if the browser's saved tasks cannot be read or saved? (for example the data is damaged, storage is full, or the browser blocks storage)

Tasks are kept in the browser (FR-6). If saving fails, the person could believe a task was kept when it was not.

A. Show a clear message that tasks could not be loaded or saved; start with an empty list when the saved data is unreadable, and keep the damaged data untouched
B. Show a clear message; start with an empty list and replace the damaged data
C. Show no message; carry on with an empty list
X. Other (please specify)

[Answer]: A

## Q3. What should happen if the app is open in two browser tabs at once?

Both tabs share the same saved tasks. Without a rule, a change in one tab can silently overwrite a change in the other.

A. Tabs stay in sync: a change in one tab appears in the other
B. Each tab works on its own; the latest save wins and a reload shows the result
C. Not a concern for phase 1; do not handle it
X. Other (please specify)

[Answer]: A

## Q4. After a page reload, which filter should be shown?

FR-6 requires the tasks to survive a reload. It does not say whether the chosen All, Active or Completed filter does too.

A. Always return to All
B. Remember the filter the person last chose
X. Other (please specify)

[Answer]: A

## Q5. Should the page tell first-time visitors that tasks are saved in this browser only?

This is risk R2 in the RAID log (tasks vanish in another browser, a private window, or after clearing browser data). Flow 6 in the user flow left it open.

A. Yes; show a short, permanent line on the page such as "Your tasks are saved in this browser only"
B. Yes, but only while the list is empty (first visit)
C. No; explain it in the documentation only
X. Other (please specify)

[Answer]: A

## Q6. Are two tasks with the same title allowed?

A. Yes; titles do not have to be unique
B. No; reject a title that matches an existing task and say so
X. Other (please specify)

[Answer]: A

## Q7. Should pressing Enter in the add box add the task (the same as the Add button)?

The project requirements only describe Enter for saving an edit (FR-3). The user flow assumed Enter also adds a task.

A. Yes; Enter adds the task
B. No; only the Add button adds a task
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
