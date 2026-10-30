# PRD: Todo List App

> Source of truth for WHAT we build and WHY. Keep it short. Change it only with the owner's approval, then note the change in MEMORY.md.

## Problem
People need a simple, fast way to capture tasks and track what is done.

## Phases
| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Frontend (basic React, data kept in browser localStorage) | Done |
| 2 | Backend (REST API + database, frontend switched from localStorage to API) | In progress |

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

## Phase 2 requirements (backend)
| ID | Requirement | Pass/fail check |
|----|-------------|-----------------|
| BR-1 | CRUD REST API for tasks | Endpoints for list, create, update, delete match Task shape in ARCHITECTURE.md |
| BR-2 | Persistent SQLite database | Tasks survive backend server restarts |
| BR-3 | Boundary input validation | Title trimmed, 1-200 characters; invalid inputs return 400 with error message |
| BR-4 | Standardized error handling | 400 for bad requests, 404 for not found, 500 for server errors |
| BR-5 | Frontend API integration | Frontend uses backend API; UI functionality remains unchanged |
| BR-6 | CORS & Dev config | Frontend development server can communicate with backend seamlessly |

## Out of scope (for now)
Users/auth, due dates, tags, drag-and-drop ordering, offline sync.

## Success metrics
- All FR items pass their check.
- All BR items pass their check.
- Add/toggle/delete feel instant (< 100 ms UI response).
