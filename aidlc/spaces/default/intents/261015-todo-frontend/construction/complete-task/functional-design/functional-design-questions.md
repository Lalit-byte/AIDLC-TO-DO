# Functional Design Questions: complete-task (U2)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U2 complete-task, story US2.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR2.1 to FR2.3, NFR1, NFR3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Stories and acceptance criteria AC2.1.1 to AC2.1.4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C3 and C4 (the `toggle` action, `updatedAt` rule): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- The add-task functional design, which settled saving, failed saves and the notices for every action: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- The existing code (`src/hooks/useTasks.js`, `src/components/TaskItem.jsx`), built in add-task.

Context: almost everything for this Unit is already fixed. A tick marks a task complete and an untick reopens it (FR2.1); a complete task is muted with a line through its title, not by color alone (FR2.2); its position never changes (FR2.3); `toggle` sets `updatedAt` and saves the whole list the same way `add` does, after the row is drawn; a failed save keeps the change on screen and shows the save-failed notice; Space toggles a focused checkbox (AC2.1.4); and the change shows in under 100 ms for 100 tasks. Two choices about how the row behaves are still open.

## Question 1: Does clicking the task title also tick it?

A. No: only the checkbox itself ticks and unticks a task. Clicking the title does nothing, which avoids ticking a task by accident while reading or selecting its text.
B. Yes: the title is the label of the checkbox, so clicking the title ticks it too, and the clickable area is bigger.
X. Other (please specify)

[Answer]: A

## Question 2: What does a screen reader announce for the checkbox?

A. The checkbox is named by the task's own title (for example, "Buy milk, checkbox, not checked"), by pairing the checkbox with the title as its label; the tick state is read as checked or not checked.
B. A fixed action text on each checkbox, such as "Mark Buy milk as done", plus the checked state.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] `toggle` flips `completed` and sets `updatedAt` to the time of the change, and nothing else about the task changes (contract C4, FR2.3).
- [assumption] A complete task keeps its place in the list and is not moved or hidden (requirements assumption A2).
- [assumption] The complete look is a muted color with a line through the title; the line is the signal that does not rely on color (FR2.2, design file).
- [assumption] Ticking a task that another tab has since deleted is an other-tab case that belongs to U6.
- [assumption] No sound, animation or announcement beyond the native checkbox state change is added.

## Consolidated Summary Confirmation

- Only the checkbox ticks and unticks a task; clicking the title does nothing (Q1: A).
- The checkbox is named by the task's own title for screen readers. To keep both answers true, the name points at the title text without making the title a clickable label (Q2: A, with Q1: A).
- Everything else follows the add-task design: position kept, `updatedAt` set, save after the row is drawn, failed save keeps the change and shows the notice.

- Looks correct
- Request changes

[Answer]: Looks correct
