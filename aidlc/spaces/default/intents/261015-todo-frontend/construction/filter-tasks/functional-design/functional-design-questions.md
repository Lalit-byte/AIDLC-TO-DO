# Functional Design Questions: filter-tasks (U5)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U5 filter-tasks, story US5.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR5.1 to FR5.4, FR7.3, NFR3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC5.1.1 to AC5.1.5 and the count-independence criterion AC7.1.4 handed to this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Screens M2 and M6 and the FilterBar and TaskList specs: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Contracts C4 and C5 (`filter`, `setFilter`, `visibleTasks`, `FilterBar { filter, onChange }`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Earlier Units' designs and code: the count design (`aidlc/spaces/default/intents/261015-todo-frontend/construction/count-remaining/functional-design/functional-spec.md`), the delete design (focus after a delete follows the shown list), the edit design (BR4.12), the empty-list design (BR9.6), and the existing `frontend/src/` code

Context: most of this Unit is fixed. Three buttons, All, Active and Completed, show the matching tasks only (FR5.1); the chosen one is highlighted and marked as pressed (FR5.2); when tasks exist but none match, the list area reads "No tasks match this filter." (FR5.3); the filter is All after every reload and is never saved (FR5.4); the buttons work by keyboard alone (AC5.1.5); the count line never changes with the filter (FR7.3); the buttons sit at the right of the summary line that already holds the count. Two choices about what happens as tasks change under a filter are still open.

## Question 1: Where should keyboard focus go when a task leaves the list because of a tick?

For example, with Active chosen, a person ticks a task's checkbox. The task is now complete, so it no longer matches Active and its row disappears, taking the focused checkbox with it.

A. Focus moves to the checkbox of the task that took its place (the next one down), or the one above if it was the last row, or to the add input if no task is left in view. This is the same rule already used after a delete, so a keyboard user keeps their place.
B. Focus is left to the browser, which drops it to the top of the page. Simplest, but a keyboard user loses their place in the list.
X. Other (please specify)

[Answer]: A

## Question 2: What happens when a task is added while Completed is chosen?

A new task is never complete, so it does not match Completed and would not show.

A. The task is added and saved as usual, but it stays out of view until the person chooses All or Active. The list may look unchanged after pressing Add, though the count goes up by one.
B. Adding a task switches the filter to All first, so the new task is seen at once at the top of the list. The person's chosen filter is replaced, but nothing looks like it failed.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] A task that changes so that it stops matching the chosen filter (a tick under Active, an untick under Completed) leaves the shown list at once; one that starts matching appears at once. Position within the list is never changed by a filter (newest first, saved order).
- [assumption] The filter is screen state held by `useTasks` (contract C4: `filter`, `setFilter`); it is never saved, so every reload starts at All, and another tab's changes replace the list but do not change this tab's filter.
- [assumption] "Active" means not complete and "Completed" means complete; "All" shows every task.
- [assumption] The count line reads the full list (count-remaining design): `remaining` is unchanged by the filter, and this Unit adds the test that proves it.
- [assumption] The "No tasks yet. Add one above." hint is shown only when there are no tasks at all; "No tasks match this filter." is shown only when tasks exist and none match (empty-guidance design, BR9.6); they never show together.
- [assumption] A row being edited that the chosen filter hides ends its edit (BR4.12), a delete dialog is modal so no filter can be chosen while it is open, and after a delete focus follows the shown list (delete design); none of this needs a new question.
- [assumption] The filter buttons are a group labeled "Filter tasks", each a native button with a pressed state; the chosen one has an accent border and bold text (not color alone).

## Consolidated Summary Confirmation

- When a tick or untick makes a task stop matching the chosen filter, its row leaves the list at once and focus moves to the checkbox of the task that took its place, or the one above if it was last, or the add input if nothing is left in view: the same rule as after a delete (Q1: A).
- A task added while Completed is chosen is added and saved as usual but stays out of view until All or Active is chosen; the filter is not changed, and the count still goes up (Q2: A).
- Everything else follows the requirements, mockups and earlier designs: All, Active and Completed buttons at the right of the summary line, the chosen one highlighted and pressed, "No tasks match this filter." when tasks exist and none match, the filter always All after a reload and never saved, keyboard use, and a count that never changes with the filter, with the test for that added here.

- Looks correct
- Request changes

[Answer]: Looks correct
