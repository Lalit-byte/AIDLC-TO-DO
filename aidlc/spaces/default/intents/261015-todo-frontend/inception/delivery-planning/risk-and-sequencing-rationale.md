# Risk and Sequencing Rationale: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Bolt plan: `bolt-plan.md` in this folder.
- Unit dependency graph and shared files: `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work-dependency.md`
- Units and sizes: `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Risks (R1 to R5) and constraints: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/feasibility/`
- Contract open questions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `delivery-planning-questions.md` in this folder, cited as [Q1] to [Q6].

## Method chosen

A mixed method, as you chose [Q1: D]. No numeric scoring model (WSJF, which ranks work by value plus urgency plus risk reduction, divided by size) was asked for or applied; the order is argued, not scored. It combines three heuristics:

- **Walking skeleton first** (Cockburn): B1 (U1) is the thin end-to-end slice. It is first because the team practices say so and because it is the only Unit with no dependencies.
- **Value first for the core actions**: B2 to B4 (complete, delete, edit) are what a person uses most after adding a task, so they come next.
- **Risk first for the hardest Unit, after the core**: B5 (U6 keep-tasks) is the largest unusual-case logic, so it is built before the small display Units, not last.
- The display Units (filter, count, the storage line, the empty message) come last because they are small, low in risk, and read values the earlier Bolts already produce.

## Why this order

| Position | Bolt | Reason |
|----------|------|--------|
| 1 | B1 add-task | Skeleton. Everything else edits files it creates. Largest Unit with the project setup, so it also surfaces setup problems on day one. |
| 2 | B2 complete-task | Smallest core action. Proves the update path that edit (B4) reuses, and filter (B6) and count (B7) need complete state to be meaningful. |
| 3 | B3 delete-task | Core action; proves the dialog and focus pattern. Independent of B2 and B4. |
| 4 | B4 edit-task | Core action; reuses the title rules and the update path. |
| 5 | B5 keep-tasks | Highest uncertainty. Built after the core actions so the failure handling covers every action that saves (add, tick, delete, edit), since it applies to every change. |
| 6 | B6 filter-tasks | Needs add and complete. Small. |
| 7 | B7 count-remaining | Needs add and complete. Small. Placed after B5 so the count is checked against a list that can also be replaced by another tab. |
| 8 | B8 storage-note, empty-guidance | Fixed line and one message. Lowest risk. |

## Deviations from number order

Number order would be U1, U2, U3, U4, U5, U6, U7, U8, U9. The only difference is that U6 (B5) comes before U5 and U7 (B6, B7). The dependency graph allows this: U6 depends only on U1, and U5 and U7 do not depend on U6. It is justified by risk: the least certain Unit is not left behind the two small ones when the 7-day limit is tight. There is no violation of the dependency graph; every Bolt comes after the Bolts it depends on.

## Risks

| Risk | Likelihood | Impact | Mitigation | Where in the sequence |
|------|-----------|--------|------------|-----------------------|
| The 7-calendar-day limit is missed (named as your biggest worry [Q6: C]) | Medium | High | Smallest steps and one Bolt per Unit [Q2]; the full suite and checks run per Bolt so there is no late integration; the Units with the most risk (B1, B5) are placed early; if the limit tightens, the display Units in B6 to B8 are the cheapest to build and the first candidates to be re-planned with you | B1 to B8 |
| U6 keep-tasks is harder than expected (failed saves, damaged data, two-tab sync) | Medium | High | Settle its two open decisions before U1 is coded [Q4: C]; build it fifth so the core actions already exist; each failure case has a simulated-failure test | B5, decisions before B1 |
| Open contract questions change U1's first save (whether a save may overwrite damaged data) | Medium | Medium | The decision is taken in Functional Design before any code, so B1 is built to the final rule | Before B1 |
| The same files are edited by several Units, so changes clash | High if parallel, Low if serial | Medium | One Bolt after another [Q3: A]; the files a Bolt touches are listed in `TASKS.md` before editing | Whole sequence |
| B1 is the largest Bolt and creates the project files, so it can overrun | Medium | Medium | The skeleton is verified with a real project check before later Bolts; if B1 is slow, nothing else can start, so it gets the first full attention | B1 |
| Contract changes (task shape, saved data, function inputs) break a later Bolt | Low | Medium | The contract rules in `contract-summary.md` require your approval for breaking changes and a note in `TASKS.md` and `MEMORY.md` | All |
| Nothing is deployed, so a hosting problem would appear only in phase 2 | Low | Low | A local production build check is part of done [Q5: B] | After B8 |

## Assumptions & Open Questions

- [assumption] The risks above are the main ones; likelihood and impact ratings are the delivery lead's judgment, not measured.
- Open question: whether to re-plan the display Units if the 7-day limit tightens. Decided with you at the time; not decided here.
