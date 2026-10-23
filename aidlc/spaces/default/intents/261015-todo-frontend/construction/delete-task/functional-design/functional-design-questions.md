# Functional Design Questions: delete-task (U3)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U3 delete-task, story US3.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR4.1 to FR4.3, NFR1, NFR3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC3.1.1 to AC3.1.4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Screen M5 and the interaction spec (delete dialog, focus rules): `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Contracts C3 to C5 (the `remove` action, `DeleteDialog` inputs): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Earlier Units' designs and code (saving, notices, row and list): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/functional-spec.md`

Context: most of this Unit is fixed. A Delete button on each row opens a small dialog "Delete this task?" showing the task's title, with Cancel (focused first) and Delete; Esc and Cancel keep the task; Delete removes it from the list and the saved tasks (FR4.1 to FR4.3); the rest of the page is dimmed and clicking the dimmed area does nothing; focus stays inside the dialog while it is open and returns to the row's Delete button when it closes without deleting; the removal shows in under 100 ms for 100 tasks (AC3.1.4); saving follows the earlier rules (after the row is drawn; a failed save keeps the change on screen and shows the notice). Two choices are still open.

## Question 1: Where does focus go after a task is deleted?

The interaction spec's assumption is that focus moves to the next task, or to the add input if none remains. That assumption was never confirmed. After a delete the deleted row's Delete button no longer exists.

A. To the checkbox of the task that took the deleted task's place (the next one down), or to the add input when the list is now empty. Keeps a keyboard user's place in the list.
B. Always to the add input. Simpler and always predictable, but a keyboard user loses their place in the list.
X. Other (please specify)

[Answer]: A

## Question 2: How is the dialog built?

A. The browser's built-in dialog element opened as a modal. It already traps focus, closes on Esc and dims the page, which makes it accessible with little code; the test environment (a simulated browser) only partly supports it, so the tests may need a small stand-in for its open and close calls.
B. A dialog built by hand from ordinary elements (marked as a modal dialog), with its own focus trap, Esc handling and dimmed layer. More code to write and test, but it behaves the same in the simulated browser as in a real one.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] `remove(id)` removes only that task, keeps the order of the rest, and saves the whole list after the row is drawn, as `add` and `toggle` do; an id not in the list is a no-op with no save.
- [assumption] Clicking the dimmed area does nothing (interaction spec), and Esc and Cancel close the dialog with the task kept.
- [assumption] The Delete button's accessible name is "Delete" followed by the task's title (interaction spec).
- [assumption] The task being confirmed is held by the page (`App`), not by the row, as ADR-004 and the catalogue say.
- [assumption] Deleting a task that another tab has since removed or changed belongs to U6.
- [assumption] There is no undo after a delete (out of scope in the requirements).

## Consolidated Summary Confirmation

- After a delete, focus goes to the checkbox of the task that took the deleted task's place, or to the add input when the list is now empty (Q1: A).
- The "Delete this task?" dialog uses the browser's built-in modal dialog element; it traps focus, closes on Esc and dims the page. Tests use a small stand-in for its open and close calls where the simulated browser lacks them (Q2: A).
- Everything else follows the unit definition and the earlier designs: Cancel focused first, Esc and Cancel keep the task, clicking the dimmed area does nothing, focus returns to the row's Delete button when the dialog closes without deleting, `remove(id)` keeps the order of the rest and saves after the row is drawn.

- Looks correct
- Request changes

[Answer]: Looks correct
