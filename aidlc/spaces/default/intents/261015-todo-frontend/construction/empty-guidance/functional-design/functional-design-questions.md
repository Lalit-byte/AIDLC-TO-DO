# Functional Design Questions: empty-guidance (U9)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U9 empty-guidance, story US9.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR9.1 and FR6.3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC9.1.1 and AC9.1.2: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Screens M1 and M8 and the interaction spec (the empty list, the load-failed notice): `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Contracts C4 and C5 (`hasTasks`, `TaskList` inputs): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Earlier Units' designs and code (notices, list): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and the existing `frontend/src/` code

Context: almost everything for this Unit is fixed. When there are no tasks at all, the list area shows the muted hint "No tasks yet. Add one above." (FR9.1). It shows on a first visit and after the last task is deleted (AC9.1.1, AC9.1.2); it disappears as soon as a task exists; it is the only change this Unit makes, inside the list block, which already receives `hasTasks` (false only when there are no tasks at all). The "0 items left" line in the same criterion belongs to the count Unit (U7), and the "No tasks match this filter." message belongs to the filter Unit (U5). One choice about an unusual case is still open.

## Question 1: Should the hint also show when the list is empty because the saved tasks could not be loaded?

If the saved tasks cannot be read, the page starts with an empty list and shows the notice "Your tasks could not be loaded." above the list (screen M8). The list is empty, so the hint could appear as well.

A. Yes: the hint shows whenever there are no tasks, even beside the load-failed notice. Simple and consistent: the rule is just "no tasks, show the hint". The hint tells the person the list is empty and where to add; the notice tells them why.
B. No: while the load-failed notice is showing, the list area stays blank, so the hint does not suggest starting fresh when the person's earlier tasks may still be in the browser.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] The hint is plain muted text in the list area (screen M1), not a button or a live announcement; a screen reader reads it as ordinary text when it moves through the page.
- [assumption] The hint replaces nothing and removes nothing: the add row, the notice and the other page lines are unchanged.
- [assumption] The hint is shown when `hasTasks` is false and not otherwise; it does not depend on the filter (the filter's own empty message is U5's).
- [assumption] The "0 items left" part of AC9.1.1 is checked in the count Unit (U7), because the count line does not exist before it; this Unit's own check covers the hint only.
- [assumption] The exact words are "No tasks yet. Add one above." (FR9.1), and the hint is not clickable.

## Consolidated Summary Confirmation

- The hint "No tasks yet. Add one above." shows whenever there are no tasks, including beside the "Your tasks could not be loaded." notice (Q1: A).
- Everything else follows the unit definition and the earlier designs: it shows on a first visit and after the last task is deleted, disappears as soon as a task exists, is plain muted text in the list area, and does not depend on the filter. The "0 items left" part of the criterion is checked in the count unit.

- Looks correct
- Request changes

[Answer]: Looks correct
