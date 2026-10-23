# Performance Requirements: add-task (U1), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Non-functional requirements NFR1, NFR2, NFR3, NFR7: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Functional design of this Unit (rules BR1.7, BR1.8): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Contracts C3 and C4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Answers recorded in `nfr-requirements-questions.md` in this folder, cited as [Q1] to [Q5].

Scope of this document: the speed and size targets for the add-task Unit (a person types a title, adds it, and sees it in the list; the list is saved in the browser). Every requirement carries the ID of the inception requirement it comes from, with a sub-number. Scalability, reliability and observability are not produced for this Unit (see the assumptions).

## Requirements

| ID | Requirement | Measure | Source |
|----|-------------|---------|--------|
| NFR1.1 | Adding a task shows the new task in the list in under 100 ms, for a list of up to 100 tasks. | Time from the add being submitted to the new row being on screen, measured in a real desktop browser with 100 tasks on the list. | NFR1, BR1.7 |
| NFR1.2 | The page does the add without waiting for the save: the save of the whole list must not delay what is shown. | The new row is on screen before the save result is known; a save that is made slow in a test does not delay the row. | NFR1, BR1.7 |
| NFR1.3 | The automated suite contains a timing test that adds a task to a list of 100 and fails if the add work takes longer than a generous code-time limit (100 ms of code time), checked in the simulated browser [Q1]. This is a regression guard, not a measure of real screen speed. | The test exists, runs in the full suite, and passes. | NFR1, [Q1] |
| NFR1.4 | The speed target is also checked once by hand in a real desktop browser at the first checkpoint, with 100 tasks, and the result is noted in the checkpoint [Q1]. | A recorded manual check of the add. | NFR1, [Q1] |
| NFR1.5 | Loading the page reads the saved list once, and the add does not read it again; the add works from the list already in memory and writes the whole list once per add. | One read at page open; one write per successful add. | NFR1, contract C3 and C4 |
| NFR2.1 | The Unit works in the current versions of Chrome, Edge, Firefox and Safari on a desktop. Phones, tablets and older browsers are not supported in phase 1. | The add and reload behaviours pass in each of the four browsers; checked in Build and Test. | NFR2 |
| NFR7.3 | The speed targets above are not met by weakening any test or any coverage floor. | The coverage report and the suite stay at their floors. | NFR7, team hard rule |

## Resource limits

- A saved list of 100 tasks with titles of up to 200 characters is about 20 KB of text, far inside the browser's storage allowance. No limit on the number of tasks is promised beyond 100 tasks for the 100 ms target (requirements assumption A4); beyond that the page keeps working with no speed promise.
- No loading state is needed: the saved list is read from the browser as the page opens (mockups, "Not designed").

## Assumptions & Open Questions

- [assumption] Scalability, reliability and observability documents are not produced for this Unit. The Unit is one person using one browser with no server; failures to read or save are already specified in the functional design (the two notices, the all-or-nothing save and the backup copy), and there is nothing to monitor.
- [assumption] "100 ms of code time" in the simulated browser is a loose guard chosen because a simulated browser cannot measure paint time; it is not the real target.
- [assumption] The four-browser check (NFR2.1) is done by hand in Build and Test; no browser test farm exists (no budget).
- Open question: whether the 100 ms target also covers the first page open with 100 saved tasks. Not asked; NFR1 names add, complete and delete only.
