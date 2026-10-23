# Code Summary: empty-guidance (U9)

## What was built

- `frontend/src/components/TaskList.jsx`: takes `hasTasks`. When it is false, renders `<p class="empty-hint" data-testid="empty-hint">No tasks yet. Add one above.</p>` (no list element). When `hasTasks` is true and `tasks` is empty, renders nothing (the filter unit's message is its own). Otherwise the list as before. Header comment updated.
- `frontend/src/styles.css`: `.empty-hint` muted style (`--muted`, `--space-2` above, no animation).
- Tests: 4 new in `TaskList.test.jsx` (the old "renders nothing" test was renamed to "renders no list element", same assertion) and 3 new in `App.test.jsx`.
- `docs/TASKS.md`: row U9 added as `in-progress` (set to done by the orchestrator at completion).

## Results

- Targeted run: 66 passed. Whole suite: 190 passed (9 files).
- Coverage: 97.98% statements, 97.9% lines (floor 80% unchanged).
- Lint, format check and build pass. `npm audit`: 0 vulnerabilities.

## Pending (not run)

- Hand check in a real desktop browser: how the hint looks in the list area and the contrast of the muted color (`#6b7280` on white, 4.83 to 1 as calculated).
- The "0 items left" line of AC9.1.1 and BR9.7 belong to the count unit (U7).

## Deviations

- Tests added: 7 (4 list, 3 page) rather than about 6; one list test (filtered-empty) was kept for BR9.6. No assertion weakened.
