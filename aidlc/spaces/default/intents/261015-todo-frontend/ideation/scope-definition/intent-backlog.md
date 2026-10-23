# Intent Backlog: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Feasibility assessment and constraint register: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/feasibility/`
- Scope document: `scope-document.md` in this folder.
- Answers recorded in `scope-definition-questions.md` in this folder, cited as [Q1] to [Q6].

## Method

Prioritized with MoSCoW (the five chosen must-haves [Q1]), then ordered value first [Q4]. No scoring model such as WSJF or RICE is used: with one product and a 7-day target [Q3], a ranked list is enough.

## Backlog (in build order)

| Order | Item (proto-Unit) | Feature | Tier | Depends on | Why this position |
|-------|-------------------|---------|------|-----------|-------------------|
| 1 | Add a task | FR-1 | Must have | None | Nothing else has value until a task can be added. |
| 2 | Complete or reopen a task | FR-2 | Must have | 1 | The core purpose: tracking what is done. |
| 3 | Delete a task | FR-4 | Must have | 1 | Needed to keep the list clean; used as often as completing. |
| 4 | Edit a task title | FR-3 | Must have | 1 | Fixes mistakes; used less than delete. |
| 5 | Filter All, Active, Completed | FR-5 | Must have | 1, 2 | Useful once the list has completed and active tasks. |
| 6 | Tasks survive a reload | FR-6 | Required for success | 1 | Required for acceptance [Q6]; built last by the value-first order [Q4]. |
| 7 | Count of remaining active tasks | FR-7 | Required for success | 1, 2 | Required for acceptance [Q6]; built last [Q4]. |

## Won't have this time

- Due dates and reminders
- Tags or categories
- Drag-and-drop ordering
- User accounts and login
- Public launch and hosting
- Phone and tablet support

Source: intent statement, [Q2], [Q5].

## Dependencies

- Items 2 to 7 all need item 1, because a task must exist before it can be completed, deleted, edited, filtered, kept or counted.
- Items 5 and 7 also need item 2, because they act on the complete/incomplete state.
- The backend (phase 2) depends on all seven items being finished.

## Risks to the order

- Item 6 comes late, so builds before it lose tasks on reload (RAID R2). Acceptable while no one else uses the interim builds.
- If the 7-day target [Q3] is threatened, items 6 and 7 are the first to be at risk, yet they are required for success [Q6]; the schedule fails before the scope does. Any change here goes back to the product owner.

## Assumptions & Open Questions

- [assumption] The order of items 3 and 4 (delete before edit) is a product-agent proposal based on value-first, not chosen by the user.
- Open question: whether the backlog items become the Units in Inception, or are regrouped. Left for Units Generation.
