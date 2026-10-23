# Performance Design: add-task (U1), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Performance requirements NFR1.1 to NFR1.5, NFR2.1, NFR7.3: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/performance-requirements.md`
- Tech stack decisions: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/tech-stack-decisions.md`
- Functional design (workflows W1, W2 and W4, rules BR1.7, BR1.10, BR1.13): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Contracts C3 and C4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Answers recorded in `nfr-design-questions.md` in this folder, cited as [Q1] and [Q2].

Scope of this document: how the add-task Unit meets its speed targets. There is no server, no cache layer and no data to page: the whole design is about doing little work on the add and never making the new row wait.

## Performance budget

The add has a budget of 100 ms from the person pressing Add (or Enter) to the new row being on screen, with 100 tasks on the list (NFR1.1). The design aims far below that, so the budget absorbs a slow machine.

| Step | Work | Expected |
|------|------|----------|
| Check the title | One pass over at most a few hundred characters | Well under 1 ms |
| Build the task | A new id and one time stamp | Well under 1 ms |
| Update the list in memory | Build a new array with the task at the front (100 items) | Well under 1 ms |
| Draw | React renders the new row and keeps the other 100 rows by their ids | A few ms |
| Save | Turn the list into text (about 20 KB) and store it | A few ms, after the draw (see below) |

These are design expectations, not measurements; NFR1.3 and NFR1.4 measure them.

## Design decisions

### D1. The list lives in memory; storage is read once (NFR1.5)

`useTasks` reads the saved list once, when the page opens, and keeps it in memory. The add works from that list. Nothing reads storage again during an add. The page does not re-read storage to check the add.

### D2. The save runs after the new row is drawn [Q1: A] (NFR1.1, NFR1.2)

Saving to the browser's storage is a synchronous step, so running it in the same step as the add would make the new row wait for it. The design separates them:

1. The add updates the list in memory and records that a save is due.
2. The page draws the new row.
3. After the draw, one step runs `save` with the list as it then is, and sets or clears the notice from the result.

The save is triggered by that "save is due" record, not by watching the list itself. A step that saved on every change of the list would also save after the first load and after a refresh from another tab, and could set off a loop of its own making; the record is raised only by an action of this Unit's.

Illustration (pseudocode):

```
add(rawTitle):
  result = titleRules.check(rawTitle)
  if not result.ok: return result
  setTasks([newTask(result.title), ...tasks])
  requestSave()            // only raises "a save is due"
  return { ok: true }

after each draw, if a save is due:
  clear "a save is due"
  outcome = TaskStorage.save(currentTasks)
  update notice from outcome (see the functional spec's notice state machine)
```

If two adds happen before the step runs, one save writes the latest list, which already holds both tasks; the save is never queued twice for the same list.

Consequence: a failed save shows its notice a moment after the row, not before it (workflow W4). Closing the page in that moment loses the last task, which the person is told about only if the page is still open; this is accepted and is the same as a failed save.

### D3. Rendering stays cheap (NFR1.1)

- Rows are keyed by task id, so adding one task draws one new row and leaves the others alone.
- `TaskList` and `TaskItem` take plain values and do no work of their own; there is no sorting (the list order is the saved order) and no filtering in this Unit.
- No animation is used for the add. The design file asks for animation under 300 ms and none at all when the person's system asks for reduced motion; add-task adds none.

### D4. One write per add, plus a one-time backup (NFR1.5)

`save` writes the whole list once per successful add. After unreadable saved data, the first `save` also writes one backup copy (functional rule BR1.13); that is the only extra write, and it happens once per damaged load.

### D5. How the targets are verified (NFR1.3, NFR1.4)

- **In the suite (NFR1.3):** a timing test renders the page with 100 saved tasks in the simulated browser (jsdom), adds a task, and fails if the add takes more than 100 ms of code time. It is a guard against the add becoming slow by accident; jsdom does not paint, so it is not the real measure.
- **By hand (NFR1.4):** at the first checkpoint, the add is timed with 100 tasks in Chrome using its performance recording. One browser is accepted for the timing; all four browsers are checked for behaviour, not timing, in Build and Test (NFR2.1).

### D6. Browser support (NFR2.1)

The project's build uses Vite's default targets for current desktop browsers. The Unit uses no feature newer than current Chrome, Edge, Firefox and Safari, and the one feature that can be missing (the built-in unique id maker on a page opened over plain http) has a fallback (functional rule BR1.9).

### D7. Tests are never weakened for speed (NFR7.3)

If the timing test fails, the code is made faster, not the limit raised, and the coverage floor is not lowered. This is the team's hard rule.

## Requirement coverage

| Requirement | Design |
|-------------|--------|
| NFR1.1 | D1, D2, D3, and the budget table |
| NFR1.2 | D2 (the save runs after the row is drawn) |
| NFR1.3 | D5 |
| NFR1.4 | D5 |
| NFR1.5 | D1, D4 |
| NFR2.1 | D6 |
| NFR7.3 | D7 |

## Assumptions & Open Questions

- [assumption] The estimates in the budget table are design expectations, not measurements; the timing test and the manual check decide.
- [assumption] The loss of the very last task if the page closes between the draw and the save is acceptable in phase 1; it cannot be avoided without a synchronous save, which [Q1] chose against.
- [assumption] The manual timing is done in Chrome only, because it has the most capable recording tool; the other three browsers are checked for behaviour.
- Open question: the previous review also asked that NFR1.2 be restated. This design meets the original wording by separating the save from the draw; whether to update the requirements document is the owner's decision.
