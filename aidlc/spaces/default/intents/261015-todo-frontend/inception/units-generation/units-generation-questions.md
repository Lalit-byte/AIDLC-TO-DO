# Units Generation Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Component catalogue and decisions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md` and `decisions.md` (nine blocks plus App; ADR-001 to ADR-006).
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- User stories US1.1 to US9.1 and their build order: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md` (several developers will join; build a thin end-to-end slice first; tests written after each piece; full tests run locally before every merge).
- Intent backlog (value-first order): `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/intent-backlog.md`

A unit is a piece of work that can be built and tested on its own, and that a developer can pick up. This stage only decides what the units are and what each depends on; the order they are built in is decided in the next stage but one (Delivery Planning).

Already decided and not asked again: the app is one frontend that is deployed as a single whole (no separate services), the blocks and who owns what (Domain Design), the thin first slice is adding a task and seeing it in the list.

## Q1. How should the work be split into units?

A. By feature, each unit a thin vertical slice that cuts through the screen, the state and the storage for one capability (add, complete, delete, edit, filter, and so on). Every unit can be run and tried on its own; the first unit is the thin end-to-end slice.
B. By layer: one unit for the storage service, one for the state hook, one for the screen blocks. Each layer can be built in parallel, but nothing can be run end to end until all three are done, so the thin first slice would not exist.
C. One unit for the whole app, built and reviewed in one go. Least overhead; no parallel work and no early check.
X. Other (please specify)

[Answer]: A

## Q2. How fine-grained should the units be?

There are nine user stories. Fewer, larger units mean fewer handovers; smaller ones mean each can be built in a day or two.

A. One unit per story (nine units), with the first one the thin slice for adding a task
B. Merge the small stories into their natural neighbours (about six units): for example the remaining-count line, the browser-only line and the empty-list message go together with the list and the filter they sit next to
X. Other (please specify)

[Answer]: A

## Q3. What should the first unit contain so it runs end to end?

The team agreed to build a thin end-to-end slice first: adding a task and seeing it in the list. The team also has a hard rule that only the storage service touches browser storage.

A. Add a task and see it in the list, with the storage service saving and loading the tasks in the browser (so a reload shows them), but without the failure messages, other-tab sync or the "saved in this browser only" line
B. Add a task and see it in the list, with the tasks held only in memory behind the storage service's interface, and real saving to the browser added in a later unit
X. Other (please specify)

[Answer]: A

## Q4. May units that do not depend on each other be built at the same time?

Several developers will join (team practices). After the first unit exists, most of the rest only depend on it, so they could be built in parallel.

A. Yes; record which units are independent so two developers can work on them at the same time
B. No; build one unit at a time in a single line, even where the dependencies would allow parallel work
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
