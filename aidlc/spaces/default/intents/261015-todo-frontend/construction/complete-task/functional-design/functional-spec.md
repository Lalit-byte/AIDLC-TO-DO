# Functional Specification: complete-task (U2), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U2 complete-task, story US2.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR2.1 to FR2.3, NFR1, NFR3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC2.1.1 to AC2.1.4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C3 and C4 (the `toggle` action and the `updatedAt` rule): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component catalogue: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Screens M2 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The add-task functional design (saving, notices, state machine; rules BR1.x): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] and [Q2].

## Purpose and scope

complete-task lets a person tick a task as done and untick it again. It builds on the first slice (add-task): the page, the list in memory, saving, and the notices already exist. This document is the source of truth for this Unit's workflow, state and rules. It is design only: no code.

In this unit: the checkbox and the complete look in the task row (`TaskItem`, `TaskList` passes the action down), the `toggle` action in the state hook (`useTasks`), and the update of one task in the storage service's whole-list save (no new storage function is needed: `toggle` changes the list and `save` writes it, as `add` does).

Not in this unit: Edit and Delete buttons (U3, U4), the filter and the count that read the complete state (U5, U7), other-tab sync (U6).

## Workflow

### W1. Tick or untick a task

1. The person activates a task's checkbox with the mouse, or presses Space while it has focus (BR2.5). Only the checkbox does this (BR2.6).
2. `TaskItem` calls the `onToggle` it was given with the task's id.
3. `toggle(id)` in `useTasks` finds the task with that id in the list in memory. If there is none, nothing changes and no save starts (BR2.9).
4. `toggle` builds a new list in which that task has `completed` flipped and `updatedAt` set to the time of the change; every other field and every other task are unchanged, and the task stays at the same position (BR2.1, BR2.2, BR2.4).
5. The new list is put on screen, and a save is made due; the save runs after the row is drawn, the same way as for `add` (BR2.8).
6. The row shows the new state at once: ticked box, muted color and a line through the title when complete; unticked and normal when incomplete (BR2.3).
7. If the save fails, the change stays on screen and the notice becomes `save-failed`, exactly as in add-task's workflow W4 (BR2.8).

There is no refusal path: a toggle cannot be invalid.

## State held

No new state. `useTasks` already holds `tasks` and `notice`; `toggle` changes `tasks` and raises the same "save is due" record `add` uses. The complete state is the `completed` field of each task.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR2.1 | policy | Activating a task's checkbox flips its `completed` value: an incomplete task becomes complete, and a complete task becomes incomplete. | FR2.1, AC2.1.1 |
| BR2.2 | constraint | A toggle sets the task's `updatedAt` to the time of the change. `id`, `title` and `createdAt` never change, and no other task changes. | contract C4, NFR6, AC2.1.1 |
| BR2.3 | policy | A complete task is shown with muted text and a line through its title, so it can be told apart from an incomplete one without relying on color; the checkbox is shown ticked. An incomplete task is shown normally. | FR2.2, AC2.1.2 |
| BR2.4 | constraint | A toggle never changes a task's position in the list, and never hides or moves it. | FR2.3, AC2.1.3 |
| BR2.5 | policy | A focused checkbox toggles with the Space key as well as with the mouse, and the change is shown in under 100 ms with a list of 100 tasks. | AC2.1.4, NFR1, NFR3 |
| BR2.6 | policy | Only the checkbox toggles a task. Clicking or pressing on the title text does nothing [Q1]. | [Q1] |
| BR2.7 | policy | The checkbox is named for screen readers by the task's own title, for example "Buy milk, checkbox, not checked". The name points at the title text; the title is not a clickable label, so BR2.6 holds [Q2]. | NFR3, [Q2], [Q1] |
| BR2.8 | policy | Saving after a toggle follows the add-task rules: the whole list is saved after the row is drawn (BR1.7, BR1.10); if the save fails, the change stays on screen and the notice is `save-failed`; the next successful save writes the whole list, including this change, and clears the notice (BR1.12). | FR6.3, contract C4 |
| BR2.9 | constraint | A toggle for an id that is not in the list changes nothing and starts no save. | robustness; contract C4 |

## Rules summary (derived)

BR2.1, BR2.2 and BR2.4 say what a toggle changes and what it keeps; BR2.3 and BR2.7 say how it looks and is announced; BR2.5 and BR2.6 say how it is used; BR2.8 and BR2.9 say how it saves and how it fails.

## Task entity

The task has the five fields fixed by contract C1; this Unit only changes `completed` and `updatedAt`. See add-task's functional specification for the entity view.

## Corners swept

| Corner | Settled how |
|--------|-------------|
| Ticking the same task twice quickly | Each activation flips once; two flips return to the starting state; one save of the latest list (add-task rule: two actions before the save step give one save) |
| Task not in the list | BR2.9 |
| Complete task with a very long title | The line-through and wrapping apply to the whole wrapped title (display rule in `frontend-components.md`) |
| Keyboard use | BR2.5, BR2.7 |
| Color-only signal | BR2.3: the line-through is the second signal |
| Save fails | BR2.8 |
| Two tabs | Out of this Unit (U6) |
| Empty list | Nothing to toggle; the Unit adds no empty-list behaviour |

## Changes to earlier documents

None. This Unit follows the contracts as written (C4 `toggle`: "flips completed; keeps position; sets updatedAt") and adds no contract change.

## Assumptions & Open Questions

- [assumption] The time written to `updatedAt` is the browser clock's time in ISO 8601, as in add-task.
- [assumption] A toggle of an unknown id is a harmless no-op; no message is shown.
- [assumption] The complete look uses the muted color `#6b7280` and a line-through, as the design file and mockups say.
- Open question: ticking a task that another tab has deleted, or that changed there, belongs to U6's tab-sync work.
