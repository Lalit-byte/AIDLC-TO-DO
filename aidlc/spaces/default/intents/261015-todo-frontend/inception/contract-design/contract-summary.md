# Contract Summary: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Units and dependencies: `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md` and `unit-of-work-dependency.md`
- Component catalogue and decisions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md` and `decisions.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` (FR1 to FR9, NFR1 to NFR8)
- Project document `docs/ARCHITECTURE.md` (Task shape shared with phase 2).
- Answers recorded in `contract-design-questions.md` in this folder, cited as [Q1] to [Q3].

## What this document pins down

All nine units run inside one browser app, so there is no network boundary and no outside consumer in phase 1. The contracts below are the agreements between the units through the shared blocks: the Task shape, the saved data, the storage service's functions, the state hook's functions, and the inputs of the screen blocks. Error, timeout and retry behavior: every call is local and returns at once, so there are no timeouts and no automatic retries; a person retries by making the change again.

## Contracts

| # | Provider Unit | Consumer | Mechanism | Owner |
|---|---------------|----------|-----------|-------|
| C1 | U1 add-task (creates the Task shape) | U2, U3, U4, U5, U6, U7; `useTasks`; the phase 2 backend (outside this phase, as a future mirror) | Shared schema | U1 |
| C2 | U1 add-task (writes the saved data); U6 keep-tasks (checks and converts it) | `TaskStorage` readers in every tab; the phase 2 storage swap | Shared schema in browser storage | U1 and then U6 |
| C3 | U1 add-task (functions); U6 keep-tasks (failure results and other-tab notices) | `useTasks` and so U2 to U7 | Function contract (in-process call) | U1 |
| C4 | U1 add-task (add action); U2, U3, U4, U5, U7 (their actions and values) | `App` and the screen blocks | Function contract (in-process call) | U1 |
| C5 | U1 (TaskForm, TaskList, TaskItem); U2 to U7 and U9 (their blocks and extra inputs) | `App` | Component inputs (props) | The unit that builds each block |

## C1. Task shape

```yaml shared-schema
Task:
  id: string            # unique; assigned by the useTasks hook when the task is added [Q1]
  title: string         # trimmed; 1 to 200 characters
  completed: boolean
  createdAt: string     # ISO 8601, set once when the task is added
  updatedAt: string     # ISO 8601, set when the task is added and on every change to it
```

- The shape is the one in `docs/ARCHITECTURE.md`; nothing is added or removed. Saved tasks hold exactly these five fields (NFR6).
- Because ids are assigned by the hook [Q1], they are created before a save, and every task on screen has one.

## C2. Saved data in the browser

```yaml shared-schema
SavedTasks:
  version: 1            # [Q2] bumped when the shape changes
  tasks:                # list order is the display order, newest first
    - Task
```

- Stored under one key in the browser's local storage (name to be fixed in Functional Design; proposed `todo-app.tasks`).
- The saved list is the source of truth (ADR-006). The list order is the saved order, so no one re-sorts and ties between equal `createdAt` values do not matter.
- Reading checks the version and every task against the Task shape. Data that fails the check is treated as unreadable: the load-failure message is shown and the data is left as it is. A version number the app does not know is also treated as unreadable.
- Extra unknown fields on a task are ignored on read and not preserved on the next save (open question below).

## C3. Storage service functions

```yaml function-contract
TaskStorage:
  checkTitle(rawTitle):
    returns: { ok: true, title }                       # trimmed title
           | { ok: false, reason: empty | too-long }   # [ADR-002] the title rules live here
    effect: none (pure)
  load():
    returns: { ok: true, tasks }
           | { ok: false, reason: unreadable | blocked }
    effect: reads only; never changes or removes saved data
  save(tasks):
    returns: { ok: true }
           | { ok: false, reason: invalid-task | blocked | full | failed }
    effect: checks every task against the Task shape and the title rules, then writes the whole
            list in one step, or writes nothing (NFR8); on any failure the previously saved
            data is unchanged
  subscribe(listener):
    returns: unsubscribe function
    calls: listener({ ok: true, tasks }) | listener({ ok: false, reason: unreadable })
           when another tab changes the saved tasks (ADR-003)
```

- The storage service never assigns ids or times [Q1]; this changes ADR-006 (see the open questions).
- The title rules are exposed through `checkTitle` so the add form and the edit field can refuse a title before a save is tried, and `save` applies them again as a safety check (ADR-002, and the team hard rule to validate input at the boundary).
- No call sends task data outside the browser (NFR5).

## C4. State hook functions and values

```yaml function-contract
useTasks:
  values:
    visibleTasks: Task[]          # the tasks that match the filter, newest first
    hasTasks: boolean             # false only when there are no tasks at all
    remaining: number             # tasks not complete, whatever the filter
    filter: all | active | completed
    notice: null | { kind: load-failed | save-failed, text }
  actions:
    add(rawTitle):    returns { ok: true } | { ok: false, reason: empty | too-long }
    toggle(id):       flips completed; keeps position; no return value needed
    edit(id, rawTitle): returns { ok: true } | { ok: false, reason: empty | too-long }
    remove(id):       removes the task
    setFilter(value): sets the filter
```

- Every action that changes tasks first updates the list on screen, then asks `TaskStorage.save` with the whole list [Q1]. If the save fails, the change stays on screen and `notice` becomes `save-failed`; the next successful save clears it and writes the whole list, including the earlier change.
- `add` gives the new task its id (a new unique id) and sets `createdAt` and `updatedAt`; `edit` and `toggle` set `updatedAt`; new tasks go to the front of the list; no action reorders the list.
- A load failure sets `notice` to `load-failed` until the page is reloaded; the list starts empty.
- When `TaskStorage` reports a change from another tab, the hook replaces its list with the one it receives.
- `filter` starts as `all` after every reload.

## C5. Inputs of the screen blocks

```yaml function-contract
screen-blocks:
  TaskForm:     { onAdd(rawTitle) -> result, message: null | text }
  TaskList:     { tasks, hasTasks, filter, onToggle(id), onEdit(id, rawTitle) -> result, onAskDelete(id) }
  TaskItem:     { task, onToggle(id), onEdit(id, rawTitle) -> result, onAskDelete(id) }
  FilterBar:    { filter, onChange(value) }
  Counter:      { remaining }
  DeleteDialog: { task | null, onConfirm(id), onCancel() }
  MessageBar:   { notice }
```

- Blocks receive what they show and call the functions they are given; only `App` reads the hook (ADR-004).
- The refusal messages are fixed in the refined mockups ("Please enter a task title." and "Title must be 200 characters or fewer."); each block maps the `reason` it gets back to that text.

## Contract ownership rules

- **Owner:** each contract is owned by the unit that creates it (column Owner above). U6 becomes a co-owner of C2 when it adds the checks.
- **Breaking changes:** changing or removing anything another unit uses, including the Task shape, the saved data, a function's inputs or results, or a block's inputs, needs your approval, and the change is noted in `TASKS.md` and `MEMORY.md` [Q3]. A change to the saved data's shape also raises its version number [Q2].
- **Additive changes:** adding an optional field, a new value that existing readers can ignore, or a new function is allowed once you have approved it under the rule above. Readers ignore unknown extra fields where this document does not say otherwise. The contract is changed in this document or its successor in the same change that alters the code.

## Open questions

| Contract | Question | Blocks |
|----------|----------|--------|
| C2, C3 | After a load failure the list starts empty, so the person's first add would save a new list over the damaged data. Does the first successful save replace the damaged data, which conflicts with requirement FR6.3 ("leave the damaged data as it is"), or does `save` refuse to overwrite data that failed to load, so nothing can be saved until the person reloads or clears the browser data? | U6, and the first save in U1 |
| C3, C4 | Whole-list saves mean a stale tab can write back an old list and bring back a task another tab deleted, or lose another tab's change (the last save wins). Change notices narrow the window but do not close it. Is that acceptable, or should `save` first check the saved list has not changed since it was read? | U6 (and U3, U4 for the tab acting on a removed task) |
| C4 | A rapid double submit (Enter then Add before the input clears) must add exactly one task. This is not an agreed requirement; the add action would have to ignore a second add of the same typed text while the first is being processed. | U1 |
| C2 | Unknown extra fields on a saved task are ignored on read and dropped on the next save. Is that acceptable, or must they be kept? | U6 |
| ADR-006 and the catalogue | This stage changes who assigns ids and times (the hook, not `TaskStorage`) and makes `save` take the whole list. The approved Domain Design documents (`components.md` behaviour of TaskStorage and UseTasks, ADR-005, ADR-006) still say the storage service assigns them. They need updating by their owner; this stage does not edit approved documents. | none (documentation), but Functional Design reads both |
| C2 | The storage key name `todo-app.tasks` is a proposal. | U1 |

## Assumptions & Open Questions

- [assumption] Failure reasons beyond `unreadable`, `blocked`, `full` and `failed` do not need to be told apart on screen; all produce the same two messages.
- [assumption] There are no contracts for phase 2 yet; the Task shape (C1) and the saved data version (C2) are the only things phase 2 is expected to mirror or convert.
- Open question: the six items in the Open questions table above. The first two should be settled before U6 is designed in detail.
