# Functional Design Questions: edit-task (U4)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U4 edit-task, story US4.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR3.1 to FR3.5, NFR3, NFR4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC4.1.1 to AC4.1.5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Screen M4 and the interaction spec (editing state, focus rules): `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Contracts C3 to C5 (the `edit` action, `updatedAt` rule, `checkTitle`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Earlier Units' designs and code (title rules, saving, notices, row): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and the existing `frontend/src/` code

Context: most of this Unit is fixed. Pressing a row's Edit button turns the title into an input holding the current title, selected, with focus in it, plus Save and Cancel buttons (FR3.1, screen M4). Enter or Save saves it; Esc or Cancel keeps the old title (FR3.2, FR3.3). A title that is empty, spaces only, or over 200 characters is refused with the same messages as adding, and the task stays unchanged (FR3.4). A saved edit keeps the task's position and complete state and sets `updatedAt` (FR3.5, contract C4). Focus returns to that row's Edit button when editing ends. The text being edited lives in the row, not in the page. Saving follows the earlier rules: the change is drawn first, then saved; a failed save keeps the change on screen and shows the notice. Three choices about edge behaviour are still open.

## Question 1: What happens when Save is pressed and the title has not changed?

For example, the person presses Edit, changes nothing (or only adds spaces at the ends), and presses Enter.

A. Editing closes as if cancelled: nothing is changed and `updatedAt` is not touched (and no save happens), since nothing was edited. The person sees the row return to normal.
B. Editing closes and the task is saved again as an edit: `updatedAt` is set to now and the list is saved, even though the text is the same.
X. Other (please specify)

[Answer]: A

## Question 2: What happens if the person clicks somewhere else while editing?

For example, clicks on another part of the page, or tabs away from the field and the buttons, without pressing Save, Cancel, Enter or Esc.

A. Nothing: the field stays open with the typed text until the person chooses Save, Cancel, Enter or Esc. Nothing is lost or saved by accident.
B. The edit is cancelled when focus leaves the row: the old title returns. Simple, but a typed change can vanish by a stray click.
C. The edit is saved when focus leaves the row, if the title passes the rules. Convenient, but a half-typed change can be saved by a stray click.
X. Other (please specify)

[Answer]: A

## Question 3: What if the person presses Edit on a second task while one is already being edited?

A. The first edit is cancelled (its typed text is dropped, the old title stays) and the second one opens. Only one task is ever in edit state.
B. The Edit buttons of the other rows are switched off (disabled) while one task is being edited, so a second edit cannot be started until the first ends.
C. Both rows stay editable at once, each with its own Save and Cancel.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] `edit(id, rawTitle)` applies the title rules (trim, 1 to 200 visible characters), sets `updatedAt` to the time of the change, changes nothing else about the task, keeps its position and complete state, and saves the whole list after the row is drawn, as `add`, `toggle` and `remove` do; an id not in the list is a no-op with no save.
- [assumption] Refusals show the same two messages as the add form ("Please enter a task title." and "Title must be 200 characters or fewer.") under the field, with the typed text and focus kept; the text is not trimmed on screen until it is saved.
- [assumption] The row's checkbox and Delete button stay usable while the row is being edited, unless Question 3 says otherwise.
- [assumption] A complete task can be edited like any other and stays complete.
- [assumption] Editing never changes `createdAt`, and the title is shown as plain text after saving.
- [assumption] Editing a task that another tab has since removed or changed belongs to U6.

## Consolidated Summary Confirmation

- Saving a title that is the same after trimming closes editing like Cancel: nothing changes, `updatedAt` is not touched and nothing is saved (Q1: A).
- Clicking elsewhere does nothing: the field stays open with the typed text until Save, Cancel, Enter or Esc (Q2: A).
- Pressing Edit on a second task cancels the first edit (its typed text is dropped and the old title stays) and opens the second, so only one task is ever being edited. This is the one case where a click elsewhere does close an edit (Q3: A, with Q2: A).
- Everything else follows the unit definition and the earlier designs: the field holds the current title selected with focus in it, Enter or Save saves, Esc or Cancel keeps the old title, refusals show the add form's two messages under the field with the text and focus kept, position and complete state are kept, `updatedAt` is set on a real change, focus returns to the row's Edit button when editing ends, and saving follows the draw-then-save rules.

- Looks correct
- Request changes

[Answer]: Looks correct
