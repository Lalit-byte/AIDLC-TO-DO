# Domain Design Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` (FR1 to FR9, NFR1 to NFR8).
- User stories: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md` (US1.1 to US9.1).
- Refined mockups and interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/` (seven components: TaskForm, TaskItem, TaskList, FilterBar, Counter, plus DeleteDialog and MessageBar).
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md` and the hard rules in `aidlc/spaces/default/memory/project.md` (browser storage and network access only inside `src/services/`; validate input at the boundary).
- Project document `docs/ARCHITECTURE.md`: React with hooks and plain CSS; a `useTasks` hook for state and actions; `src/services/taskStorage.js` as the only place that touches storage; the `Task` shape (id, title, completed, createdAt, updatedAt); one file per component.

This stage lists the building blocks to write and who owns what. It does not choose how they are grouped for delivery (that is Units Generation) or how they are built in detail (Functional Design).

Already decided and not asked again: the data shape of a task, that storage sits behind one service, that state lives in one hook with no global state library, and that each component is one file. The last three come from `docs/ARCHITECTURE.md`.

## Q1. Which building blocks should the app be made of?

The architecture file names five screen components, one state hook and one storage service. The mockups also need a delete dialog and a message line for storage problems, which the architecture file does not list. Three ways to cover them:

A. The seven blocks in the architecture file (TaskForm, TaskItem, TaskList, FilterBar, Counter, the `useTasks` hook, the storage service), plus a separate DeleteDialog and a separate MessageBar (nine blocks, one file each). This matches the one-component-per-file practice and keeps each block to one job. Easy to merge later, harder to split.
B. As A, but FilterBar and Counter become one SummaryBar, since they share the bottom row (eight blocks). Fewer files; the filter and the count then change for the same reason, which they do not today.
C. As A, but the delete question lives inside TaskItem instead of being its own block (eight blocks). Fewer files; TaskItem then also owns a dialog, which makes it larger and harder to test.
X. Other (please specify)

[Answer]: A

## Q2. Where should the title rules live (trim spaces, 1 to 200 characters)?

The same rules apply when adding and when saving an edit (FR1.1, FR1.3, FR1.4, FR3.4), and the team has agreed to always validate input at the boundary. Putting them in one place means adding and editing cannot disagree.

A. In the storage service, so nothing invalid can ever be saved, whatever the screen does
B. In a small separate block of title rules that both the add form and the edit field call, and that the storage service calls again as a safety check
C. In the `useTasks` hook only, before it calls storage
X. Other (please specify)

[Answer]: A

## Q3. Which block should be responsible for keeping two browser tabs in sync?

The requirement is that a change in one tab appears in the other (FR6.4). Something has to notice that the saved tasks changed under it.

A. The storage service watches for changes from other tabs and tells the `useTasks` hook, which refreshes the screen
B. The `useTasks` hook watches directly, and the storage service stays a plain read and write service
X. Other (please specify)

[Answer]: A

## Q4. How should the new blocks be recorded in `docs/ARCHITECTURE.md`?

`docs/ARCHITECTURE.md` is your file and says it must be updated in the same change that alters structure. Whatever blocks you choose in Q1 differ from its current list of five screen components.

A. I list the needed edits to `docs/ARCHITECTURE.md` in this stage's output, and you make them (same approach as the 320px line in `docs/DESIGN.md`)
B. Update `docs/ARCHITECTURE.md` for me now
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
