# Frontend Components: delete-task (U3), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflows W1 to W4, rules BR3.1 to BR3.11).
- Contracts C4 and C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Screen M5 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The add-task and complete-task component designs: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/frontend-components.md` and `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/frontend-components.md`
- Team practices (one component per file, React functional components and hooks, PascalCase file names): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] and [Q2].

## Component hierarchy

One new component, `DeleteDialog`. `App` reads `useTasks`, holds the pending delete, and renders `TaskForm`, `TaskList` and `DeleteDialog`; `TaskList` renders `TaskItem`.

| Block | File | Change in this unit |
|-------|------|---------------------|
| App | `src/App.jsx` | Holds the id of the task being confirmed and a focus request; finds the task by id; renders `DeleteDialog`; passes `onAskDelete` to `TaskList`; on confirm calls `remove` and asks for focus to move |
| TaskList | `src/components/TaskList.jsx` | Receives `onAskDelete(id)` and passes it to each `TaskItem`; honours a focus request for one row's checkbox |
| TaskItem | `src/components/TaskItem.jsx` | Adds the Delete button; calls `onAskDelete(task.id)`; can take focus on its Delete button or checkbox when asked |
| DeleteDialog | `src/components/DeleteDialog.jsx` (new) | The "Delete this task?" dialog |
| TaskForm | `src/components/TaskForm.jsx` | The add input can take focus when asked (after a delete empties the list) |
| useTasks | `src/hooks/useTasks.js` | Adds `remove(id)` (BR3.2, BR3.8, BR3.9) |
| styles | `src/styles.css` | Adds the Delete button, the dialog and its dimmed backdrop |

## Props, state and values

Contract C5 gives these inputs:

| Block | New input | Calls |
|-------|-----------|-------|
| TaskList | `onAskDelete(id)` | passes it on |
| TaskItem | `onAskDelete(id)` | `onAskDelete(task.id)` when Delete is pressed |
| DeleteDialog | `task` (a task or `null`), `onConfirm(id)`, `onCancel()` | `onConfirm(task.id)` when Delete is chosen; `onCancel()` for Cancel and Esc |

State: `App` holds the pending-delete task id (none, or one id) and a short-lived focus request. `DeleteDialog` and `TaskItem` hold no state. `useTasks` returns `remove` beside `add` and `toggle`.

## DeleteDialog

- Opens as the browser's modal dialog whenever `task` is not `null`, and closes when it becomes `null` [Q2]. The dimming, the keeping of focus inside and the Esc key come from the browser.
- Shows, top to bottom: the heading "Delete this task?" (level 2), the task's title inside quotation marks (plain text, wraps if long), and two buttons, Cancel then Delete (M5).
- Cancel takes focus when the dialog opens (BR3.1). Tab and Shift+Tab cycle Cancel and Delete (BR3.5).
- Esc: the browser's cancel signal is turned into `onCancel()`; the dialog itself is closed by `task` becoming `null`, so the state and the screen cannot disagree.
- A click on the dimmed area does nothing (BR3.4): the click is received by the dialog's own backdrop area and ignored.
- Delete uses the danger color (`#dc2626`, white text); Cancel is the plain button style.
- No animation.

## Row layout and look

- The row shows, left to right: the checkbox, the title, then the Delete button at the right edge. The Edit button arrives in U4 beside it.
- The Delete button's accessible name is "Delete" followed by the title, made by pointing the button at its own text and at the title text (BR3.10). The title text already has an id from complete-task.
- A long title wraps; the buttons stay level with the first line (M7).

## Interaction flows

| Flow | Steps |
|------|-------|
| Delete by mouse | Click Delete on a row; the dialog opens with Cancel focused; click Delete in the dialog; the row is gone at once and focus moves on (BR3.6) |
| Delete by keyboard | Tab to a row's Delete button, press Enter; the dialog opens with Cancel focused; Tab to Delete, press Enter; focus moves on |
| Cancel | Click Cancel or press Esc; the dialog closes; the task stays; focus is on that row's Delete button |
| Click on the dimmed area | Nothing happens |
| Save failure | The removal stays; the notice shows (the notice line is the page text until U6's message bar) |
| Delete the only task | The list is empty; focus is in the add input |
| Delete the last of several rows | Focus is on the checkbox of the row above |

## Focus handling (rule BR3.3 and BR3.6)

- On Cancel or Esc, `App` asks for focus on that row's Delete button once the dialog has closed. It does not rely on the browser to restore focus, so the behaviour is the same in tests and in a real browser.
- On Delete, `App` works out the target before the removal: the checkbox of the task now at the deleted row's position (or the one above if the deleted row was last), or the add input if the list is now empty. It asks for that focus after the removal is drawn and the dialog has closed. The deleted row's Delete button no longer exists, so the browser's own restore would land on nothing; asking explicitly is what keeps a keyboard user's place [Q1].
- How the focus request is honoured (a request value the row or the input reads, or looking the control up by its test id) is chosen in the Code Generation plan. It must not read or write browser storage.

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Role and name | Modal dialog named by the heading "Delete this task?" and described by the quoted title (BR3.10) |
| Delete button name | "Delete" followed by the task title |
| Keyboard | Native buttons: Tab to move, Enter or Space to activate; Esc cancels (BR3.5, BR3.7) |
| Focus | Cancel first; focus stays inside while open; a 2 px accent focus ring on every control; moves on after close as in BR3.3 and BR3.6 |
| Not by color alone | The words "Delete" and "Cancel" are on the buttons; the danger color is an extra signal |
| Contrast | White text on `#dc2626` and `#dc2626` on white are at least 4.5 to 1 (checked in the code summary) |
| Motion | No animation |
| Test ids | `data-testid` on the Delete button, the dialog, and both dialog buttons for tests |

## Test note

The simulated browser used by the tests only partly supports the dialog element's open and close calls. Tests use a small stand-in for those calls [Q2], kept in the shared test setup; the dialog code itself does not change for it.

## Integration points

None outside the browser. The save goes through the existing storage service; this Unit adds no storage function and no network call.

## Assumptions & Open Questions

- [assumption] The Delete button and the dialog buttons are native `button` elements; no custom control is built.
- [assumption] The dialog is always rendered by `App`, once, and is shown or hidden by `task` being set or `null`, rather than being created per row.
- [assumption] The quotation marks around the title are text added by the dialog around the title, which stays a plain text child.
- Open question: whether "next" and "above" follow the visible list once the filter exists. Filtering is U5.
