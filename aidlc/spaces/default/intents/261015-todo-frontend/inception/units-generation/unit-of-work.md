# Units of Work: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Component catalogue and decisions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md` and `decisions.md`
- Requirements and user stories: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` and `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `units-generation-questions.md` in this folder, cited as [Q1] to [Q4]; the decomposition plan was approved as presented there.

## Approach

The work is split by feature [Q1]: each unit is a thin vertical slice through the screen, the state and the storage for one capability, and can be run and tried on its own. There is one unit per user story, nine in all [Q2]. The app is one frontend deployed as a single whole, so every unit is embedded in it (no unit is deployed separately).

## Unit table

| Unit ID | Directory | Name | Story | Kind | Size | Deployment model |
|---------|-----------|------|-------|------|------|------------------|
| U1 | u1-add-task | add-task | US1.1 | ui | L | Embedded in the app |
| U2 | u2-complete-task | complete-task | US2.1 | ui | S | Embedded in the app |
| U3 | u3-delete-task | delete-task | US3.1 | ui | M | Embedded in the app |
| U4 | u4-edit-task | edit-task | US4.1 | ui | M | Embedded in the app |
| U5 | u5-filter-tasks | filter-tasks | US5.1 | ui | S | Embedded in the app |
| U6 | u6-keep-tasks | keep-tasks | US6.1 | ui | L | Embedded in the app |
| U7 | u7-count-remaining | count-remaining | US7.1 | ui | S | Embedded in the app |
| U8 | u8-storage-note | storage-note | US8.1 | ui | S | Embedded in the app |
| U9 | u9-empty-guidance | empty-guidance | US9.1 | ui | S | Embedded in the app |

Kind: all units are `ui`, because each delivers something a person sees or does on the one screen, even where much of the work is in the storage service. Sizes are relative effort: S small, M medium, L large.

## Unit definitions

### U1 add-task (US1.1): the thin end-to-end slice

- Description: a person can type a title, add it, and see it at the top of the list; after a reload the tasks are still there.
- Boundaries: the page frame and title (App), the add row (TaskForm), the list and task rows in their display form (TaskList, TaskItem), the state hook with the add action (UseTasks), and TaskStorage with listing, creating, saving and loading tasks in the browser, assigning ids and times, and the title rules (trim spaces, 1 to 200 characters, duplicates allowed).
- Responsibilities: owns the Task shape and the title rules in code; delivers the refusal messages for an empty and a too-long title; shows titles as plain text; responds in under 100 ms for 100 tasks.
- Out of this unit: the load-failure and save-failure messages, shape checking of saved data, atomic saving, other-tab sync (all U6); the browser-only line (U8); the empty-list message (U9).
- Implementation notes: this is the unit that creates the project files, so it also holds the Prettier and ESLint configuration and the test setup that the team practices say do not exist yet. Real saving to the browser is included so the slice survives a reload [Q3].

### U2 complete-task (US2.1)

- Description: a person can tick a task as done and untick it again.
- Boundaries: the checkbox and complete styling in TaskItem; the toggle action in UseTasks; the update operation in TaskStorage.
- Responsibilities: muted and struck-through look (not color alone); position unchanged; Space toggles; speed target.
- Implementation notes: changes files that U1 creates (TaskItem, UseTasks, TaskStorage).

### U3 delete-task (US3.1)

- Description: a person can delete a task after confirming in a dialog.
- Boundaries: the Delete button in TaskItem; the DeleteDialog block (new); the pending-delete state in App; the remove action in UseTasks; the remove operation in TaskStorage.
- Responsibilities: "Delete this task?" with the title, Cancel focused first, Esc and Cancel keep the task, Delete removes it from the list and from the saved tasks; focus handling in the dialog.
- Implementation notes: the dialog is a new block that `docs/ARCHITECTURE.md` does not yet list.

### U4 edit-task (US4.1)

- Description: a person can correct a task's title in place.
- Boundaries: the editing state of TaskItem; the edit action in UseTasks; the update operation in TaskStorage with the title rules.
- Responsibilities: Edit opens a field with the current title; Enter saves, Esc cancels; refused titles show the same messages as adding; position and complete state are kept.
- Implementation notes: reuses the title rules already in TaskStorage from U1.

### U5 filter-tasks (US5.1)

- Description: a person can show all, active or completed tasks.
- Boundaries: the FilterBar block (new); the filter state in UseTasks; the "No tasks match this filter." message in TaskList.
- Responsibilities: chosen filter marked visually and as pressed; filter returns to All after a reload; keyboard use.
- Implementation notes: needs tasks in both states to be meaningful, which U2 provides.

### U6 keep-tasks (US6.1)

- Description: tasks survive reloads, and the person is told when they cannot be loaded or saved; two tabs stay in sync.
- Boundaries: TaskStorage (load failure, save failure, shape check of saved data, all-or-nothing saving, notice of changes from other tabs); UseTasks (the storage notice, refreshing from other tabs); the MessageBar block (new); App placement of the message line.
- Responsibilities: same order, titles and states after a reload; clear messages for load and save failures; damaged data left as it is; other-browser tasks not shared; no task data sent outside the browser; saved tasks keep exactly the five agreed fields.
- Implementation notes: the largest piece of unusual-case logic. Two decisions this unit depends on are still open from Domain Design: what a later save does after a failed save, and which block assigns ids when a create fails.

### U7 count-remaining (US7.1)

- Description: a person sees how many tasks are still to do.
- Boundaries: the Counter block (new); the derived count in UseTasks.
- Responsibilities: "N items left", "1 item left", "0 items left"; updates after every change; independent of the filter.

### U8 storage-note (US8.1)

- Description: the page always says tasks are saved in this browser only.
- Boundaries: one fixed line in App, placed under the title.
- Responsibilities: visible with an empty list and with tasks.

### U9 empty-guidance (US9.1)

- Description: an empty list shows "No tasks yet. Add one above."
- Boundaries: the empty message in TaskList.
- Responsibilities: shown on first visit and after the last task is deleted; the count reads "0 items left".

## Assumptions & Open Questions

- [assumption] All units are `ui`. The storage-heavy U6 could be marked `library`, but it also delivers the message line a person sees, so `ui` was kept. Confirmed only as part of the plan you approved.
- [assumption] U8 and U9 are tiny; they were kept as separate units because you chose one unit per story [Q2].
- Open question: U6 depends on two decisions left open in Domain Design (what a later save does after a failed save, and which block assigns ids when a create fails). They should be settled before U6 is designed in detail.
- Open question: several units edit the same files (see `unit-of-work-dependency.md`), so parallel work needs care. Left for Delivery Planning.
