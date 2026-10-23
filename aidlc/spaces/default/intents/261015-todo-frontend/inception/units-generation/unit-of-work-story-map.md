# Unit-to-Story Map: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Units: `unit-of-work.md` in this folder.
- User stories US1.1 to US9.1: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Answers recorded in `units-generation-questions.md` in this folder, cited as [Q1] to [Q4].

## Story map

| Story | Unit | Directory |
|-------|------|-----------|
| US1.1 | U1 | u1-add-task |
| US2.1 | U2 | u2-complete-task |
| US3.1 | U3 | u3-delete-task |
| US4.1 | U4 | u4-edit-task |
| US5.1 | U5 | u5-filter-tasks |
| US6.1 | U6 | u6-keep-tasks |
| US7.1 | U7 | u7-count-remaining |
| US8.1 | U8 | u8-storage-note |
| US9.1 | U9 | u9-empty-guidance |

## Rows that span more than one unit

| Concern | Units involved | Note |
|---------|----------------|------|
| Saving and loading tasks in the browser (part of US6.1 and of the thin first slice) | U1 and U6 | U1 delivers basic save and load so the first slice survives a reload [Q3]; U6 delivers failure handling, shape checking, all-or-nothing saving and tab sync. US6.1 is assigned to U6, which owns all of its criteria except the basic reload in AC6.1.1, which U1 also exercises. |
| Title rules (trim, 1 to 200 characters), part of US1.1 and US4.1 | U1 and U4 | The rules live in TaskStorage (ADR-002) and are built in U1; U4 reuses them for edits |
| Speed under 100 ms for 100 tasks (acceptance criteria in US1.1, US2.1, US3.1) | U1, U2, U3 | Each unit checks its own action |
| Keyboard use and visible status (acceptance criteria across US1.1 to US5.1) | U1 to U5 | Each unit checks its own controls |
| Task shape and no task data leaving the browser (US6.1) | U1 and U6 | U1 creates the shape; U6 checks it on read and keeps data inside the browser |

## Implementation order within each unit

| Unit | Order of work inside the unit |
|------|-------------------------------|
| U1 | Project setup and checks (formatting, linting, tests); TaskStorage create, list, save and load with the title rules; UseTasks with the add action; TaskForm; TaskList and TaskItem in display form; App wiring |
| U2 | Toggle in TaskStorage and UseTasks; the checkbox and complete look in TaskItem |
| U3 | Remove in TaskStorage and UseTasks; DeleteDialog; Delete button and pending-delete state in App |
| U4 | Update with the title rules in TaskStorage and UseTasks; the editing state in TaskItem |
| U5 | Filter state in UseTasks; FilterBar; filtered empty message in TaskList |
| U6 | Load and save failure results and shape check in TaskStorage; all-or-nothing saving; other-tab notice; StorageNotice and refresh in UseTasks; MessageBar; App placement |
| U7 | Count in UseTasks; Counter |
| U8 | The fixed line in App |
| U9 | The empty message in TaskList |

## Coverage verification

- Every story from US1.1 to US9.1 is assigned to exactly one unit: nine stories, nine rows.
- Every unit U1 to U9 has one story row.
- Cross-cutting rows add a second unit as a contributor only where a story's work is split; they do not change the assigned unit.

## Assumptions & Open Questions

- [assumption] US6.1 is assigned to U6 even though U1 builds the basic save and load, because U6 owns nearly all of its acceptance criteria.
- Open question: whether the non-functional requirements NFR2 (desktop browsers) and NFR7 (80% line coverage) belong to a unit. They are deferred to Build and Test in the user stories and are not assigned to a unit here.
