# ARCHITECTURE

> Source of truth for HOW the system is structured. Update it in the same change that alters structure.

## Stack
- Phase 1: React (functional components + hooks), Vite, plain CSS, Vitest + React Testing Library.
- Phase 2: Node.js, Express, SQLite (`better-sqlite3`), Supertest + Vitest for testing.

## Data shape (shared contract between phases)
```ts
type Task = {
  id: string;          // crypto.randomUUID()
  title: string;       // 1-200 chars, trimmed
  completed: boolean;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
};
```
Do not change this shape without updating PRD.md and noting it in MEMORY.md; the backend will mirror it.

## Frontend layout
```
frontend/src/
  components/   TaskForm, TaskItem, TaskList, FilterBar, Counter
  hooks/        useTasks (state + actions)
  services/     taskStorage.js   <- the ONLY place that touches storage / API
  App.jsx
  main.jsx
```

## Backend layout
```
backend/
  src/
    db/         database.js (SQLite setup, table schema, migrations)
    services/   taskService.js (data access layer / CRUD queries)
    routes/     taskRoutes.js (Express endpoints for /api/tasks)
    validators/ titleValidator.js (validation rules mirroring frontend)
    app.js      (Express app configuration, CORS, json parser, error middleware)
    server.js   (Server entry point, port listener)
  tests/        unit and integration tests (Supertest + Vitest)
  package.json
```

## Key decisions
1. **Storage behind a service.** UI calls `taskStorage` (`list, create, update, remove`) and never touches localStorage or fetch directly. In Phase 2, `taskStorage.js` connects to the REST API (`/api/tasks`).
2. **State in one hook.** `useTasks` owns task state; components stay presentational.
3. **No global state library.** Alternatives (Redux, Zustand) rejected: overkill for this size.
4. **SQLite with WAL mode.** Fast, embedded, zero-configuration database ensuring persistence with high reliability.

## Module ownership (prevents merge conflicts)
Each component and service is one file. A task should touch as few files as possible; list files in TASKS.md before editing.
