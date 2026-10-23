# Code Summary: delete-task (U3)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan: `code-generation-plan.md` in this folder; functional design in `../functional-design/`.

## What was built

- `remove(id)` in `frontend/src/hooks/useTasks.js`: drops one task, keeps order, unknown id is a no-op with no save, saves after the draw like add and toggle.
- `frontend/src/components/DeleteDialog.jsx` (new): built-in modal `dialog`, heading "Delete this task?", quoted title as plain text, Cancel (focused on open) and Delete; Esc is prevented and turned into `onCancel`; backdrop click ignored.
- `TaskItem.jsx`: Delete button named "Delete" plus the title; row carries `data-task-id`. `TaskList.jsx`: passes `onAskDelete`.
- `App.jsx`: pending-delete id, focus moves (Cancel/Esc to that row's Delete button; after delete to next row's checkbox, else row above, else add input; task gone while dialog open: add input).
- `styles.css`: Delete button, dialog, backdrop, focus rings. `frontend/src/test/dialog.js` plus `setup.js`: stand-in for `showModal`/`close`.

## Results

- Hook tests: 31 passed (7 new). Dialog, row, list, page run: 72 passed. Whole suite (`npm test` in `frontend/`): 152 passed. About 31 new tests in all.
- Coverage (this Unit's files): 91.22% lines (floor 80%, not changed).
- `npm run lint`, `npm run format:check`, `npm run build`: clean. `npm audit`: 0 vulnerabilities.

## Deviations from the plan

- Existing tests were adjusted, not weakened: the row text helper in `App.test.jsx` and `TaskList.test.jsx` now reads the title element (the row also contains the Delete button text), and the add-task keyboard test in `App.test.jsx` has one more Tab because the Delete button now sits between rows' checkboxes.
- The 100-task speed guard measures code time from the click on the dialog's Delete button (not a key press) to the row being absent.
- The task-left-the-list test wraps the real hook with `vi.spyOn` to hide a task.
- The pending id is left stale (not cleared) when its task disappears, to avoid a state update inside an effect (lint rule); harmless as ids are unique.

## Pending (manual, real desktop browser)

- Focus stays inside the open dialog and Tab cycles Cancel and Delete (BR3.5); Esc closes it; page dimmed and backdrop click does nothing: pending.
- Keyboard-only delete timing in Chrome for 100 tasks: pending.
- Contrast of white-on-red Delete button (4.83 to 1 as calculated): pending.
- Open: `npm test` verification command must run from `frontend/`; `docs/ARCHITECTURE.md` does not list `DeleteDialog`; Git not set up.
