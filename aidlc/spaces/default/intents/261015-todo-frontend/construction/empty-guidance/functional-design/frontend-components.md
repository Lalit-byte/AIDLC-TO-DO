# Frontend Components: empty-guidance (U9), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflows W1 to W3, rules BR9.1 to BR9.7).
- Contract C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Screens M1 and M8 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The earlier component designs: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/frontend-components.md`
- Team practices (one component per file, React functional components and hooks): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1].

## Component hierarchy

No new component. The hierarchy is unchanged: `App` reads `useTasks` and renders `TaskList`, which renders `TaskItem` for each task.

| Block | File | Change in this unit |
|-------|------|---------------------|
| TaskList | `src/components/TaskList.jsx` | When `hasTasks` is false, shows the hint instead of the (empty) list |
| styles | `src/styles.css` | Adds the muted hint style |

(Paths are relative to the `frontend/` folder.) `App` already passes `hasTasks` to `TaskList`; `useTasks`, `TaskStorage` and the other blocks are not touched.

## Props, state and values

Contract C5 already gives `TaskList` the input `hasTasks`; no new input is needed. `TaskList` holds no state. The hint is shown from `hasTasks` alone (BR9.1 to BR9.4), whatever the notice or the filter says.

## Look

- A single line of muted text, "No tasks yet. Add one above.", in the list area below the add row and any notice (screen M1); it wraps if the page is narrow.
- No icon, no button, no animation.

## Interaction flows

| Flow | Steps |
|------|-------|
| First visit | The page opens with the add input focused and the hint shown in the list area |
| Add the first task | The hint is replaced by the task row at once |
| Delete the last task | The row is removed and the hint appears at once |
| Load failed | The load-failed notice shows and the hint shows beside it [Q1] |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Reading | Ordinary paragraph text; not a live region, so it is not announced when it appears (BR9.5) |
| Contrast | The muted color `#6b7280` on the white card is at least 4.5 to 1 (the same pair as the complete look's text) |
| Keyboard | No control to reach |
| Plain text | The words are fixed text, never markup |
| Test id | `data-testid` on the hint for tests |

## Integration points

None. This Unit adds no storage function, no action and no network call.

## Assumptions & Open Questions

- [assumption] The hint is a paragraph element (not a list item), so it does not appear as an empty list to a screen reader.
- [assumption] When the hint shows, no empty list element is rendered.
- Open question: none.
