# Code Summary: count-remaining (U7), Todo List Frontend (Phase 1)

## What was built

- `frontend/src/hooks/useTasks.js`: returns `remaining`, the number of incomplete tasks in the full list `tasks` (never a shown list), derived on every render, held in no state and never saved (BR7.1, BR7.3, BR7.4, BR7.7). Header comment updated.
- `frontend/src/components/Counter.jsx` (new): one `<p>` with no child elements, status role, polite live setting, `data-testid="counter"`; "1 item left" for exactly one, "N items left" otherwise including 0 (BR7.2, BR7.6).
- `frontend/src/App.jsx`: takes `remaining` from the hook and renders `Counter` on every render, inside a summary line directly below the list (BR7.5).
- `frontend/src/styles.css`: summary line (thin rule above, count at the left, right side free for the filter buttons, normal text color, no animation).
- `docs/TASKS.md`: row U7 added as `in-progress`.

## Tests (test-after, lean scope)

- Hook: 5 new tests in `frontend/src/hooks/useTasks.test.jsx` (count, zero cases, tick/untick/add/delete, unchanged on complete delete and title edit, other-tab replacement).
- Block: 5 new tests in `frontend/src/components/Counter.test.jsx` (4 wording cases, one structure/role case).
- Page: 4 new tests in `frontend/src/App.test.jsx` (first render and empty list, acceptance example, changes after tick/untick/add/delete, reload and beside the load-failed message).
- No earlier test needed adjusting; no assertion was weakened.

## Check results

| Check | Result |
|-------|--------|
| Whole suite | 11 files, 230 tests, all passed |
| Coverage (lines) | 97.85% (floor 80%, threshold unchanged) |
| `npm run lint` | passed |
| `npm run format:check` | passed |
| `npm run build` | passed |
| `npm audit` | 0 vulnerabilities |

## Pending (not run, hand checks)

- Pending: the count line is read out politely by a real screen reader when a task is added, ticked, unticked or deleted, and not read out when the page opens.
- Pending: the look of the summary line below the list in a real browser.
- Pending: contrast of the normal text color on white (expected well above 4.5 to 1).
- Pending: AC7.1.4 (count independent of the filter). `remaining` is derived from the full list, but it is fully verified only when the filter unit adds the filter and the test that switches All, Active and Completed with a mixed list and asserts the count is unchanged.

## Deviations and notes

- Deliberate departure: the line uses the normal text color, not the muted color of the design-system mapping; the owner of the design file should confirm.
- `npm test` was replaced by the equivalent single `vitest run --coverage` over the whole suite.
- Git is not set up, so nothing is committed.

## Assumptions & Open Questions

- [assumption] No new dependency was needed.
- Open question: the filter unit must read `remaining` as the hook returns it and add the All, Active and Completed test.
