# Team Allocation: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Bolt sequence: `bolt-plan.md` in this folder.
- Team practices (several developers will join; trunk-based, squash-merge): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Unit dependencies and shared files: `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work-dependency.md`
- Answers recorded in `delivery-planning-questions.md` in this folder, cited as [Q1] to [Q6].

## Who builds what

Team Formation was not run for this plan (it is not part of the `mvp` workflow), so no named people or teams exist. Every Bolt (a build pass over one or more Units of Work, ending in something that runs) is built by the developer agent (AI), with you approving at each checkpoint.

| Bolt | Unit(s) | Builder | Reviewer |
|------|---------|---------|----------|
| B1 | U1 add-task | developer agent (AI) | you, at the walking-skeleton checkpoint |
| B2 | U2 complete-task | developer agent (AI) | you, at the Unit checkpoint |
| B3 | U3 delete-task | developer agent (AI) | you, at the Unit checkpoint |
| B4 | U4 edit-task | developer agent (AI) | you, at the Unit checkpoint |
| B5 | U6 keep-tasks | developer agent (AI) | you, at the Unit checkpoint |
| B6 | U5 filter-tasks | developer agent (AI) | you, at the Unit checkpoint |
| B7 | U7 count-remaining | developer agent (AI) | you, at the Unit checkpoint |
| B8 | U8 and U9 | developer agent (AI) | you, at the Unit checkpoint |

There is one team, so there is no cross-team Program Board (the planning board that lines up several teams' Bolts); this table is the whole board.

## How the work is run

- One Bolt after another [Q3: A]. No two Bolts are built at the same time, so the shared-file clashes listed in `unit-of-work-dependency.md` (`App`, `UseTasks`, `TaskItem`, `TaskStorage`, `TaskList`) cannot happen between Bolts.
- Each Bolt is one short-lived branch squash-merged into `main` as one commit named by the Bolt slug, with the full test suite run locally before the merge (the team practice, since no build server exists).
- `docs/ARCHITECTURE.md` asks that the files a task will touch are listed in `TASKS.md` before editing; the builder does this at the start of each Bolt.

## If developers join

The team practices say several developers will join. Nothing in this plan assigns them. If a person takes a Bolt, the only safe parallel pair is B8's two Units (U8 and U9), because they touch different files; every other pair shares files. Moving to team-owned Construction is a separate choice made in the staffing step at the end of this stage.

## Assumptions & Open Questions

- [assumption] The developer agent is the builder for every Bolt, because no team was formed.
- [assumption] You review each Unit at its checkpoint; whether that is automatic or asked each time is chosen separately when Construction starts.
- Open question: when and how the other developers join. Not needed to start Construction.
