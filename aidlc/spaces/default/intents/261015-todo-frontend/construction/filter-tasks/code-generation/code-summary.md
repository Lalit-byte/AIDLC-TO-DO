# Code Summary: filter-tasks (U5), Todo List Frontend (Phase 1)

## What was built

- `frontend/src/hooks/useTasks.js`: holds `filter` (`all` | `active` | `completed`, starts `all`, never saved) and returns `filter`, `setFilter` (ignores unknown values) and `visibleTasks` (the full list narrowed by the filter, in the full list's order). `hasTasks` and `remaining` stay derived from the full list. Another tab's list replacement keeps the filter (BR5.1, BR5.4, BR5.6, BR5.7). Header comment updated.
- `frontend/src/components/FilterBar.jsx` (new): group labeled "Filter tasks" with three native buttons All, Active, Completed, `aria-pressed`, `data-testid` on the group and each button; props `filter`, `onChange` (BR5.2, BR5.5).
- `frontend/src/components/TaskList.jsx`: `hasTasks` true with no task shown renders `<p data-testid="filter-empty">No tasks match this filter.</p>`; the empty hint only when `hasTasks` is false (BR5.3).
- `frontend/src/App.jsx`: renders `FilterBar` at the right of the summary line beside `Counter` (BR5.11). New `handleToggle`: when the toggled task is in the shown list and a filter other than All is chosen (so the tick or untick takes it out of view), the focus target is worked out from the shown list before the change (next row's checkbox, else the one above, else the add input) and the focus request is set only then (BR5.8). Filter buttons move no focus. The existing edit-clearing logic already ends an edit that a filter hides (BR5.10).
- `frontend/src/styles.css`: `.filter-bar` and `.filter-bar__button` (chosen button: accent border and bold; focus ring; no animation). The summary line already placed count left and buttons right.
- `docs/TASKS.md`: row U5 added as `in-progress`.

## Tests (test-after, lean scope as asked)

- Hook: 5 new tests in `frontend/src/hooks/useTasks.test.jsx`.
- Block: 3 new tests in `frontend/src/components/FilterBar.test.jsx`.
- List: 2 new tests in `frontend/src/components/TaskList.test.jsx`.
- Page: 8 new tests in `frontend/src/App.test.jsx` (AC5.1.1 to AC5.1.5, count unchanged under every filter, focus after a tick, add under Completed, edit hidden by a filter).
- 18 added in total. One earlier test in `TaskList.test.jsx` ("shows nothing when tasks exist but none is shown") pinned the placeholder this unit replaces by design (BR5.3); it was removed and the new filter-message test covers the same case with the new behavior. No other test changed, no assertion weakened.

## Check results

| Check | Result |
|-------|--------|
| Whole suite (`npm test`) | 12 files, 247 tests, all passed |
| Coverage (lines) | 97.96% of lines (floor 80%, threshold unchanged) |
| `npm run lint` | passed |
| `npm run format:check` | passed |
| `npm run build` | passed |
| `npm audit` | 0 vulnerabilities |

## Pending (not run, hand checks in a real desktop browser)

- Pending: the look of the three buttons at the right of the summary line and of the chosen state (accent border, bold) (BR5.11, BR5.2).
- Pending: the focus ring on each button.
- Pending: contrast of the text and border colors on the white card (expected at least 4.5 to 1).

## Deviations and notes

- The removed placeholder test in `TaskList.test.jsx` (above); the count-remaining item AC7.1.4 is closed by the BR5.6 count test in `App.test.jsx`.
- `npx prettier --write` was run on the files this unit touched.
- Git is not set up, so nothing is committed. `docs/TASKS.md` U5 stays `in-progress`.

## Assumptions & Open Questions

- [assumption] No new dependency was needed.
- Open question: none.
