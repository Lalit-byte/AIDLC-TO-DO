# Frontend Components: complete-task (U2), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflow W1, rules BR2.1 to BR2.9).
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Screens M2 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The add-task component design: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/frontend-components.md`
- Team practices (one component per file, React functional components and hooks): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] and [Q2].

## Component hierarchy

No new component. The hierarchy of add-task is unchanged: `App` reads `useTasks` and renders `TaskForm` and `TaskList`; `TaskList` renders `TaskItem`.

| Block | File | Change in this unit |
|-------|------|---------------------|
| App | `src/App.jsx` | Passes the hook's `toggle` to `TaskList` as `onToggle` |
| TaskList | `src/components/TaskList.jsx` | Receives `onToggle(id)` and passes it to each `TaskItem` |
| TaskItem | `src/components/TaskItem.jsx` | Shows the checkbox and the complete look; calls `onToggle(task.id)` |
| useTasks | `src/hooks/useTasks.js` | Adds `toggle(id)` (BR2.1, BR2.2, BR2.4, BR2.8, BR2.9) |
| styles | `src/styles.css` | Adds the complete look and the checkbox layout |

## Props, state and values

Contract C5 gives `TaskList` and `TaskItem` the input `onToggle(id)`:

| Block | New input | Calls |
|-------|-----------|-------|
| TaskList | `onToggle(id)` | passes it on |
| TaskItem | `onToggle(id)` | `onToggle(task.id)` when the checkbox changes |

`TaskItem` holds no state. The checkbox is controlled by `task.completed`. The hook returns `toggle` beside `add`.

## Row layout and look

- The row shows, left to right: the checkbox, then the title. Edit and Delete arrive in U3 and U4.
- Complete: the title is muted (`#6b7280`) with a line through it, and the checkbox is ticked (BR2.3). Incomplete: normal text color.
- A long title wraps; the checkbox stays level with the first line.
- No animation.

## Interaction flows

| Flow | Steps |
|------|-------|
| Tick by mouse | Click the checkbox; the box ticks and the title is struck through and muted at once |
| Tick by keyboard | Tab to the checkbox (visible focus ring); press Space; same result |
| Untick | The same action on a complete task |
| Click on the title | Nothing happens [Q1] |
| Save failure | The change stays; the notice shows (the notice line is U1's page text until U6's message bar) |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Name | The checkbox's accessible name is the task's title, by pointing the checkbox at the title text (`aria-labelledby`), not by wrapping it in a clickable label [Q2, Q1] |
| State | The native checkbox state (checked or not) is announced; no extra live message |
| Keyboard | Native checkbox: Tab to focus, Space to toggle |
| Focus | A 2 px accent focus ring; focus stays on the checkbox after toggling |
| Not by color alone | The line through the title is the second signal (BR2.3) |
| Contrast | The muted color on the card white is at least 4.5 to 1 (checked in the code summary) |
| Test ids | `data-testid` on the checkbox for tests |

## Integration points

None outside the browser. The save goes through the existing storage service; this Unit adds no storage function and no network call.

## Assumptions & Open Questions

- [assumption] The checkbox is a native `input type=checkbox`; no custom control is built.
- [assumption] The title is rendered as a text child inside a `span` with an id made from the task's id, so `aria-labelledby` can point at it.
- Open question: whether focus should stay on the checkbox if the row is later moved by a filter. Filtering is U5; this Unit never moves a row.
