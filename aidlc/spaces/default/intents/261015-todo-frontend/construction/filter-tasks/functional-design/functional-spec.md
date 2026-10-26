# Functional Specification: filter-tasks (U5), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U5 filter-tasks, story US5.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR5.1 to FR5.4, FR7.3, NFR3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC5.1.1 to AC5.1.5, and AC7.1.4 handed to this Unit by count-remaining: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C4 and C5 (`filter`, `setFilter`, `visibleTasks`, `hasTasks`, `remaining`, `FilterBar { filter, onChange }`, `TaskList`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component catalogue: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Screens M2 and M6 and the FilterBar and TaskList specs: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The earlier designs this builds on: count-remaining (`.../count-remaining/functional-design/functional-spec.md`, the summary line and `remaining`), empty-guidance (`.../empty-guidance/functional-design/functional-spec.md`, BR9.6), delete-task (`.../delete-task/functional-design/functional-spec.md`, BR3.6 and BR3.8), edit-task (`.../edit-task/functional-design/functional-spec.md`, BR4.12)
- The existing code: `frontend/src/hooks/useTasks.js`, `frontend/src/App.jsx`, `frontend/src/components/TaskList.jsx`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] and [Q2].

## Purpose and scope

filter-tasks lets a person show all tasks, only those still to do, or only those done. This document is the source of truth for the filter's behaviour, state and rules. It is design only: no code.

In this unit: the filter state and the shown list in the state hook (`useTasks`, contract C4: `filter`, `setFilter`, `visibleTasks`); the new `FilterBar` block with the three buttons (contract C5: `FilterBar { filter, onChange }`); the message "No tasks match this filter." in the list block (`TaskList`); `App` placing the buttons at the right of the summary line that already holds the count; and the focus move when a tick or untick takes a row out of view.

Not in this unit: the count itself (count-remaining, already built; this unit adds the test that the filter never changes it), the empty-list hint (empty-guidance).

## Workflows

### W1. Choose a filter

1. The person presses a filter button with the mouse, or Tab to it and Enter or Space.
2. `FilterBar` calls the `onChange` it was given with the button's value: all, active or completed.
3. `setFilter` in `useTasks` sets the filter. The shown list is worked out again from the full list: all tasks, the tasks not complete, or the tasks complete, in the same order as the full list (BR5.1, BR5.7).
4. The chosen button is highlighted and pressed; the others are not (BR5.2). The count does not change (BR5.6). Focus stays on the button just pressed (BR5.5).
5. If no task matches, the list area shows "No tasks match this filter." (BR5.3). Choosing the filter already chosen changes nothing.

### W2. A tick or untick changes what matches

1. The person ticks or unticks a task (complete-task, BR2.1).
2. If the task now matches the chosen filter when it did not, it appears at once in its place by the list order; if it no longer matches (a tick under Active, an untick under Completed), its row leaves the list at once (BR5.7).
3. When the row leaves, focus moves to the checkbox of the task that took its place, or the one above if it was the last row, or the add input if nothing is left in view [Q1] (BR5.8). The target is worked out before the change, from the list as shown.
4. The count changes by the tick as always (BR7.3 of count-remaining).

### W3. A task is added

1. The person adds a task (add-task, BR1.6).
2. The task is added and saved as usual. If the chosen filter is All or Active it appears at the top; if it is Completed it stays out of view, because a new task is not complete, and the chosen filter is not changed [Q2] (BR5.9). The count goes up by one either way. The add input is cleared and keeps focus as before.

### W4. The page opens, or is reloaded

The filter is All and every task is shown (BR5.4). A change from another tab replaces the list but not the chosen filter (keep-tasks, BR6.4; BR5.4).

## State held

One new value in `useTasks`: the chosen filter, `all` | `active` | `completed`, starting as `all` on every page load. It is screen state only and is never saved. The shown list (`visibleTasks`) is derived from the full list and the filter on every render; `remaining` and `hasTasks` are derived from the full list, so neither depends on the filter. `FilterBar` and `TaskList` hold no state.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR5.1 | policy | All shows every task, Active shows only the tasks that are not complete, and Completed shows only the tasks that are complete, each in the order of the full list. With one active and one complete task the three choices show 2, 1 and 1 tasks. | FR5.1, AC5.1.1 |
| BR5.2 | policy | Exactly one filter is chosen at a time; the chosen button is highlighted (an accent border and bold text, so it is not color alone) and exposed to screen readers as pressed; the others are not pressed. | FR5.2, AC5.1.2 |
| BR5.3 | policy | When tasks exist but none match the chosen filter, the list area shows "No tasks match this filter." as plain text, and not the "No tasks yet. Add one above." hint; the hint is for no tasks at all (BR9.1, BR9.6). | FR5.3, AC5.1.3 |
| BR5.4 | policy | The filter is All whenever the page opens or is reloaded. It is never saved, and a change from another tab does not change it. | FR5.4, AC5.1.4 |
| BR5.5 | policy | The three buttons form a group labeled "Filter tasks", each a native button with a pressed state: Tab reaches each, Enter or Space chooses it, a focus ring shows, and the chosen one is always visible as chosen. Focus stays on the button pressed. | NFR3, AC5.1.5, interaction spec |
| BR5.6 | constraint | The count never depends on the filter: `remaining` is worked out from the full list, so choosing All, Active or Completed leaves "N items left" unchanged. The test for this (a mixed list, every filter in turn, the count equal each time) is added in this unit. | FR7.3, AC7.1.4 handed from count-remaining |
| BR5.7 | policy | The shown list always follows the full list and the filter: a task that stops matching leaves at once, one that starts matching appears at once, and no row ever changes place because of a filter. | FR5.1, FR2.3 |
| BR5.8 | policy | When a tick or untick makes a task leave the shown list, focus moves to the checkbox of the task that took its place, or the one above if it was the last row, or the add input if nothing is left in view; the same rule as after a delete [Q1]. A tick that leaves the row in view moves no focus. | [Q1], NFR3, BR3.6 |
| BR5.9 | policy | A task added while Completed is chosen is added and saved as usual but is not shown; the chosen filter is not changed and nothing is said; the count goes up by one [Q2]. While All or Active is chosen the new task is shown at the top. | [Q2], FR1.2 |
| BR5.10 | constraint | Earlier rules still hold under a filter: a row being edited that the filter hides ends its edit (BR4.12); the delete dialog is modal, so no filter can be chosen while it is open; after a delete, focus follows the shown list (BR3.6); a task that is hidden by the filter cannot be edited or deleted until it is shown. | BR4.12, BR3.6, BR3.8 |
| BR5.11 | policy | The three buttons sit at the right of the summary line, level with the count at its left (screens M2 and M6); they are shown always, including with an empty list. | screens M2 and M6 |

## Rules summary (derived)

BR5.1 to BR5.3 say what each choice shows and the two empty cases; BR5.2 and BR5.5 say how the buttons look and are used; BR5.4 and BR5.6 say what the filter does not touch (reloads, the count); BR5.7 to BR5.9 say how the list, focus and new tasks behave as tasks change under a filter; BR5.10 and BR5.11 tie it to earlier units and the page.

## Corners swept

| Corner | Settled how |
|--------|-------------|
| No tasks at all, any filter | The "No tasks yet. Add one above." hint, not the filter message (BR5.3) |
| Tasks exist, none match | "No tasks match this filter." (BR5.3) |
| Choose the filter already chosen | Nothing changes (W1) |
| Tick under Active | The row leaves; focus per BR5.8 |
| Untick under Completed | The row leaves; focus per BR5.8 |
| Tick under All | The row stays, complete; no focus move |
| Tick under Completed | A task that is complete already cannot be ticked from here; an untick leaves (BR5.8) |
| Add under Completed | Not shown, filter kept, count up (BR5.9) |
| Add under Active or All | Shown at the top (BR5.9) |
| Edit a row, then the filter hides it | Edit ends, typed text dropped (BR5.10, BR4.12) |
| Edit a title under a filter | The task still matches; nothing leaves |
| Delete under a filter | Focus follows the shown list (BR5.10) |
| Delete dialog open | Modal; no filter can be chosen (BR5.10) |
| Another tab changes the list | List replaced; filter unchanged (BR5.4) |
| Reload | All (BR5.4) |
| Count under every filter | Unchanged (BR5.6) |
| Keyboard | BR5.5 |
| Color alone | The chosen button also has bold text and an accent border (BR5.2) |
| Long list | Filtering only hides rows; no change to scrolling |

## Changes to earlier documents

None to contracts: this unit follows C4 (`filter`, `setFilter(value)`, `visibleTasks` "the tasks that match the filter, newest first", `hasTasks` "false only when there are no tasks at all", `remaining` "whatever the filter") and C5 (`FilterBar { filter, onChange(value) }`, `TaskList` inputs) as written. The empty-guidance design said "No tasks match this filter." belongs to this unit (BR9.6); BR5.3 delivers it. The count-remaining design handed the filter test to this unit; BR5.6 delivers it. For the owner of `docs/DESIGN.md`: the chosen button uses an accent border and bold text, as the interaction spec says.

## Assumptions & Open Questions

- [assumption] Filter values are the three words all, active and completed; their button labels are "All", "Active" and "Completed".
- [assumption] The shown list keeps the full list's order; no sorting is added.
- [assumption] The filter message is a plain paragraph in the list area, like the empty-list hint, not a live message.
- Open question: none.
