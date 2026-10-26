# Frontend Components: filter-tasks (U5), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflows W1 to W4, rules BR5.1 to BR5.11).
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Screens M2 and M6 and the FilterBar and TaskList specs: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The earlier component designs: count-remaining, empty-guidance, delete-task, edit-task (under `aidlc/spaces/default/intents/261015-todo-frontend/construction/`)
- Team practices (one component per file, React functional components and hooks): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] and [Q2].

## Component hierarchy

One new block, `FilterBar`. `App` reads `useTasks` and renders `FilterBar` at the right of the summary line, beside `Counter`.

| Block | File | Change in this unit |
|-------|------|---------------------|
| FilterBar | `src/components/FilterBar.jsx` (new) | The three buttons All, Active, Completed; the chosen one highlighted and pressed |
| TaskList | `src/components/TaskList.jsx` | Shows "No tasks match this filter." when `hasTasks` is true and the shown list is empty |
| App | `src/App.jsx` | Takes `filter` and `setFilter` from the hook and renders `FilterBar` in the summary line; when a tick or untick will take the row out of view, works out the focus target first and asks for it (BR5.8) |
| useTasks | `src/hooks/useTasks.js` | Holds `filter` (starts as all, never saved); returns `filter`, `setFilter`, and `visibleTasks` as the filtered list; `hasTasks` and `remaining` stay derived from the full list |
| styles | `src/styles.css` | The summary line's right side holds the buttons; chosen look (accent border, bold) and focus ring |

(Paths are relative to the `frontend/` folder.) `TaskForm`, `TaskItem`, `DeleteDialog`, `MessageBar` and the services are not touched.

## Props, state and values

Contract C5 gives `FilterBar` the inputs `filter` and `onChange(value)`; it holds no state. `TaskList` already receives `tasks` (now the shown list), `hasTasks` and the row actions; no new input. `useTasks` returns `filter` (all, active or completed) and `setFilter(value)` (contract C4); `visibleTasks` is the full list narrowed by the filter, in the same order.

## FilterBar

- A group labeled "Filter tasks" holding three native buttons, in the order All, Active, Completed (BR5.5).
- Each button reports its value through `onChange`; the chosen one has a pressed state exposed to screen readers and shows an accent border and bold text (BR5.2). Pressing the chosen one changes nothing.
- No animation. `data-testid` on the group and on each button for tests.

## TaskList

- With tasks shown: the list, as now.
- With no tasks at all (`hasTasks` false): the "No tasks yet. Add one above." hint (empty-guidance).
- With tasks that exist but none matching (`hasTasks` true, shown list empty): a plain paragraph "No tasks match this filter." with its own test id, in the list area, not a live message (BR5.3). It never shows together with the hint.

## Layout

The summary line below the list keeps the thin rule above it: the count at the left, the three filter buttons at the right (screens M2 and M6), both shown always (BR5.11).

## Focus handling (BR5.8)

When a tick or untick will make the task leave the shown list (a tick while Active is chosen, an untick while Completed is chosen), `App` works out the focus target from the list as shown before the change: the checkbox of the task now at the row's place, or the one above if it was the last row, or the add input if nothing is left in view, and asks for it through the same focus request used after a delete. Otherwise no focus is moved. Pressing a filter button keeps focus on that button; nothing moves it.

## Interaction flows

| Flow | Steps |
|------|-------|
| Choose a filter by mouse | Click a button; the list narrows at once; the button shows as chosen; the count is unchanged |
| Choose a filter by keyboard | Tab to a button, press Enter or Space; same result; focus stays on the button |
| Nothing matches | The list area reads "No tasks match this filter." |
| Tick under Active | The row leaves; focus moves to the next row's checkbox (or above, or the add input) |
| Add under Completed | The task is added but not shown; the count goes up |
| Reload | All is chosen and every task shown |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Group | A labeled group "Filter tasks" with three buttons, each with a pressed state (BR5.5) |
| Keyboard | Tab to each button, Enter or Space to choose; a focus ring on each |
| Not by color alone | The chosen button has bold text and an accent border as well as color (BR5.2) |
| Contrast | Text and border colors on the white card at least 4.5 to 1 |
| Messages | The filter message is plain text in the list area, not a live message |
| Test ids | `data-testid` on the group, each button and the filter message |

## Integration points

None. The filter is screen state; no storage function, no action that saves and no network call.

## Assumptions & Open Questions

- [assumption] The three buttons are plain native buttons in a group element with a label; the pressed state is the standard pressed attribute.
- [assumption] The focus target for BR5.8 is looked up inside the page by `App`, as for a delete.
- Open question: none.
