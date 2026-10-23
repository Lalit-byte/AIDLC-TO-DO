# Frontend Components: count-remaining (U7), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflows W1 to W3, rules BR7.1 to BR7.7).
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Screens M1, M2, M6 and M8 and the Counter spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Component catalogue (`Counter`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- The earlier component designs: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/frontend-components.md`
- Team practices (one component per file, React functional components and hooks): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`

## Component hierarchy

One new block, `Counter`. `App` reads `useTasks` and renders `Counter` in the summary line below `TaskList`; the filter buttons join that line in the filter unit.

| Block | File | Change in this unit |
|-------|------|---------------------|
| Counter | `src/components/Counter.jsx` (new) | Shows "N items left" from the number it receives |
| App | `src/App.jsx` | Takes `remaining` from the hook and renders `Counter` in a summary line below the list, separated from the list by a thin rule |
| useTasks | `src/hooks/useTasks.js` | Returns `remaining`, the number of tasks in the full list that are not complete |
| styles | `src/styles.css` | Adds the summary line (rule above, count at the left, room on the right) |

(Paths are relative to the `frontend/` folder.) `TaskList`, `TaskItem`, `TaskForm`, the dialog, `MessageBar` and the services are not touched.

## Props, state and values

Contract C5 gives `Counter` the input `remaining` (a number). It holds no state and works nothing out. Contract C4 gives `useTasks` the value `remaining`, derived from its full list on every change; it is not saved.

## Counter

- Shows one line: "N items left" for every N other than 1, and "1 item left" for exactly one; the number is in digits (BR7.2).
- It is plain text in a polite live region (`role="status"`, polite), so a changed number is announced to screen readers without interrupting them; the first showing when the page opens is not announced as a change (BR7.6).
- It has no control and no markup; `data-testid` on the line for tests.

## Layout

- A summary line below the list, separated from it by a thin rule; the count is at the left; the right side is left free for the filter buttons (screens M1, M2 and M6).
- Shown always, with an empty list and with tasks (BR7.5); no animation.

## Interaction flows

| Flow | Steps |
|------|-------|
| Open the page | The summary line shows the count of tasks not yet complete (or "0 items left") |
| Add a task | The count goes up by one at once |
| Tick a task | The count goes down by one at once |
| Untick a task | The count goes up by one at once |
| Delete a task | The count goes down by one if it was incomplete; unchanged if it was complete |
| Edit a title | No change |
| Another tab changes tasks | The count follows the replaced list |
| Choose a filter (later) | No change |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Announcement | A polite live region: the changed number is read out without interrupting; not an alert (BR7.6) |
| Contrast | Normal text color on the white card, at least 4.5 to 1 |
| Keyboard | No control to reach |
| Plain text | The number is text, never markup |
| Test id | `data-testid` on the count line, as the plan names |

## Integration points

None. The number comes from the hook; no storage function, action or network call is added.

## Assumptions & Open Questions

- [assumption] The count line is a single text element with the whole phrase, so a screen reader reads "2 items left" as one phrase.
- [assumption] The summary line is built in the page frame now with only the count in it; the filter unit adds the buttons to it.
- Open question: none.
