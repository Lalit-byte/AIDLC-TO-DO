# Functional Specification: edit-task (U4), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U4 edit-task, story US4.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR3.1 to FR3.5, NFR3, NFR4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC4.1.1 to AC4.1.5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C3 to C5 (the `edit` action, `checkTitle`, the `updatedAt` rule): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component catalogue: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Screens M3, M4, M7 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The add-task, complete-task and delete-task functional designs (title rules BR1.1 to BR1.3, saving BR1.7 to BR1.12, row rules BR2.x and BR3.x): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`, `.../complete-task/functional-design/functional-spec.md` and `.../delete-task/functional-design/functional-spec.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] to [Q3].

## Purpose and scope

edit-task lets a person correct a task's title in place, without deleting and re-adding it. It builds on the earlier Units: the page, the list in memory, the title rules, saving and the notices already exist. This document is the source of truth for this Unit's workflow, state and rules. It is design only: no code.

In this unit: the Edit button on each row and the editing state of the row (`TaskItem`, with `TaskList` passing the inputs down); the `edit` action in the state hook (`useTasks`); the record, held by the page (`App`), of which task is being edited; and the focus moves around starting and ending an edit. No new storage function is needed: `edit` changes the list and the existing whole-list `save` writes it. The title rules are the existing `checkTitle` of the title rules file.

Not in this unit: the filter (U5), the message bar for the storage notices and other-tab sync (U6), the count (U7).

## Workflows

### W1. Start editing

1. The person presses a row's Edit button with the mouse, or presses Enter or Space while it has focus.
2. `TaskItem` calls the `onStartEdit` it was given with the task's id; `App` records that task as the one being edited (BR4.7).
3. If another task was being edited, that edit ends without saving: its typed text is dropped and its old title shows again (BR4.7).
4. The row shows the editing state (screen M4): the title is replaced by a text input holding the task's current title with the whole text selected and focus in it, with Save and Cancel buttons beside it and the hint "Enter to save, Esc to cancel" under it (BR4.1).
5. Nothing is saved.

### W2. Save an edit that changes the title

1. The person presses Enter in the field, or presses Save.
2. `TaskItem` passes the typed text, unchanged, to the `edit` action with the task's id (contract C4).
3. `edit` asks the title rules to check the text: trim, then 1 to 200 visible characters (BR4.2).
4. The trimmed title differs from the task's current title, so `edit` builds a new list in which only that task has the new title and `updatedAt` set to the time of the change; `id`, `completed` and `createdAt`, every other task, and the task's position are unchanged (BR4.2).
5. The new list is put on screen and a save is made due; the save runs after the row is drawn, as for `add`, `toggle` and `remove` (BR4.9).
6. `edit` returns `{ ok: true }`; the row leaves the editing state and shows the new title; `App` clears the record of the edited task; focus returns to that row's Edit button (BR4.2).
7. If the save fails, the change stays on screen and the notice becomes `save-failed`, as in add-task's workflow W4 (BR4.9).

### W3. Save with the same title

1. Steps 1 to 3 of W2 run and the title passes the rules.
2. The trimmed title equals the current title, so `edit` changes nothing, does not touch `updatedAt`, starts no save, and returns `{ ok: true }` (BR4.5 [Q1]).
3. The row leaves the editing state as if cancelled and focus returns to its Edit button (BR4.3).

### W4. Cancel

1. The person presses Esc in the field, or presses Cancel.
2. The row leaves the editing state, the old title shows, `App` clears the record of the edited task, and focus returns to that row's Edit button. Nothing is changed or saved (BR4.3).

### W5. A save is refused

1. Steps 1 to 3 of W2 run and the title rules return `empty` (nothing left after trimming) or `too-long` (more than 200 visible characters after trimming).
2. `edit` returns `{ ok: false, reason }`, changes nothing and does not save (BR4.4).
3. The row stays in the editing state. Under the field it shows the same message as the add form: "Please enter a task title." for `empty`, "Title must be 200 characters or fewer." for `too-long`, with the "(!)" mark, announced to screen readers. The typed text is kept and focus stays in the field (BR4.4).
4. Typing in the field clears the message.

### W6. Clicking elsewhere while editing

Nothing happens: the field stays open with the typed text until Save, Cancel, Enter or Esc, or until Edit is pressed on another row (BR4.6, BR4.7 [Q2]).

## State held

`App` holds one new value: the id of the task being edited, or none. It is screen state only and is never saved (BR4.12). `TaskItem` holds the text being typed and the refusal reason for its own row, and only while that row is being edited; both are dropped when the edit ends. `useTasks` gains one action, `edit(id, rawTitle)`, and no new state; it changes `tasks` and raises the same "save is due" record `add`, `toggle` and `remove` use.

### Edit state machine (per row)

| From | Event | To | Effect |
|------|-------|----|--------|
| showing | Edit pressed on this row | editing | Field shown, text selected, focus in it; any other row's edit ends without saving (BR4.1, BR4.7) |
| editing | Enter or Save, title refused | editing (with message) | Message shown, text and focus kept; nothing saved (BR4.4) |
| editing | Enter or Save, title accepted and changed | showing | Title and `updatedAt` changed, saved after the draw; focus to Edit button (BR4.2) |
| editing | Enter or Save, title accepted and unchanged | showing | Nothing changed or saved; focus to Edit button (BR4.5) |
| editing | Esc or Cancel | showing | Old title stays; focus to Edit button (BR4.3) |
| editing | Edit pressed on another row | showing | Typed text dropped, old title stays; no focus move on this row (BR4.7) |
| editing | Click or Tab elsewhere | editing | Nothing (BR4.6) |
| editing | The task leaves the shown list (removed, or hidden by a filter) | (row gone) | Page clears the edited id; typed text dropped; nothing saved; the task is never reopened in editing when it comes back (BR4.12) |
| showing | Esc, Enter or Save | showing | Nothing |

Text fallback: a row is showing or editing; Edit opens it (closing any other open edit); Enter or Save closes it, saving only a changed title that passes the rules and showing a message when it does not; Esc or Cancel closes it keeping the old title; clicking elsewhere changes nothing.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR4.1 | policy | Pressing a row's Edit button, by mouse or keyboard, turns that row's title into a text input holding the task's current title with all of it selected and focus in it, with Save and Cancel buttons beside it and the hint "Enter to save, Esc to cancel" under it. The task is unchanged and nothing is saved. Starting an edit always opens the field with the saved title and no message, whatever was typed in an earlier edit of that or another row (the row's own state is reset when editing starts); check: edit A and type, press Edit on B, press Edit on A again, and A's field holds A's saved title, selected, with no message. | FR3.1, AC4.1.1, M4 |
| BR4.2 | policy | Enter in the field, or Save, applies the title rules (BR1.1 to BR1.3) to the typed text. A title that passes and differs from the current one replaces it: the task gets the new trimmed title and `updatedAt` set to the time of the change, while `id`, `completed`, `createdAt`, every other task and the task's position stay as they were; the row shows the new title, editing ends and focus returns to that row's Edit button. A complete task stays complete and keeps its place. | FR3.2, FR3.5, AC4.1.2, AC4.1.5, contract C4 |
| BR4.3 | policy | Esc, or Cancel, ends editing and keeps the old title; nothing is changed or saved. Focus returns to that row's Edit button. Esc works from any control inside the row being edited (the field, Save, Cancel or the checkbox); Esc pressed anywhere outside that row does nothing. Enter saves only in the field or on Save; on Cancel it presses Cancel; on the checkbox it does nothing. | FR3.3, AC4.1.3 |
| BR4.4 | validation | A title that is empty or only spaces after trimming is refused with reason `empty` and the message "Please enter a task title."; one of more than 200 visible characters after trimming is refused with reason `too-long` and the message "Title must be 200 characters or fewer." The message is the add form's, shown under the field with the "(!)" mark and announced to screen readers. The task is unchanged, nothing is saved, the typed text and focus stay in the field, and editing stays open. Typing clears the message. | FR3.4, AC4.1.4, BR1.2, BR1.3 |
| BR4.5 | policy | Saving a title that, after trimming, equals the task's current title ends editing exactly like Cancel: nothing changes, `updatedAt` is not touched, no save starts [Q1]. The title rules still run first, so an empty or over-long title is refused (BR4.4) rather than treated as unchanged. | [Q1], FR3.5 |
| BR4.6 | policy | Clicking elsewhere on the page, or moving focus out of the row, does nothing: the field stays open with the typed text until Save, Cancel, Enter or Esc [Q2]. | [Q2] |
| BR4.7 | policy | Only one task is ever being edited. Pressing Edit on another row ends the open edit without saving (its typed text is dropped and its old title stays), opens the new row's field with focus in it, and does not return focus to the first row's Edit button [Q3]. | [Q3] |
| BR4.8 | constraint | `edit(id, rawTitle)` returns `{ ok: true }` or `{ ok: false, reason }` with `reason` `empty` or `too-long` (contract C4). The id is checked first: for an id that is not in the latest list it changes nothing, starts no save and returns `{ ok: true }`, whatever the text is; only for a known id do the title rules run. A refusal changes nothing and starts no save. | contract C4, robustness |
| BR4.9 | policy | Saving after an edit follows the earlier rules: the whole list is saved after the row is drawn (BR1.7, BR1.10); if the save fails, the change stays on screen and the notice is `save-failed`; the next successful save writes the whole list, including this change, and clears the notice (BR1.12). | FR6.3, contract C4 |
| BR4.10 | policy | The whole edit works by keyboard alone. Tab order while a row is showing: checkbox, Edit, Delete; Enter or Space presses Edit. Tab order while a row is being edited: checkbox, field, Save, Cancel (Edit and Delete are replaced). In the field Enter saves and Esc cancels. Every control shows a visible focus ring. The field's accessible name is "Edit title of" followed by the task's title, the hint is linked to it as its description, and the refusal message is announced when it appears. While a row is being edited its checkbox keeps its accessible name (the task's saved title): the title text stays in the page, visually hidden, so the name the checkbox points at (BR2.7) is not lost; check: the checkbox of an edited row has the saved title as its name. | NFR3, interaction spec |
| BR4.11 | policy | Titles are always plain text: the field's value and the saved title are never run as markup; text such as `<b>x</b>` is shown as typed. The Edit button's accessible name is "Edit" followed by the task's title. A long title wraps in the row and in the field area. | NFR4, interaction spec, M7 |
| BR4.12 | constraint | Which task is being edited is held by the page and is never saved; the typed text and any refusal message are held by the row and exist only while it is being edited. The page clears the edited id whenever that task is no longer in the list that is shown (it was removed, or a filter hides it) as well as when the row ends the edit, so a task that comes back into view later (for example when the filter is switched back to All) is shown normally with its saved title, never reopened in editing and never taking focus. When a task leaves the shown list this way, editing ends, the typed text is dropped and nothing is saved. Any focus move this Unit would make to a row that is no longer shown goes to the add input instead. Mechanism: the id is cleared at the moment it is found to name a task that is not shown (state adjusted during the page's own render, or an equivalent), never left stale to be reactivated later; the Code Generation plan names the exact way. How it is checked in this Unit: no screen path removes or hides the edited task yet (the filter is U5 and other-tab sync is U6), so a component test renders the page with the hook made to hide the edited task and then show it again, and checks that it is not in editing, shows its saved title and takes no focus; the filter case itself is checked when U5 adds the filter. | components catalogue, ADR-004 |
| BR4.13 | policy | While a row is being edited and stays in the shown list, its checkbox stays usable: ticking it changes `completed` as in BR2.1 and does not change the typed text. If the tick makes a filter hide the row (not possible before U5 adds the filter), BR4.12 applies and editing ends. The row's Edit and Delete buttons are replaced by Save and Cancel (screen M4), so a delete cannot be started from a row that is being edited; they return when editing ends. Delete can still be pressed on any other row: its dialog opens while the edit stays open with its typed text, and neither Cancel nor Delete in that dialog changes which task is being edited or its typed text (focus after a delete follows BR3.6; the edited row is only affected if it is the one deleted, which cannot happen). | interaction spec, M4 |

## Rules summary (derived)

BR4.1 to BR4.3 and BR4.5 say how editing opens, saves and ends; BR4.4 says what a refused title looks like; BR4.6 and BR4.7 fix what happens around the edit (clicking away, a second edit); BR4.8 and BR4.9 fix the action's result and how it saves; BR4.10 and BR4.11 fix keyboard, names and plain text; BR4.12 and BR4.13 fix where the state lives and what else stays usable.

## Task entity

The task has the five fields fixed by contract C1; this Unit changes only `title` and `updatedAt`. See add-task's functional specification for the entity view.

## Corners swept

| Corner | Settled how |
|--------|-------------|
| Empty or spaces-only title | BR4.4 |
| Exactly 200 and 201 visible characters | BR4.4, using the same count as adding (BR1.3) |
| Spaces added around an unchanged title | Trimmed first, then equal to the current title: BR4.5 |
| Same title typed again | BR4.5 |
| Two tasks with the same title | Allowed, as when adding (BR1.4); editing one to match another is accepted |
| Markup in a title | BR4.11 |
| Very long title | Wraps (BR4.11); the field keeps the typed text |
| Esc with a refusal message showing | Cancels like any Esc; the message goes with the field (BR4.3) |
| Rapid double submit (Enter then Save) | The first accepted save ends editing and the row shows the new title, so a second press finds no field; nothing is saved twice. If the title was refused, the second press is refused the same way |
| Edit pressed on a second row | BR4.7 |
| Clicking or tabbing away | BR4.6 |
| Task removed, or hidden by a filter, while it is edited | BR4.12: editing ends, text dropped, id cleared; pass/fail check: after the task leaves the shown list and returns, it shows its saved title and is not in editing (checked in this Unit by a component test that makes the hook hide and then show the task; the filter case is checked when U5 adds the filter) |
| Delete pressed on another row while one row is edited | BR4.13: the dialog opens, the edit and its text stay |
| Esc or Enter while focus is on Save, Cancel or the checkbox | BR4.3 |
| Edit result for a row that is gone | The focus return falls back to the add input (BR4.12) |
| Complete task | BR4.2: stays complete and in place |
| Save fails | BR4.9 |
| Keyboard use | BR4.10 |
| Task changed in another tab while it is edited | Out of this Unit (U6) |
| Speed | NFR1 names add, complete and delete only; this Unit adds no speed target |

## Changes to earlier documents (for their owners to approve)

This stage does not edit approved documents. Contract C5 lists `TaskList` and `TaskItem` with `onEdit(id, rawTitle) -> result` but no input for which task is being edited. Because only one task may be edited at a time [Q3], the page must know it. This is an additive change to C5, needing the owner's approval under the contract rules and a note in `TASKS.md` and `MEMORY.md`:

- `TaskList` and `TaskItem` also receive `editingId` (the id being edited, or none), `onStartEdit(id)` and `onEndEdit()`.
- The component catalogue says `TaskItem` holds only the text being edited and `App` holds only the task being confirmed for deletion; `App` now also holds the task being edited.
- Contract C4 says `edit` and `toggle` set `updatedAt`; here `edit` sets it only when the trimmed title actually changes, and leaves it untouched for an unchanged title [Q1] (BR4.5).
- Contract C4 (`edit(id, rawTitle)` returning `{ ok }` or `{ ok: false, reason }`) is followed as written; `edit` of an unknown id returns `{ ok: true }` with no change, which C4 does not state.

## Assumptions & Open Questions

- [assumption] BR4.13 deliberately departs from an assumption in the questions file (the checkbox and Delete button stay usable while editing): it follows screen M4, which replaces Edit and Delete with Save and Cancel while a row is edited, so a delete cannot start from an open edit. Only the checkbox stays usable. Not asked of the user.
- [assumption] When a filter hides the edited row (after U5), editing ends and the typed text is dropped, rather than keeping the row visible; U5 may revisit this. Not asked of the user.
- [assumption] The hint "Enter to save, Esc to cancel" is shown only while a row is being edited, in the muted style, under the field (screen M4).
- [assumption] Save is a plain button and Cancel a plain button; Save is the filled (accent) one, as Add is.
- [assumption] The check for "unchanged" compares the trimmed typed text with the stored title exactly (letter case and inner spaces count).
- [assumption] The refusal messages are the add form's texts; the "(!)" mark is shown as in the add form.
- [assumption] Editing a task that another tab has since removed or changed belongs to U6.
- Open question: the two refusal messages are text owned by the add form; the row needs the same text. Where it lives so both use one copy is left to the Code Generation plan.
