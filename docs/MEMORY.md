# MEMORY

> Running log of decisions and what has changed. Read this first in every session. Append only; newest at the bottom. One line per entry, keep it short.

## Current state
- Phase: 2 (backend), AI-DLC intent `261030-todo-backend` (scope: mvp), at stage 1.1 (intent-capture).
- Stack: Node.js, Express, SQLite (`better-sqlite3`), Vitest & Supertest.

## Decisions
- 2026-10-15: Basic React (Vite, plain CSS). Storage in localStorage behind `src/services/taskStorage.js`.
- 2026-10-15: Git not enabled yet (solo developer). Enable before a second developer joins.
- 2026-10-15: Phase 2 (backend) will be a separate AI-DLC intent started after Phase 1 is done.
- 2026-10-30: Phase 2 backend stack agreed: Node.js, Express, SQLite (`better-sqlite3`), Supertest + Vitest. SQLite WAL mode for concurrency and durability. REST endpoints: `GET/POST /api/tasks`, `PATCH/DELETE /api/tasks/:id`.

## Change log
- 2026-10-15: Created PRD.md, ARCHITECTURE.md, RULES.md, DESIGN.md, TASKS.md, MEMORY.md.
- 2026-10-16: Delivery Planning approved (8 Bolts, serial). U1 add-task built and approved as the walking skeleton: 91 tests pass, coverage ~97%, verification command `npm test`. Open for owners: FR6.3 and screen M9 wording (backup copy and save-after-failure), contract C2/C3/C5 wording, ARCHITECTURE.md (titleRules, axe helper); manual checks still to do: Chrome timing with 100 tasks, four browsers, contrast checker (traceability marks them OK before they ran). Construction runs one Unit at a time with a checkpoint each ("Review each checkpoint").
- 2026-10-16: U2 complete-task built and approved: 114 tests pass, coverage ~97%. NFR Requirements, NFR Design and Infrastructure Design were skipped for U2 (no new quality target; add-task's apply). Real-browser look/contrast and keyboard run still to do by hand.
- 2026-10-23: Frontend moved from the project root into `frontend/` (src, config, package.json). Paths in docs now start with `frontend/`; a backend can sit beside it in `backend/`.
- 2026-10-23: delete-task (U3) built and approved: DeleteDialog (built-in dialog), remove action, focus moves; 152 tests pass. Verification command is now `npm test --prefix frontend`. Real-browser checks (focus trap, Esc, backdrop, Chrome timing, Delete contrast) still pending.
- 2026-10-23: edit-task (U4) built and approved: TaskEditField, titleMessages, edit action, one edit at a time (App holds editingId, additive C5 change awaiting owner approval); 184 tests pass; tests kept lean at the person's request. Real-browser checks (editing row layout, contrast, keyboard run) still pending.
- 2026-10-23: empty-guidance (U9) built and approved: hint in TaskList decided by hasTasks, shown beside the load-failed notice; 190 tests pass. The count line part of AC9.1.1 is left to the count unit (U7). Real-browser look and contrast check pending.
- 2026-10-23: keep-tasks (U6) built and approved: TaskStorage.subscribe (second tab stays in step), refresh and damage-from-another-tab handling in useTasks, MessageBar above the add row; 213 tests pass. Open minor review notes: traceability mappings for BR6.8/6.10/6.15, load() clearing kept damaged text on a blocked read, stale pendingId in App could reopen the delete dialog if a removed task returns from another tab. Real-browser two-tab check pending.
- 2026-10-23: storage-note (U8) built and approved: always-visible line 'Your tasks are saved in this browser only.' under the title (App, muted, no state); 216 tests pass. Real-browser look and contrast check pending.
- 2026-10-23: count-remaining (U7) built and approved: useTasks returns remaining (from the full list), Counter shows 'N items left' in a summary line below the list (status role, polite); 230 tests pass. AC7.1.4 (count unchanged by filter) is handed to filter-tasks. Counter uses normal text color, not muted (design owner to confirm). Real-browser screen-reader/look/contrast check pending.
- 2026-10-26: filter-tasks (U5) built and approved on branch task-filter: useTasks filter/setFilter/visibleTasks (hasTasks and remaining stay from the full list), FilterBar (All, Active, Completed) beside the count, 'No tasks match this filter.' in TaskList, focus move when a tick hides a row; 247 tests, about 98% line coverage. The AC7.1.4 count test is closed (BR5.6). Pending: real-browser look of the buttons, focus ring, contrast. The 'under 100 ms' guards in App.test.jsx can miss by a few ms when the whole suite runs at once (pass alone).
- 2026-10-26: Build and Test and CI Pipeline done; mvp workflow complete. Build and Test: all automated checks passed (247 tests, 97.96% lines), failure accepted with open items (10 real-browser checks, lean test volume, AC2.1.2/AC6.1.5/AC7.1.4/AC9.1.1 records). CI: no server; one local command 'npm run verify --prefix frontend' (format, lint, tests, coverage gate without the 100 ms speed guards, build); speed guards run in the plain test step because coverage slows them. Git is not yet initialised; hosting for phase 1 undecided.
- 2026-10-30: Started Phase 2: Backend. Initialized AI-DLC intent `261030-todo-backend`. Stack selected: Node.js, Express, SQLite (`better-sqlite3`), Vitest + Supertest. Updated PRD.md (BR-1..BR-6), ARCHITECTURE.md (backend layout, database, API contract), and TASKS.md with tasks B1 through B7.
- 2026-10-30: Task B1 (scaffold backend project) built and verified. Express app initialized with CORS, JSON body parser, and GET /health check. Supertest integration tests written and passing (100% line/stmt/branch/func coverage). Backend vitest configured with 80% coverage threshold. Frontend regression suite verified (all 247 tests pass).
- 2026-10-30: Task B2 (SQLite database setup & schema) built and verified. Implemented better-sqlite3 wrapper with WAL mode, foreign keys, table schema matching Task shape, and createdAt index in database.js. 10 comprehensive tests in database.test.js passing with 100% line/branch/func coverage. Frontend regression passed (247 tests).
