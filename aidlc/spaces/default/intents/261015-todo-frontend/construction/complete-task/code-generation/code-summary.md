# Code Summary: complete-task (U2), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan: `code-generation-plan.md` in this folder.
- Functional design: `aidlc/spaces/default/intents/261015-todo-frontend/construction/complete-task/functional-design/functional-spec.md` and `frontend-components.md`.

## What was built

Ticking and unticking a task (story US2.1): a native checkbox in each row, the muted line-through look for a complete task, and `toggle(id)` in the state hook. The task keeps its position, `updatedAt` is set to the time of the change, and the whole list is saved after the row is drawn (same mechanism as `add`).

## Files changed

| File | Change |
|------|--------|
| `src/hooks/useTasks.js` | Added `toggle(id)`, returned beside `add`. Unknown id: no change, no save (BR2.9). |
| `src/components/TaskItem.jsx` | Checkbox (`data-testid="task-checkbox"`) controlled by `task.completed`, named by the title via `aria-labelledby`; `task-item--completed` class when complete. |
| `src/components/TaskList.jsx` | Takes `onToggle` and passes it to each row. |
| `src/App.jsx` | Passes the hook's `toggle` as `onToggle`. |
| `src/styles.css` | Row layout (flex), checkbox size and focus ring, complete look (`--muted`, line-through). |
| `src/hooks/useTasks.test.jsx`, `src/components/TaskItem.test.jsx`, `src/components/TaskList.test.jsx`, `src/App.test.jsx` | New tests (below). |
| `docs/TASKS.md` | U2 row added (`in-progress`). |

`taskStorage.js` and the storage contract are unchanged.

## Decisions

- Only the checkbox toggles; the title is a plain `span` with id `task-title-<task id>`, so clicking it does nothing (BR2.6). The checkbox points at it with `aria-labelledby` (BR2.7).
- `toggle` reads the latest list from `tasksRef` and updates it immediately, so two quick toggles flip twice and give one save of the latest list.
- Focus stays on the checkbox after a toggle (the row element is reused because rows are keyed by id); a test checks this.
- The existing notice state machine is unchanged: a failed save keeps the change and shows `save-failed`; the next good save writes the whole list and clears it.

## Tests and checks (real runs)

| Check | Result |
|-------|--------|
| `npx vitest run src/hooks/useTasks.test.jsx` | 24 passed |
| `npx vitest run src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` | 41 passed |
| `npm test` | 7 files, 114 passed (91 before, 23 new: hook 7, row 6, list 3, page 7) |
| `npm run lint` | no output (clean) |
| `npm run format:check` | all files use Prettier code style |
| `npm run build` | built, 22 modules |
| `npm run test:coverage` | lines 97.59%, statements 97.66%, branches 97.29%, functions 100%; threshold (80% lines) unchanged and met |
| `npm audit` | found 0 vulnerabilities |

Coverage note: the report, as configured in add-task, counts `src/hooks` and `src/services` only; component files are not in the coverage scope. The configuration was not touched.

## Deviations

- 23 new tests instead of "about 20" (within the plan's wording).
- The speed guard measures only code time in the simulated browser (regression guard), as planned.

## Open manual checks (pending, owner: the human at the checkpoint)

- Contrast of the complete look (muted `#6b7280` on white, calculated 4.83 to 1) with a contrast checker, and a look at the real rendering of the line-through, the checkbox alignment with a wrapped title and the focus ring in a browser (the simulated browser applies no CSS).
- A keyboard-only run of the tick (Tab, Space) by a person. Automated Space-key tests pass.
- The add-task manual checks (Chrome timing, four browsers) remain open.

## Assumptions & Open Questions

- [assumption] Git is not set up, so nothing was committed.
- Open question: the BR2.8 wording point (only the save-failed notice clears on the next good save) is a design-document wording matter; the code follows the add-task state machine.
