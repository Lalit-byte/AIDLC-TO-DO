# Code Summary: storage-note (U8)

## What was built

- `frontend/src/App.jsx`: one fixed paragraph, "Your tasks are saved in this browser only." (`data-testid="storage-note"`), placed after the page title and before the message line. No state, no input, not a live region (BR8.1 to BR8.5).
- `frontend/src/styles.css`: `.storage-note` in the muted color, small text, no animation; the page title's bottom margin was reduced to `--space-1` so the line sits close under the title.
- `frontend/src/App.test.jsx`: 3 new tests (empty list, saved tasks, order with the load message showing).
- `docs/TASKS.md`: U8 row added, status `in-progress` (the orchestrator sets it to done).

## Checks run (from `frontend/`)

- `npx vitest run src/App.test.jsx`: 61 passed.
- `npm test`: 10 files, 216 tests passed.
- `npm run lint`: clean. `npm run format:check`: clean. `npm run build`: built.
- Coverage (whole suite): 97.83% of lines (floor 80%, not changed).
- `npm audit`: 0 vulnerabilities.

## Pending

- Manual check in a real desktop browser: how the line looks under the title and the contrast of the muted color (`#6b7280` on white, 4.83 to 1 as calculated earlier).

## Notes

- Git is not set up, so nothing is committed.
