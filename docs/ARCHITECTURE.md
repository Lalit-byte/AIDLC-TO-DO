# ARCHITECTURE

> Source of truth for HOW the system is structured. Update it in the same change that alters structure.

## Stack
- Phase 1: React (functional components + hooks), Vite, plain CSS, Vitest + React Testing Library.
- Phase 2: to be decided at Phase 2 start (record decision in MEMORY.md).

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
  services/     taskStorage.js   <- the ONLY place that touches storage
  App.jsx
  main.jsx
```

## Key decisions
1. **Storage behind a service.** UI calls `taskStorage` (`list, create, update, remove`) and never touches localStorage directly. In Phase 2 only this file changes to call the API.
2. **State in one hook.** `useTasks` owns task state; components stay presentational.
3. **No global state library.** Alternatives (Redux, Zustand) rejected: overkill for this size.

## Module ownership (prevents merge conflicts)
Each component and service is one file. A task should touch as few files as possible; list files in TASKS.md before editing.
