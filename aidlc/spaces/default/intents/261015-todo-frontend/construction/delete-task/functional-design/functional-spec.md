# Functional Specification: delete-task (U3), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U3 delete-task, story US3.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR4.1 to FR4.3, FR6.3, NFR1, NFR3, NFR4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC3.1.1 to AC3.1.4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C3 to C5 (the `remove` action, the `DeleteDialog` inputs): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component catalogue: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Screen M5 and the interaction spec (delete dialog, focus rules): `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The add-task and complete-task functional designs (saving, notices, row and list; rules BR1.x and BR2.x): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/functional-spec.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] and [Q2].

## Purpose and scope

delete-task lets a person delete a task they no longer need, after confirming in a small dialog so a task is never lost by accident. It builds on add-task and complete-task: the page, the list in memory, saving and the notices already exist. This document is the source of truth for this Unit's workflow, state and rules. It is design only: no code.

In this unit: the Delete button on each task row (`TaskItem`, with `TaskList` passing the action down); the new `DeleteDialog` block; the pending-delete state held by `App`; the `remove` action in `useTasks`; and the focus moves around opening, closing and deleting. No new storage function is needed: `remove` changes the list and `save` writes it, as `add` and `toggle` do.

Not in this unit: Edit (U4), the filter (U5), the message bar for the notices and other-tab sync (U6), the count (U7), the empty-list message (U9). The count and the empty message will read the list this unit shortens; they add nothing here.

## Workflows

### W1. Ask to delete a task

1. The person presses a row's Delete button with the mouse, or presses Enter or Space while it has focus.
2. `TaskItem` calls the `onAskDelete` it was given with the task's id.
3. `App` records that task as the one being confirmed (the pending delete) and remembers which row's Delete button asked.
4. `DeleteDialog` opens as the browser's modal dialog [Q2]: the page behind is dimmed, the heading "Delete this task?" is shown, the task's title is shown inside quotation marks, and Cancel and Delete are offered. Cancel has focus first (BR3.1).
5. Nothing is removed and nothing is saved (BR3.1).

### W2. Confirm the delete

1. The person chooses Delete in the dialog (mouse, or Tab to it and Enter or Space).
2. `DeleteDialog` calls `onConfirm` with the task's id; `App` passes the id to `remove`.
3. `remove(id)` finds the task in the list in memory. If there is none, nothing changes and no save starts (BR3.8).
4. `remove` builds a new list without that task; every other task is unchanged and keeps its place (BR3.2).
5. The new list is put on screen and a save is made due; the save runs after the row is gone from the screen, the same way as for `add` and `toggle` (BR3.9).
6. `App` clears the pending delete, so the dialog closes, and asks for focus to move: to the checkbox of the task that took the deleted row's place, or to the add input when the list is empty (BR3.6 [Q1]). The move happens after the dialog has closed.
7. If the save fails, the removal stays on screen and the notice becomes `save-failed`, exactly as in add-task's workflow W4 (BR3.9).

### W3. Cancel

1. The person chooses Cancel, or presses Esc.
2. `DeleteDialog` calls `onCancel`; `App` clears the pending delete and the dialog closes.
3. The task stays in the list, unchanged; nothing is saved (BR3.3).
4. Focus returns to that task's Delete button (BR3.3).

### W4. Clicking outside the dialog

Clicking the dimmed area does nothing: the dialog stays open and the task stays (BR3.4).

## State held

One new value, held by `App` (ADR-004): the id of the task being confirmed, or none. It is screen state only and is never saved. `DeleteDialog` receives the task itself (found by id in the list) or none, as contract C5 says. `App` also holds, briefly, a request for where focus goes next (an opener task, or after a delete, a target). It is cleared once honoured.

`useTasks` gains one action, `remove(id)`, and no new state; it changes `tasks` and raises the same "save is due" record `add` and `toggle` use.

### Dialog state machine

| From | Event | To | Effect |
|------|-------|----|--------|
| closed | Delete pressed on a row | open for that task | Dialog shown; Cancel focused (BR3.1) |
| open | Cancel or Esc | closed | Task kept; focus to that row's Delete button (BR3.3) |
| open | Delete chosen | closed | Task removed; focus to the next row or the add input (BR3.2, BR3.6) |
| open | Click on the dimmed area | open | Nothing (BR3.4) |
| open | Delete pressed on another row | open | Not possible: the page behind the dialog cannot be reached (BR3.5) |
| open | The task is no longer in the list | closed | Nothing removed; no save (BR3.8) |
| closed | Esc, Cancel or Delete | closed | Nothing |

Text fallback: the dialog is closed or open for one task; Delete pressed on a row opens it; Cancel or Esc closes it keeping the task; Delete closes it removing the task; a click outside changes nothing.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR3.1 | policy | Pressing a row's Delete button opens the dialog "Delete this task?" for that task. It shows the task's title in quotation marks, with Cancel and Delete; Cancel has focus first. The task is still in the list and nothing is saved. | FR4.1, AC3.1.1 |
| BR3.2 | policy | Choosing Delete removes that one task from the list on screen and from the saved tasks. Every other task keeps its fields and its position, and the order of the rest is unchanged. After a reload the task is still gone. | FR4.2, AC3.1.2, contract C4 |
| BR3.3 | policy | Choosing Cancel or pressing Esc closes the dialog and keeps the task in the list unchanged. Focus returns to that task's Delete button. `App` sets that focus itself rather than relying on the browser to restore it. | FR4.3, AC3.1.3, interaction spec |
| BR3.4 | constraint | Clicking the dimmed area does nothing, so a stray click can neither cancel nor confirm a delete. | interaction spec (assumption A2), M5 |
| BR3.5 | policy | While the dialog is open, focus stays inside it: Tab and Shift+Tab move between Cancel and Delete only, and the rest of the page cannot be reached. Esc closes it. | NFR3, interaction spec |
| BR3.6 | policy | After a task is deleted, focus goes to the checkbox of the task that took its place (the next one down). If the deleted task was the last row, focus goes to the checkbox of the row above it. If the list is now empty, focus goes to the add input [Q1]. The move happens after the dialog has closed. | [Q1], NFR3, interaction spec |
| BR3.7 | policy | The whole delete works by keyboard alone (Tab to Delete, Enter, Enter on Delete in the dialog, or Esc to cancel), and with a list of 100 tasks a confirmed delete is shown on screen in under 100 ms. | AC3.1.4, NFR1, NFR3 |
| BR3.8 | constraint | `remove(id)` for an id that is not in the latest list changes nothing and starts no save. If the task being confirmed leaves the list while the dialog is open, the dialog closes with nothing removed. | robustness; contract C4 |
| BR3.9 | policy | Saving after a delete follows the earlier rules: the whole list is saved after the row is gone from the screen (BR1.7, BR1.10); if the save fails, the removal stays on screen and the notice is `save-failed`; the next successful save writes the whole list, including this removal, and clears the notice (BR1.12). | FR6.3, contract C4 |
| BR3.10 | policy | The Delete button's accessible name is "Delete" followed by the task's title. The dialog is a modal dialog named by its heading "Delete this task?" and described by the title. The title is shown as plain text and wraps if long; text such as `<b>x</b>` is shown as typed. | NFR3, NFR4, interaction spec |
| BR3.11 | constraint | The dialog is the browser's built-in modal dialog element [Q2]; no focus trap, Esc handling or dimming layer is written by hand. There is no undo after a delete. | [Q2], requirements out of scope |

## Rules summary (derived)

BR3.1 to BR3.4 say what opens, closes and changes; BR3.5 and BR3.6 fix where focus is at every step; BR3.7 sets the keyboard and speed bar; BR3.8 and BR3.9 say how the removal behaves when the task is gone or the save fails; BR3.10 and BR3.11 fix naming, safety and how the dialog is built.

## Task entity

The task has the five fields fixed by contract C1; this Unit removes whole tasks and never changes a task's fields. See add-task's functional specification for the entity view.

## Corners swept

| Corner | Settled how |
|--------|-------------|
| Esc | Same as Cancel (BR3.3) |
| Pressing Delete twice quickly in the dialog | The first removes the task and closes the dialog; a second press finds no task and does nothing (BR3.8) |
| Pressing a row's Delete button twice | The dialog opens once; the page behind cannot be reached (BR3.5) |
| Click on the dimmed area | BR3.4 |
| Deleting the only task | List becomes empty; focus to the add input (BR3.6) |
| Deleting the last row of a longer list | Focus to the row above (BR3.6) |
| Deleting a task with a very long title | The title wraps inside the dialog (BR3.10) |
| Title containing markup | Shown as typed (BR3.10) |
| Save fails | BR3.9 |
| 100 tasks | BR3.7 |
| Task gone while the dialog is open (another tab) | BR3.8; the sync itself is U6 |
| Browser where the dialog element is missing | Not applicable: the four supported desktop browsers have it (assumption below) |
| Motion | No animation on the dialog (interaction spec: any animation under 300 ms and off for reduced motion; none is added) |

## Changes to earlier documents

None to contracts: this Unit follows C4 (`remove(id)`) and C5 (`DeleteDialog: { task | null, onConfirm(id), onCancel() }`, `onAskDelete(id)` on `TaskList` and `TaskItem`) as written. For the owner of `docs/ARCHITECTURE.md`: `DeleteDialog` is not yet listed in the components folder (the unit definition notes this).

## Assumptions & Open Questions

- [assumption] When the deleted task was the last row but others remain, focus goes to the row above it; the answer to Q1 named only "the next one down" and the empty list. Not confirmed by the user.
- [assumption] "Next" and "above" follow the list as shown. When the filter arrives (U5), U5 decides whether they follow the visible list; this Unit has no filter.
- [assumption] The four supported desktop browsers (current Chrome, Edge, Firefox and Safari) all have the built-in dialog element, so no fallback is built. Not confirmed by the user.
- [assumption] Focus returns to the Delete button by an explicit call from `App`, not by the dialog's own restore, so it behaves the same in tests as in a real browser.
- [assumption] Clicking the dimmed area does nothing and there is no undo (interaction spec A2; requirements out of scope).
- Open question: deleting a task that another tab has since removed or changed belongs to U6's tab-sync work.
