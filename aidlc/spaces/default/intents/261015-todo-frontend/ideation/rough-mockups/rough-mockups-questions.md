# Rough Mockups Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Scope document and intent backlog: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/` (seven features FR-1 to FR-7, desktop browsers only, no public launch, value-first order).
- Project design file: `docs/DESIGN.md` (single centered page, five parts, colors and spacing, empty and invalid states, keyboard use and focus, "usable at 320px width").

Already answered earlier and not asked again: which features are in scope, desktop-only for phase 1, accessibility at sensible defaults (labels, keyboard use, contrast), what is left out of the first version.

## Q1. Should the wireframes follow the layout and visual choices already written in `docs/DESIGN.md`?

`docs/DESIGN.md` already sets a single centered page with an input, the task list, a remaining-count line and All/Active/Completed buttons, plus colors and spacing. Following it keeps these mockups and the project's design file consistent.

A. Yes; follow `docs/DESIGN.md` as written
B. Yes, but with changes I will describe (please specify)
C. No; start the layout from scratch
X. Other (please specify)

[Answer]: A

## Q2. Which screen widths should the wireframes cover?

These two statements conflict. Scope Definition confirmed desktop browsers only for phase 1, but `docs/DESIGN.md` says the page must be usable at a narrow 320px width (phone size).

A. Desktop only, as decided in Scope Definition; update the "320px" line in `docs/DESIGN.md` later
B. Desktop wireframes, plus a note that the layout should not break when narrow, without a separate phone design
C. Desktop and a phone-width wireframe, as `docs/DESIGN.md` says
X. Other (please specify)

[Answer]: A

## Q3. What should happen when someone deletes a task?

Deleting is permanent in phase 1 (the task is removed from the list and from storage, FR-4). A mistaken click would lose the task.

A. Delete immediately, with no confirmation
B. Ask "Delete this task?" before deleting
C. Delete immediately and show a short "Undo" message
X. Other (please specify)

[Answer]: B

## Q4. How should a very long task title appear in the list?

A title can be up to 200 characters, which is longer than the list is wide.

A. Wrap onto several lines so the whole title is always visible
B. Cut off with "..." after one line
C. Cut off with "..." after two lines
X. Other (please specify)

[Answer]: A

## Q5. How should a long list of tasks be shown?

The largest list a person will keep has not been decided, so this keeps the wireframes honest about it.

A. The whole page scrolls; the input stays at the top of the page
B. The list scrolls inside the card, and the input and the count line stay in view
C. No preference
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
