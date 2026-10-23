# Contract Design Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Units and dependencies: `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md` and `unit-of-work-dependency.md` (nine units, all built on U1; shared blocks `App`, `UseTasks`, `TaskStorage`, `TaskList`, `TaskItem`).
- Component catalogue and decisions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md` and `decisions.md` (ADR-002 title rules in TaskStorage, ADR-003 tab sync in TaskStorage, ADR-005 storage failures shown through one message, ADR-006 saved list is the source of truth).
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` (FR6.3, NFR6, NFR8).
- Project document `docs/ARCHITECTURE.md` (the Task shape is the contract between phases).

Why this stage runs: the nine units integrate through shared blocks, so there are agreements to pin down between them even though everything runs inside one browser app. There is no outside consumer in phase 1: no unit exposes an API to another team, a partner or the internet (the phase 2 backend API is outside this phase). The contracts are therefore function-call and saved-data agreements, not network ones. Error, timeout and retry: every call is a local call that returns at once, so there are no timeouts and no automatic retries; a person retries by making the change again.

Already decided and not asked again: the Task shape (id, title, completed, createdAt, updatedAt), title rules inside TaskStorage, tab-sync notices from TaskStorage, one message line for storage problems.

The first question settles a gap that earlier reviews flagged twice (in Domain Design and again in Units Generation) and that decides what the storage service's contract looks like.

## Q1. When a save fails, what should the screen and the storage service do?

Two earlier answers pull in different directions. You chose that a failed change stays on screen with "Your change could not be saved" (Refined Mockups). Domain Design also made the storage service the one that assigns each new task's id and timestamps. A task whose save failed has no id from the storage service, and the next successful save could write it after all.

A. Whole-list saves, ids from the `useTasks` hook. The hook gives each new task its id and times, keeps every change on screen, and asks the storage service to save the whole list. A failed change stays on screen with the message; the next successful save writes the whole list, so that change is saved after all (it is lost only if the person reloads before any later change saves). This keeps your "change stays" answer and gives every task an id. It moves id and time assignment out of the storage service, which changes decision ADR-006.
B. One change per save, ids from the storage service. Each add, tick, edit or delete is its own save, and the storage service returns the saved task or a failure. On failure the change is undone on screen and the message is shown. Simplest to reason about and keeps ADR-006 as written. It reverses your "change stays on screen" answer.
C. One change per save, ids from the storage service, and a failed add stays on screen with a temporary id that is never saved. Keeps your "change stays" answer and ADR-006. A later tick, edit or delete of that unsaved task has nothing saved to change, so it would also fail until the person reloads, and the task is then lost.
X. Other (please specify)

[Answer]: A

## Q2. Should the saved data carry a version number?

The saved list is the contract with the future: phase 2 will mirror the Task shape, and any later change to the shape must not break people's saved tasks. Today a saved list in the wrong shape is treated as unreadable (requirement FR6.3).

A. Yes: the saved data includes a small version number (starting at 1), so a later change to the shape can convert old saved tasks instead of treating them as damaged
B. No: saved data in the wrong shape is treated as unreadable and left as it is, with the load-failure message, as the requirements say today
X. Other (please specify)

[Answer]: A

## Q3. Who agrees to a change to a shared contract once units are being built?

Several developers will join, and the shared blocks (the storage service, the state hook, the Task shape) are changed by many units. Adding something that does not break existing use is low risk; changing or removing something that other units use is not.

A. You (the project owner) approve any change to a shared contract, and it is noted in `TASKS.md` and `MEMORY.md`
B. The developers working on the affected units agree among themselves; changes that only add something are made freely and noted in `MEMORY.md`
C. Additions are made freely and noted in `MEMORY.md`; any change or removal that other units use needs your approval
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
