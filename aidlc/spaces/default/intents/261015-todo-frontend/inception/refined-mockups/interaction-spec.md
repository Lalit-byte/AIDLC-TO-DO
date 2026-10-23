# Interaction Specification: Todo List Frontend (Phase 1, desktop)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Mockups M1 to M9: `mockups.md` in this folder.
- Requirements and stories: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` and `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Project design file: `docs/DESIGN.md` (component names and responsibilities).
- Answers recorded in `refined-mockups-questions.md` in this folder, cited as [Q1] to [Q5].

The components below use the names in `docs/DESIGN.md` where they exist. Two more are described because the mockups need them (DeleteDialog and MessageBar). The format follows the component specification template.

## Interaction rules that apply to every component

| Rule | Behavior | Source |
|------|----------|--------|
| Enter and Esc | Enter confirms the action the person is in (add, save an edit). Esc cancels it (edit, delete dialog). | FR1.5, FR3.2, FR3.3, FR4.3 |
| Focus | Every control can be reached by Tab in reading order and shows a visible focus ring (2 px, accent color). Nothing traps focus except the open delete dialog. | NFR3 |
| Speed | The result of an add, a tick or a delete appears in under 100 ms for a list of up to 100 tasks. Any animation is under 300 ms and is turned off when the person's system asks for reduced motion. | NFR1 |
| Messages | A message names what went wrong in the person's words and is announced to screen readers when it appears. It is never conveyed by color alone. | NFR3; [Q3] |
| Text | Titles are shown as plain text, never as markup. | NFR4 |

## TaskForm

| Field | Value |
|---|---|
| Component | TaskForm |
| Description | The title input and the Add button |
| Category | input |

States:

| State | Description | Trigger |
|---|---|---|
| default | Empty input with placeholder "What needs to be done?"; input has focus on page load | page load |
| filled | Text typed | typing |
| error | Message under the row ("Please enter a task title." or "Title must be 200 characters or fewer."), typed text kept | Add or Enter with an invalid title |
| disabled | Not used; Add stays enabled so the person can always see why it was refused | none |

Behavior:

- Enter in the input and the Add button do the same thing (FR1.5).
- A valid title is trimmed, added at the top, the input is cleared and keeps focus (FR1.1, FR1.2, FR1.7; assumption A1 of the requirements).
- Duplicate titles are allowed (FR1.6).

Accessibility:

| Requirement | Implementation |
|---|---|
| Role | Native text input and native button; the form region is labeled "Add a task" |
| Keyboard | Tab to input, type, Enter; Tab to Add, Enter or Space |
| Label | A visible label or an accessible name "Task title" on the input; the placeholder is not the only label |
| Screen reader | The error message is announced when it appears and is linked to the input |
| Focus | Stays in the input after a successful add; stays in the input after an error |

## TaskItem

| Field | Value |
|---|---|
| Component | TaskItem |
| Description | One task: checkbox, title, Edit and Delete buttons |
| Category | display |

States:

| State | Description | Trigger |
|---|---|---|
| default | Checkbox, title, Edit, Delete | render |
| complete | Title muted and struck through; checkbox ticked | tick |
| editing | Title replaced by an input with Save and Cancel | Edit pressed |
| error | Same message as TaskForm under the field | invalid save of an edit |
| confirming | DeleteDialog open for this task | Delete pressed |

Behavior:

- Ticking toggles complete or incomplete and keeps the task where it is (FR2.1, FR2.3).
- Edit opens the field with the current title selected; Enter saves, Esc cancels; the task keeps its place and complete state (FR3.1 to FR3.5).
- Delete opens the DeleteDialog; nothing is removed until Delete is chosen there [Q1] (FR4.1, FR4.2).
- Long titles wrap; the buttons stay level with the first line (M7).

Accessibility:

| Requirement | Implementation |
|---|---|
| Role | Native checkbox and buttons |
| Keyboard | Tab to checkbox, Edit, Delete in that order; Space toggles the checkbox; Enter activates a button |
| Label | The checkbox's accessible name is the task title; Edit and Delete have names "Edit [title]" and "Delete [title]" |
| Screen reader | Complete state is announced by the checkbox; the strike-through is decoration |
| Focus | When editing starts, focus moves into the field; when it ends, focus returns to that task's Edit button; after a delete, focus moves to the next task, or to the input if none remains (assumption A1 below) |

## TaskList

| Field | Value |
|---|---|
| Component | TaskList |
| Description | The list of tasks that match the chosen filter, and the empty messages |
| Category | display |

States:

| State | Description | Trigger |
|---|---|---|
| populated | Tasks, newest first | render with tasks |
| empty | "No tasks yet. Add one above." | no tasks at all (FR9.1) |
| empty filter | "No tasks match this filter." | tasks exist, none match (FR5.3) |
| load error | List empty; the MessageBar shows "Your tasks could not be loaded." | unreadable saved data (FR6.3) |

Behavior: the whole page scrolls for long lists, and the add row scrolls away with it (rough mockups answer).

Accessibility: the tasks are a list; the empty messages are plain text within the list region.

## FilterBar

| Field | Value |
|---|---|
| Component | FilterBar |
| Description | The All, Active and Completed buttons |
| Category | navigation |

States: one button is chosen at a time; the chosen button is highlighted (accent border and bold text, not color alone) and exposed as pressed; All is chosen after every reload (FR5.4).

Accessibility:

| Requirement | Implementation |
|---|---|
| Role | A group of buttons labeled "Filter tasks", each with a pressed state |
| Keyboard | Tab to each button, Enter or Space to choose |
| Screen reader | The chosen filter is announced as pressed |

## Counter

| Field | Value |
|---|---|
| Component | Counter |
| Description | The line "N items left" |
| Category | display |

Behavior: counts tasks that are not complete, whatever the filter; "1 item left" for one and "0 items left" for none (FR7.1 to FR7.3). Updates after every change. Announced politely to screen readers when it changes.

## DeleteDialog (new)

| Field | Value |
|---|---|
| Component | DeleteDialog |
| Description | The "Delete this task?" question over the list [Q1] |
| Category | feedback |

States: closed; open with Cancel focused.

Behavior:

- Opens when Delete is pressed on a task; shows the task's title; the page behind is dimmed.
- Cancel and Esc close it and keep the task; Delete removes the task and closes it (FR4.2, FR4.3).
- Clicking the dimmed area does nothing, so a stray click cannot cancel or confirm a delete (assumption A2 below).

Accessibility:

| Requirement | Implementation |
|---|---|
| Role | Dialog with the heading "Delete this task?" (level 2) and the title as its description |
| Keyboard | Focus starts on Cancel and stays inside the dialog (Tab and Shift+Tab move between Cancel and Delete); Esc closes |
| Focus | Returns to the Delete button of the task when closed without deleting |

## MessageBar (new)

| Field | Value |
|---|---|
| Component | MessageBar |
| Description | The line shown above the add row for the two storage messages [Q3, Q4] |
| Category | feedback |

States:

| State | Message | Trigger |
|---|---|---|
| hidden | none | normal |
| load error | "Your tasks could not be loaded." | unreadable saved data; stays until reload |
| save error | "Your change could not be saved." | a save fails; the change stays on screen [Q4]; hidden after the next successful save |

Accessibility: shown in danger color with a "(!)" mark, announced to screen readers as an alert when it appears.

## Responsive behavior

Desktop only (requirement NFR2). The card is centered with a maximum width of 600 px. No breakpoints are designed. If the window is made narrower, the card shrinks fluidly and keeps working, but this is not designed or tested for phone widths. The 320px line in `docs/DESIGN.md` is not met in phase 1 and is listed for the owner to edit [Q2].

## Assumptions & Open Questions

- [assumption] A1. After a delete, focus moves to the next task (or to the input if the list is empty). Not asked of the user.
- [assumption] A2. Clicking outside the dialog does not close it, to avoid an accidental cancel. Not asked of the user.
- [assumption] A3. The add input keeps focus after a successful add. Same as assumption A1 in the requirements.
- Open question: a rapid double submit (clicking Add twice, or Enter then Add, before the input clears) is not yet specified. The expected behavior is that exactly one task is added; this is not an agreed requirement. Left for the owner.
- Open question: what happens in the second tab when a task is deleted while the first tab is editing or confirming a delete on it. Left for the owner.
- Open question: `docs/DESIGN.md` still says "usable at 320px width"; the owner of that file makes the edit [Q2].
