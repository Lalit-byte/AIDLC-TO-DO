# Code Summary: keep-tasks (U6), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Plan: `code-generation-plan.md` in this folder (Steps 1 to 10, all ticked).
- Functional design: `aidlc/spaces/default/intents/261015-todo-frontend/construction/keep-tasks/functional-design/functional-spec.md`

## What was built

- `frontend/src/services/taskStorage.js`: new `subscribe(listener)`. It listens for the browser storage-change signal, accepts only this browser's local storage and the saved-tasks key (or no key), re-reads through the same reading code `load` now shares, and calls the listener with `{ ok: true, tasks }` or `{ ok: false, reason: 'unreadable' }`. Kept unreadable text is updated by the rule in BR6.9; a blocked read is ignored; it never writes; the returned function unsubscribes.
- `frontend/src/hooks/useTasks.js`: subscribes in an effect. Another tab's list replaces the screen list and the save list, drops a due save and clears save-failed. Damage from another tab keeps the list and gives the load-failed notice until reload.
- `frontend/src/components/MessageBar.jsx` (new), `frontend/src/App.jsx`, `frontend/src/styles.css`: the message block above the add row, with the "(!)" mark and role alert.
- Docs board: U6 row added in `docs/TASKS.md` as `in-progress` (the orchestrator sets `done`).

## Tests

- New: 9 storage service tests (one is a combined case), 6 hook tests, 4 message block tests (one parameterised for 2 texts), 4 page tests. Total suite: 213 passed in 10 files.
- Lean scope as asked: only the tests named in plan Steps 3, 5 and 7.
- One earlier test adjusted by the minimum: the axe test with a storage notice now looks for role `alert` instead of `status` (the role changed by design, BR6.13); no assertion weakened.
- Checks run from `frontend/`: `npm test` (213 passed), `npm run lint` (clean after one fix in the new test: `window.sessionStorage`), `npm run format:check` (clean), `npm run build` (ok), coverage 97.91% statements / 97.83% lines (floor 80%, not lowered), `npm audit` (0 vulnerabilities).

## Pending manual checks (real desktop browser)

- Two real tabs of the same browser staying in step when a task is added, completed, edited and deleted in either.
- Look and position of the message line above the add row; contrast of the danger color.
- AC6.1.5 (other browsers) is marked pending in `traceability.json`.

## Notes

- Traceability for BR6.1 to BR6.8 and BR6.10 points at the add-task implementation and test files by the plan's mapping; they were not re-read rule by rule.
- Open question carried from the plan: contract C3's `subscribe` keeping damaged text for the backup goes beyond the contract text and needs the owner's approval.
- Git is not set up, so nothing is committed.

## Assumptions & Open Questions

- [assumption] Two real tabs and the visual look are only checked by hand (listed above).
- Open question: owner approval of the `subscribe` behaviour beyond contract C3.
