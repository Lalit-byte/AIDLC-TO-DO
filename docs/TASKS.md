# TASKS

> The shared work board. One row per task. Status: `todo` | `in-progress (<name>)` | `done`.
> Claim before editing. List the files you will touch. Keep tasks small.

## Phase 1: Frontend
| ID | Task | Requirement | Files | Depends on | Status |
|----|------|-------------|-------|------------|--------|
| T1 | Scaffold Vite + React project, ESLint, Prettier, Vitest | - | package.json, vite.config.js, src/main.jsx, src/App.jsx | - | todo |
| T2 | taskStorage service (localStorage) + tests | FR-6 | src/services/taskStorage.js | T1 | todo |
| T3 | useTasks hook (add, toggle, edit, delete, filter) + tests | FR-1..5 | src/hooks/useTasks.js | T2 | todo |
| T4 | TaskForm component + tests | FR-1 | src/components/TaskForm.jsx | T3 | todo |
| T5 | TaskItem + TaskList components + tests | FR-2,3,4 | src/components/TaskItem.jsx, TaskList.jsx | T3 | todo |
| T6 | FilterBar + Counter components + tests | FR-5,7 | src/components/FilterBar.jsx, Counter.jsx | T3 | todo |
| T7 | Styling per DESIGN.md, accessibility pass | - | src/styles.css | T4,T5,T6 | todo |
| T8 | Final test run and manual check against PRD pass/fail checks | all FR | - | T7 | todo |
| U1 | add-task (AI-DLC unit, walking skeleton, story US1.1): project setup, titleRules, taskStorage, useTasks (add), TaskForm, TaskItem, TaskList, App, tests | FR1.1-FR1.7, FR6 | package.json, package-lock.json, index.html, vite.config.js, eslint.config.js, .prettierrc, .prettierignore, .gitignore, src/main.jsx, src/App.jsx, src/styles.css, src/components/TaskForm.jsx, TaskItem.jsx, TaskList.jsx, src/hooks/useTasks.js, src/services/titleRules.js, taskStorage.js, src/test/, and the *.test.js(x) files | - | done |
| U2 | complete-task (AI-DLC unit, story US2.1): `toggle` in useTasks, checkbox and complete look in TaskItem, `onToggle` through TaskList and App, tests | FR2.1-FR2.3 | src/hooks/useTasks.js, src/components/TaskItem.jsx, TaskList.jsx, src/App.jsx, src/styles.css, and the matching *.test.jsx files | U1 | done |
| U3 | delete-task (AI-DLC unit, story US3.1): `remove` in useTasks, Delete button in TaskItem, new DeleteDialog (built-in dialog element), `onAskDelete` through TaskList and App with focus moves, tests | FR4.1-FR4.3 | frontend/src/hooks/useTasks.js, frontend/src/components/DeleteDialog.jsx, TaskItem.jsx, TaskList.jsx, frontend/src/App.jsx, frontend/src/styles.css, frontend/src/test/dialog.js, frontend/src/test/setup.js, and the matching *.test.jsx files | U1 | done |
| U4 | edit-task (AI-DLC unit, story US4.1): `edit` in useTasks, Edit button in TaskItem, new TaskEditField and titleMessages, `editingId` through TaskList and App with focus moves, tests | FR3.1-FR3.5 | frontend/src/hooks/useTasks.js, frontend/src/components/TaskEditField.jsx, titleMessages.js, TaskItem.jsx, TaskList.jsx, TaskForm.jsx, frontend/src/App.jsx, frontend/src/styles.css, and the matching *.test.jsx files | U1 | done |
| U9 | empty-guidance (AI-DLC unit, story US9.1): hint "No tasks yet. Add one above." in TaskList when there are no tasks at all (decided by `hasTasks`), muted style, tests | FR9.1 | frontend/src/components/TaskList.jsx, frontend/src/styles.css, frontend/src/components/TaskList.test.jsx, frontend/src/App.test.jsx | U1 | done |
| U6 | keep-tasks (AI-DLC unit, story US6.1): `subscribe` in taskStorage so a second tab stays in step, refresh and damaged-data handling in useTasks, new MessageBar above the add row, tests | FR6.1-FR6.5 | frontend/src/services/taskStorage.js, frontend/src/hooks/useTasks.js, frontend/src/components/MessageBar.jsx, frontend/src/App.jsx, frontend/src/styles.css, and the matching *.test.js(x) files | U1 | done |
| U8 | storage-note (AI-DLC unit, story US8.1): always-visible line "Your tasks are saved in this browser only." under the page title, muted style, tests | FR8.1 | frontend/src/App.jsx, frontend/src/styles.css, frontend/src/App.test.jsx | U1 | done |
| U7 | count-remaining (AI-DLC unit, story US7.1): `remaining` returned by useTasks, new Counter block ("N items left", status role), summary line below the list in App, tests | FR7.1-FR7.3 | frontend/src/hooks/useTasks.js, frontend/src/components/Counter.jsx, frontend/src/App.jsx, frontend/src/styles.css, and the matching *.test.jsx files | U1 | done |

## Phase 2: Backend
Not planned yet. Break down when Phase 1 is done and PRD Phase 2 is detailed.
