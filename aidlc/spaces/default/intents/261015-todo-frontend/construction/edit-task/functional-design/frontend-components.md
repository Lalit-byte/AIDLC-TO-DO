# Frontend Components: edit-task (U4), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflows W1 to W6, rules BR4.1 to BR4.13).
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Screens M3, M4, M7 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The earlier component designs: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/frontend-components.md`, `.../complete-task/functional-design/frontend-components.md` and `.../delete-task/functional-design/frontend-components.md`
- Team practices (one component per file, React functional components and hooks, PascalCase file names): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] to [Q3].

## Component hierarchy

No new required component. `App` reads `useTasks`, holds the id of the task being edited, and renders `TaskForm`, `TaskList` and `DeleteDialog`; `TaskList` renders `TaskItem`, which now has an editing state. The editing field and its buttons may be split into their own file by the Code Generation plan if `TaskItem` grows large (one component per file).

| Block | File | Change in this unit |
|-------|------|---------------------|
| App | `src/App.jsx` | Holds the id of the task being edited; passes `editingId`, `onStartEdit` and `onEndEdit` to `TaskList`; passes the hook's `edit` as `onEdit` |
| TaskList | `src/components/TaskList.jsx` | Receives `editingId`, `onStartEdit`, `onEndEdit` and `onEdit(id, rawTitle)` and passes them to each row |
| TaskItem | `src/components/TaskItem.jsx` | Adds the Edit button and the editing state (field, Save, Cancel, hint, refusal message); holds the typed text and the refusal reason while editing |
| useTasks | `src/hooks/useTasks.js` | Adds `edit(id, rawTitle)` (BR4.2, BR4.5, BR4.8, BR4.9) |
| styles | `src/styles.css` | Adds the Edit button, the editing row layout, the field, the hint and the message |

(Paths are relative to the `frontend/` folder.)

## Props, state and values

Contract C5 gives `TaskList` and `TaskItem` the input `onEdit(id, rawTitle) -> result`. Because only one task may be edited at a time [Q3], three more inputs are needed (an additive change to C5, listed in the functional specification):

| Block | New input | Calls |
|-------|-----------|-------|
| TaskList | `editingId`, `onStartEdit(id)`, `onEndEdit()`, `onEdit(id, rawTitle)` | passes them on |
| TaskItem | the same four | `onStartEdit(task.id)` when Edit is pressed; `onEdit(task.id, text)` on Enter or Save; `onEndEdit()` when editing ends by Save (accepted), Cancel or Esc |

State: `App` holds the edited task's id (or none). `TaskItem` holds, only while `editingId` is its own task: the typed text (starting as the current title) and the refusal reason (or none). Both are dropped when the edit ends, and also when another row's Edit is pressed, because `editingId` then no longer names this task. `useTasks` returns `edit` beside `add`, `toggle` and `remove`.

## Row layout and look

- Showing: the checkbox, the title, then Edit and Delete buttons at the right edge, Edit first (Tab order: checkbox, Edit, Delete).
- Editing (M4): the checkbox stays; the title is replaced on screen by the text input (the title text stays in the page, visually hidden, to name the checkbox) (fills the title space), followed by Save (accent, filled) and Cancel (plain); under the input, the muted hint "Enter to save, Esc to cancel", and, when a save is refused, the message in the danger color with the "(!)" mark. The Edit and Delete buttons are replaced by Save and Cancel while the row is being edited; the checkbox stays usable (BR4.13).
- A long title wraps; the buttons stay level with the first line (M7).
- No animation.

## Interaction flows

| Flow | Steps |
|------|-------|
| Edit by mouse | Click Edit; the field opens with the title selected and focus in it; change the text; click Save; the row shows the new title and focus is on its Edit button |
| Edit by keyboard | Tab to Edit, press Enter; type; press Enter to save or Esc to cancel; focus returns to the Edit button |
| Cancel | Click Cancel or press Esc; the old title shows; focus on the Edit button |
| Refused save | Empty, spaces-only or 201-character text: the add form's message shows under the field; the text and focus stay |
| Same title | Press Enter or Save with no real change: the row closes like Cancel; nothing is saved |
| Click elsewhere | Nothing happens; the field stays open |
| Edit on a second row | The first edit closes without saving; the second field opens with focus in it |
| Save failure | The change stays on screen; the notice shows (the notice line is the page text until U6's message bar) |

## Focus handling

- On entering the editing state the field takes focus and selects all its text (BR4.1). This is an effect of the row entering the editing state.
- `App` owns the return of focus, through the same focus request the delete Unit added (extended with the Edit button as a target). When a row ends its own edit by an accepted or unchanged Save, Cancel or Esc, it asks `App` for focus on that row's Edit button (BR4.2, BR4.3, BR4.5); `App` honours it after the row is drawn by finding the row and its Edit button, and falls back to the add input if the row is not shown.
- When editing ends because another row's Edit was pressed, or because the task left the shown list, no request is made (BR4.7, BR4.12): focus goes to the second row's field, which takes it itself when it opens.
- When the edited task leaves the shown list (removed, or hidden by a filter), `App` clears the edited id (BR4.12), no focus is returned to its row, and any focus request for that row goes to the add input instead; the delete Unit's rules for the focus after a delete apply when the removal was a delete.

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Name of the field | "Edit title of" followed by the task's title, set on the field; the hint is linked to the field as its description (BR4.10) |
| Name of the checkbox while editing | The checkbox keeps pointing at the title text, which stays in the page but visually hidden while the field is shown, so its name is still the saved title (BR4.10) |
| Name of the Edit button | "Edit" followed by the task's title, made like the Delete button's name (BR4.11) |
| Refusal message | Linked to the field and announced when it appears (an alert), with the "(!)" mark so it is not color alone; the field is marked invalid while it shows |
| Keyboard | Native input and buttons: Tab to move, Enter or Space on buttons, Enter in the field saves, Esc cancels (BR4.10) |
| Focus | A 2 px accent focus ring on every control; focus moves as in the focus handling above |
| Contrast | The hint and message colors meet 4.5 to 1 on white, as for the add form's message and the muted text (checked in the code summary) |
| Test ids | `data-testid` on the Edit button, the field, Save, Cancel and the message |

## Integration points

None outside the browser. The save goes through the existing storage service; this Unit adds no storage function and no network call.

## Assumptions & Open Questions

- [assumption] The field is a native text input and the buttons are native buttons; no custom control is built.
- [assumption] The editing row replaces the Edit and Delete buttons with Save and Cancel, as screen M4 shows, so a delete never starts inside an open edit (rule BR4.13). Not asked of the user.
- [assumption] The title is the field's value, set as text (never as markup).
- Open question: where the add form's two refusal messages live so the add form and the row share one copy (a small shared file beside the components, or exported from the form). Left to the Code Generation plan.
