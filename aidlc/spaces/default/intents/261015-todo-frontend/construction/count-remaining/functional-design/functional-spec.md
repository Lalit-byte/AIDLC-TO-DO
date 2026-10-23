# Functional Specification: count-remaining (U7), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U7 count-remaining, story US7.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR7.1 to FR7.3, FR9.1, NFR3, NFR4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC7.1.1 to AC7.1.4, and the "0 items left" part of AC9.1.1: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C4 and C5 (`remaining`, `Counter { remaining }`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component catalogue (`Counter` receives the number and works nothing out): `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Screens M1, M2, M6 and M8 and the Counter spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The empty-guidance design, which left the count part of AC9.1.1 to this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/empty-guidance/functional-design/functional-spec.md`
- The existing code this builds on: `frontend/src/hooks/useTasks.js` and `frontend/src/App.jsx`
- Design basis recorded in `functional-design-questions.md` in this folder (no open questions; confirmed by the person).

## Purpose and scope

count-remaining shows how many tasks are still to do, as a line "N items left" below the list. This document is the source of truth for the line's behaviour and rules. It is design only: no code.

In this unit: the number, worked out by the state hook (`useTasks`) from the full task list and returned as `remaining` (contract C4); the display block `Counter` that receives it and shows the line (contract C5); and `App` placing the line in the summary line below the list.

Not in this unit: the filter buttons (U5), which will share the summary line on its right; the empty-list hint (U9).

## Workflows

### W1. The page is shown

1. `useTasks` works out `remaining` as the number of tasks in the full list whose `completed` is false (BR7.1).
2. `App` passes `remaining` to `Counter`, which shows "N items left" in the summary line below the list (BR7.2, BR7.5).

### W2. A change is made

1. The person adds a task, ticks or unticks one, deletes one, or another tab changes the saved tasks (keep-tasks).
2. The list in `useTasks` changes, so `remaining` is worked out again from the new full list, and the line shows the new number at once (BR7.3).
3. A polite announcement tells screen-reader users the new count (BR7.6). Editing a title, or a failed save, changes no count.

### W3. A filter is chosen (arrives with the filter unit)

The filter changes only which tasks are shown. `remaining` is still worked out from the full list, so the line does not change (BR7.4).

## State held

None new. `remaining` is derived from the list `useTasks` already holds; it is never saved and has no state of its own. `Counter` holds nothing.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR7.1 | calculation | The number is the count of tasks whose `completed` is false, taken from the full task list. With three tasks of which one is complete it is 2 and the line reads "2 items left". | FR7.1, AC7.1.1 |
| BR7.2 | policy | The line reads "N items left" for every N other than 1, including "0 items left" for none, and "1 item left" for exactly one, with the number in digits. | FR7.1, FR7.2, AC7.1.2 |
| BR7.3 | policy | The count is worked out again after every add, tick, untick, delete and reload, and after another tab's change replaces the list, and the line shows the new number at once. A title edit and a failed save do not change it. | FR7.3, AC7.1.3 |
| BR7.4 | constraint | The count never depends on the chosen filter: it is always worked out from the full list, so switching between All, Active and Completed leaves it unchanged. Checked when the filter Unit adds the filter; until then the list shown and the full list are the same. | FR7.3, AC7.1.4 |
| BR7.5 | policy | The line is always shown, including with an empty list ("0 items left", screens M1 and M8, and the count part of AC9.1.1) and beside any message. It is plain text in the summary line below the list, at the left. | FR7.2, AC9.1.1, screens M1, M2 and M8 |
| BR7.6 | policy | The line is announced politely to screen readers when its number changes (a polite live region, not an alert); the first showing when the page opens is not announced as a change. It is plain text, not a control, in the normal text color with at least 4.5 to 1 contrast, never markup. | NFR3, NFR4, interaction spec |
| BR7.7 | constraint | `useTasks` works the number out and returns it as `remaining` (contract C4); `Counter` receives it and works nothing out (contract C5); no new state, storage, action or network use is added. | contracts C4 and C5, catalogue |

## Rules summary (derived)

BR7.1 and BR7.2 say what number and words the line shows; BR7.3 and BR7.4 say when it changes and what it ignores; BR7.5 and BR7.6 say where it is and how it is read; BR7.7 keeps the calculation in the hook and the display simple.

## Corners swept

| Corner | Settled how |
|--------|-------------|
| No tasks | "0 items left" (BR7.2, BR7.5) |
| All tasks complete | "0 items left" (BR7.2) |
| Exactly one incomplete | "1 item left" (BR7.2) |
| A large number | Digits and "items": "100 items left" (BR7.2) |
| Tick a task | The number goes down by one at once (BR7.3) |
| Untick a task | The number goes up by one at once (BR7.3) |
| Delete a complete task | The number does not change; delete an incomplete one and it goes down (BR7.1, BR7.3) |
| Edit a title | No change (BR7.3) |
| A save fails | The change stays on screen, so the count already includes it; no change from the failure itself (BR7.3) |
| Another tab changes tasks | The list is replaced and the count follows (BR7.3) |
| Saved tasks unreadable | Empty list, "0 items left" beside the load-failed message (BR7.5) |
| Filter chosen | No change (BR7.4) |
| Reload | Worked out from the loaded list (BR7.3) |
| Screen reader | Polite announcement of a changed number; not on the first showing (BR7.6) |
| Rapid changes | The line follows the latest list; announcements may be merged by the screen reader (BR7.6) |

## Changes to earlier documents

None. This Unit follows contract C4 (`remaining: number`, "tasks not complete, whatever the filter") and C5 (`Counter: { remaining }`) as written. The empty-guidance design left the count part of AC9.1.1 to this Unit; BR7.5 delivers it.

## Assumptions & Open Questions

- [assumption] The summary line below the list is a row with the count at the left and room at the right for the filter buttons (screens M1, M2 and M6); in this Unit only the count is in it.
- [assumption] A change from another tab is announced like any other change.
- [assumption] The line uses the normal text color (the muted color is for hints); either meets the 4.5 to 1 contrast.
- Open question: none.
