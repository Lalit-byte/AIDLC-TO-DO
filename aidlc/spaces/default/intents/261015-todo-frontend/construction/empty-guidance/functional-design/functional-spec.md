# Functional Specification: empty-guidance (U9), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U9 empty-guidance, story US9.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR9.1, FR6.3, NFR3, NFR4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC9.1.1 and AC9.1.2: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C4 and C5 (`hasTasks`, the `TaskList` inputs): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component catalogue: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Screens M1 and M8 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The add-task functional design (the notices, the list): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1].

## Purpose and scope

empty-guidance tells a person with no tasks where to start: the list area shows the hint "No tasks yet. Add one above." It builds on the earlier Units: the page, the list block and the state hook with `hasTasks` already exist. This document is the source of truth for this Unit's behaviour and rules. It is design only: no code.

In this unit: the empty message in the list block (`TaskList`). `App` already passes `hasTasks` (false only when there are no tasks at all, contract C4 and C5), so no new input, state or action is needed, and `useTasks` and storage are not touched.

Not in this unit: the "0 items left" line (the count, U7), the message "No tasks match this filter." (the filter, U5), the load-failed notice (U1 produces it, U6 gives it its own block).

## Workflows

### W1. The list is empty

1. `App` renders the list block with `hasTasks` false (a first visit, the saved list was empty, the saved tasks could not be loaded, or the last task was just deleted).
2. The list area shows the hint "No tasks yet. Add one above." in muted text, where the rows would be (screen M1) (BR9.1, BR9.2, BR9.4).
3. Nothing else on the page changes: the add row, any notice and the other lines are as they were (BR9.6).

### W2. A task is added

1. The first task is added (the add action of U1).
2. `hasTasks` becomes true and the hint is gone at once; the list shows the task (BR9.3).

### W3. The last task is deleted

1. The last task is removed (delete-task, U3).
2. `hasTasks` becomes false and the hint appears at once (BR9.2).

## State held

None. The hint is shown or not from the one input the list block already receives, `hasTasks`. It holds no state of its own and is never saved.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR9.1 | policy | When there are no tasks at all (`hasTasks` is false), the list area shows the hint "No tasks yet. Add one above." The words are exactly those. A first visit with nothing saved shows it. | FR9.1, AC9.1.1 |
| BR9.2 | policy | When the last task is deleted and the list becomes empty, the same hint appears at once. | AC9.1.2 |
| BR9.3 | policy | As soon as at least one task exists the hint is not shown, and the list of tasks is shown in its place. | FR9.1, screens M1 and M2 |
| BR9.4 | policy | The hint shows whenever there are no tasks, including when the list is empty because the saved tasks could not be loaded: it then shows beside the "Your tasks could not be loaded." notice [Q1]. The rule depends only on `hasTasks`, never on a notice. | [Q1], FR6.3 |
| BR9.5 | policy | The hint is plain muted text (the muted color, at least 4.5 to 1 against the card), not a button and not clickable, and it is not announced as a live message; a screen reader reads it as ordinary text. It is text only, never markup. | NFR3, NFR4, interaction spec |
| BR9.6 | constraint | The hint replaces nothing and removes nothing: the add row, the notice, the title and the other page lines are unchanged. It does not depend on the filter; the filter's own empty message ("No tasks match this filter.") belongs to U5 and is shown only when tasks exist (`hasTasks` true) but none match. | unit definition, FR5.3 |
| BR9.7 | constraint | The "0 items left" part of AC9.1.1 is delivered by the count Unit (U7) and checked there; this Unit makes no change to a count line, which does not exist yet. | unit definition, FR7.2 |

## Rules summary (derived)

BR9.1 to BR9.3 say when the hint shows and goes; BR9.4 says it also shows beside the load-failed notice; BR9.5 fixes how it looks and is read; BR9.6 and BR9.7 fix what it does not touch.

## Corners swept

| Corner | Settled how |
|--------|-------------|
| First visit, nothing saved | BR9.1 |
| Last task deleted | BR9.2 |
| First task added, then deleted again | BR9.3 and BR9.2: hint off, then on |
| Saved tasks could not be loaded | BR9.4 [Q1]: hint shows beside the notice |
| A save fails while the list is empty | The hint stays; the save-failed notice shows as usual (BR9.6) |
| Filter hides every task | Not this Unit: U5's message, since `hasTasks` is true (BR9.6) |
| Screen reader | BR9.5: ordinary text, not a live message |
| Contrast | BR9.5 |
| Keyboard | Nothing to reach: the hint has no control |
| Other tab changes the list | Out of this Unit (U6); the hint follows `hasTasks` whenever it changes |

## Changes to earlier documents

None. This Unit follows contract C4 (`hasTasks: false only when there are no tasks at all`) and C5 (`TaskList` already receives `hasTasks`) as written.

## Assumptions & Open Questions

- [assumption] The hint sits where the list of rows would be, directly under the add row and any notice, as in screen M1.
- [assumption] The hint is rendered as a paragraph of text; its exact styling is the muted color from the design tokens.
- [assumption] The count line and the filter message are not part of this Unit; it is checked on its own with the hint only.
- Open question: none.
