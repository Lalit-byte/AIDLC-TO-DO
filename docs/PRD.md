# PRD: Todo List App

> Source of truth for WHAT we build and WHY. Keep it short. Change it only with the owner's approval, then note the change in MEMORY.md.

## Problem
People need a simple, fast way to capture tasks and track what is done.

## Phases
| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Frontend (basic React, data kept in browser localStorage) | Not started |
| 2 | Backend (REST API + database, frontend switched from localStorage to API) | Not started |

## Phase 1 requirements (frontend)
| ID | Requirement | Pass/fail check |
|----|-------------|-----------------|
| FR-1 | Add a task with a title (1-200 chars) | New task appears at top of list; empty title is rejected with a message |
| FR-2 | Mark a task complete / incomplete | Checkbox toggles; completed style is visible |
| FR-3 | Edit a task title | Inline edit saves on Enter, cancels on Esc |
| FR-4 | Delete a task | Task is removed from list and storage |
| FR-5 | Filter: All / Active / Completed | List shows only matching tasks |
| FR-6 | Persist across page reloads | Reload shows same tasks (localStorage) |
| FR-7 | Show count of remaining active tasks | Count updates on every change |

## Phase 2 requirements (backend, outline only)
- BR-1 CRUD API for tasks matching the Task shape in ARCHITECTURE.md.
- BR-2 Persistent storage; frontend storage layer swapped without UI changes.
- Details are written when Phase 2 starts.

## Out of scope (for now)
Users/auth, due dates, tags, drag-and-drop ordering, offline sync.

## Success metrics
- All FR items pass their check.
- Add/toggle/delete feel instant (< 100 ms UI response).
