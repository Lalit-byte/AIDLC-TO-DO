# Architecture Decision Records: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Component catalogue: `components.md` in this folder.
- Requirements and user stories: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` and `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Team practices and hard rules: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Project document `docs/ARCHITECTURE.md`.
- Answers recorded in `domain-design-questions.md` in this folder, cited as [Q1] to [Q4].

ADR-001 to ADR-003 record decisions you made [Q1 to Q3]. ADR-004 to ADR-006 are proposals by the architect that follow from `docs/ARCHITECTURE.md` and the team's hard rules; they were not put to you as questions and are marked Proposed.

## ADR-001: Nine building blocks, plus the App wiring

Status: Accepted [Q1]

Context: `docs/ARCHITECTURE.md` lists five screen components, one state hook and one storage service. The refined mockups need a delete dialog and a message line for storage problems. The team practice is one component per file, and the screen blocks must stay presentational.

Decision: Use nine blocks, one file each: TaskForm, TaskItem, TaskList, FilterBar, Counter, the `useTasks` hook, TaskStorage, DeleteDialog and MessageBar, wired together in `App`.

Consequences:
- Positive: each block has one job and one reason to change; the dialog's focus rules and the message line can be tested on their own; the list matches the architecture file plus two clearly named additions.
- Negative: more files than a flat layout; two new blocks the architecture file does not yet name.
- Neutral: merging blocks later is easy; splitting a merged block later is harder.

Alternatives Rejected:
- Merge FilterBar and Counter into one SummaryBar (eight blocks): fewer files, but the filter and the count change for different reasons and would move together.
- Keep the delete question inside TaskItem (eight blocks): fewer files, but TaskItem would also own a dialog's focus and keyboard behavior, making it larger and harder to test.

## ADR-002: Title rules live in the storage service

Status: Accepted [Q2]

Context: The same rules apply to adding and editing a title: trim spaces and allow 1 to 200 characters (FR1.1, FR1.3, FR1.4, FR3.4). The team has made it a hard rule to validate input at the boundary. Adding and editing must never disagree.

Decision: TaskStorage applies the title rules on every create and update and refuses an invalid title with a distinct reason (empty or too long). The screen blocks show the message for the reason they are given.

Consequences:
- Positive: nothing invalid can ever be saved, whatever the screen does; one place to test the rules; adding and editing cannot diverge.
- Negative: TaskStorage now has three jobs (saving, title rules, watching other tabs). The screen can only learn a title was refused by trying to save it, so there is no refusal before the attempt. In phase 2, when TaskStorage is replaced by a service that calls the backend, the title rules have to move with it or be kept, which `docs/ARCHITECTURE.md` does not expect.
- Neutral: how to keep the rules reusable in phase 2 (for example a separate rules file inside the services folder that TaskStorage calls) is left for Functional Design.

Alternatives Rejected:
- A separate title-rules block called by both forms and again by TaskStorage as a safety check: the rules would survive the phase 2 swap, and the screen could refuse before trying to save, but the rules would be checked in two places and more can drift.
- Rules only in the `useTasks` hook: simple, but anything that writes to storage without the hook could save an invalid title, which breaks the validate-at-the-boundary rule.

## ADR-003: TaskStorage watches for changes from other tabs

Status: Accepted [Q3]

Context: When the app is open in two tabs, a change in one must appear in the other (FR6.4). Something must notice that the saved tasks changed under it. The rule that only TaskStorage touches browser storage is a hard rule.

Decision: TaskStorage watches for changes made by other tabs and tells subscribers; `useTasks` subscribes and refreshes the list on screen. The subscription is a callback registration by `useTasks`, so `useTasks` still depends on TaskStorage and TaskStorage depends on nothing (no cycle).

Consequences:
- Positive: all contact with browser storage, including notices about it, stays in one block; `useTasks` never reads browser storage.
- Negative: TaskStorage grows a subscription feature that has to be tested with a simulated second tab.
- Neutral: how a tab behaves when it is editing a task another tab deleted is not settled here (open item).

Alternatives Rejected:
- `useTasks` watches directly: keeps TaskStorage plain, but would put browser storage code outside the services folder, against the hard rule.
- No sync between tabs: rejected by requirement FR6.4.

## ADR-004: Only App reads the `useTasks` hook; the screen blocks are presentational

Status: Proposed (architect; not put to the user)

Context: `docs/ARCHITECTURE.md` says `useTasks` owns task state and the components stay presentational. The delete question needs to know which task is being confirmed, and the count, filter and list all come from the same state.

Decision: `App` reads `useTasks` once and passes data and actions down. The screen blocks receive what they show and call the functions they are given. `App` also holds which task is being confirmed for deletion.

Consequences:
- Positive: one place wires state to screens; the screen blocks are easy to test with plain inputs; matches the architecture file.
- Negative: `App` passes many props, and a deeper tree would make that harder to follow.
- Neutral: fine for a single page with this few blocks.

Alternatives Rejected:
- Each screen block calls the hook itself: each would get its own copy of state unless the state is shared, which breaks the single-owner rule.
- A shared state provider that any block reads: removes the passing of props, but adds a layer that `docs/ARCHITECTURE.md` rejected as overkill for this size ("no global state library").

## ADR-005: One place turns storage problems into the message the person sees

Status: Proposed (architect; not put to the user)

Context: Requirements FR6.3 and the refined mockups need two messages for storage problems ("Your tasks could not be loaded." and "Your change could not be saved."), shown in one line above the add row, and a failed save keeps the change on screen [Q4 of Refined Mockups]. The team has a hard rule to handle and show errors rather than catch them silently.

Decision: TaskStorage reports a load failure or a save failure; `useTasks` turns it into a StorageNotice and keeps the change on screen; `App` passes the notice to MessageBar. The notice for a load failure stays until reload; the notice for a save failure goes after the next successful save.

Consequences:
- Positive: no failure is hidden; one owner for the notice; MessageBar is trivial to test.
- Negative: because the list is kept on screen after a failed save, the next successful save writes the whole list and can persist the change that failed earlier. That conflicts with "lost on reload" in the mockups and needs a decision before Functional Design.
- Neutral: wording is fixed in the refined mockups.

Alternatives Rejected:
- Each screen block catches its own storage errors: duplicates handling and invites inconsistent messages.
- A page-level catch-all for unexpected errors: hides which action failed and gives the person nothing to act on.

## ADR-006: The saved list is the source of truth; the list on screen is a copy

Status: Proposed (architect; not put to the user)

Context: Tasks exist in two places while the app runs: saved in the browser and held in memory by `useTasks`. A fact kept in two places can disagree, especially with two tabs open.

Decision: TaskStorage owns the Task entity: it assigns ids and created and updated times, and the saved list is the source of truth. `useTasks` holds a copy for display and refreshes it from TaskStorage when another tab changes the saved tasks.

Consequences:
- Positive: one owner of the Task shape (requirement NFR6, which phase 2 mirrors); disagreements between a tab and the saved list have a defined winner.
- Negative: a failed save leaves the copy and the saved list different until the next refresh (see ADR-005).
- Neutral: the exact refresh timing is left for Functional Design.

Alternatives Rejected:
- `useTasks` owns the Task and storage keeps only an opaque saved blob: puts the shape in the screen layer, so the phase 2 swap would have to rebuild it.
- Re-reading the saved list on every action instead of keeping a copy: always agrees, but adds work to every action and puts the under-100-ms target at risk for larger lists.

## Edits needed in `docs/ARCHITECTURE.md` (for the owner to make) [Q4]

- Add DeleteDialog and MessageBar to the "Frontend layout" components line, next to TaskForm, TaskItem, TaskList, FilterBar and Counter.
- Say that TaskStorage also applies the title rules and watches for changes from other tabs, not only list, create, update and remove (ADR-002, ADR-003).
- Add the key decision that only `App` reads the `useTasks` hook (ADR-004) and that the saved list is the source of truth (ADR-006), once those are accepted.
- Note that `src/services/` may hold more than `taskStorage.js` if the title rules or tab watching are split into separate files (open item).

## Assumptions & Open Questions

- [assumption] ADR-004, ADR-005 and ADR-006 follow from `docs/ARCHITECTURE.md` and the hard rules, and are Proposed until the owner accepts them.
- Open question: decide what a successful save does after a failed save, since the list on screen keeps the failed change (ADR-005 and ADR-006). The same gap was raised in the Refined Mockups review. Left for Functional Design.
- Open question: whether the title rules stay inside TaskStorage's file or move to a rules file in the services folder, so the phase 2 swap carries them (ADR-002). Left for Functional Design.
- Open question: the two situations flagged in earlier stages (a tab acting on a task another tab removed, and a rapid double submit). Left for Functional Design.
