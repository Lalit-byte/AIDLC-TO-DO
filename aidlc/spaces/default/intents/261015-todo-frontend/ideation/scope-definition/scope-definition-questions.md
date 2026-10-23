# Scope Definition Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md` (general public, FR-1 to FR-7 in `docs/PRD.md`, under 100 ms, due dates/tags/drag-and-drop left out, no accounts in phase 1).
- Feasibility assessment, constraint register and RAID log in `aidlc/spaces/default/intents/261015-todo-frontend/ideation/feasibility/` (1-week target with no spend, desktop browsers only, local run, three unconfirmed assumptions).

Already answered earlier and not asked again: what is left out of the first version (Intent Capture), the 1-week target and no budget (Feasibility), no accounts in phase 1.

## Q1. Which of the seven phase 1 features are must-haves for the first version? (select all that apply)

Must-haves are what the app cannot ship without; the rest are built only if time allows within the 1-week target. The seven features are the ones listed in `docs/PRD.md`:

A. Add a task with a title, 1 to 200 characters (FR-1)
B. Mark a task complete or incomplete (FR-2)
C. Edit a task title (FR-3)
D. Delete a task (FR-4)
E. Filter the list by All, Active or Completed (FR-5)
F. Tasks survive a page reload (FR-6)
G. Show the count of remaining active tasks (FR-7)
X. Other (please specify)

[Answer]: A, B, C, D, E

## Q2. Does a public launch (the app reachable by the general public) belong to phase 1?

Feasibility found a gap: the audience is the general public, but phase 1 is only run locally. This decides whether launch work counts inside the 1-week target (risk R4 and assumption A1 in the RAID log).

A. No; phase 1 is the working frontend run locally, and any public launch comes with or after phase 2
B. Yes; phase 1 should be reachable by the public, using free hosting
C. Not decided yet
X. Other (please specify)

[Answer]: A

## Q3. Is the "within 1 week" target in calendar days or working days?

Feasibility left this open. It changes how much build time phase 1 really has.

A. 7 calendar days, including weekends
B. 5 working days
C. About 1 week of part-time effort (please give hours per day in Other)
X. Other (please specify)

[Answer]: A

## Q4. Which order should the work be built in?

Sequencing decides what the first working version shows soonest.

A. Value first: the features people use most go first (add, complete, delete)
B. Risk first: the parts most likely to go wrong go first (saving tasks across reloads and speed)
C. Dependency first: the foundation others rely on goes first
D. No preference
X. Other (please specify)

[Answer]: A

## Q5. Is desktop-only support acceptable for the first version, even though the audience is the general public?

The feasibility assessment recorded this as an unconfirmed assumption (A2), because the general public also uses phones.

A. Yes; desktop browsers only for phase 1, mobile may come later
B. No; the app must also work on phones in phase 1
C. Phone layout is nice to have, but not required for approval
X. Other (please specify)

[Answer]: A

## Q6. Follow-up on Q1 (must-haves): tasks surviving a reload (FR-6) and the remaining-tasks count (FR-7) were not chosen as must-haves, but the success measure agreed in Intent Capture says all seven features (FR-1 to FR-7) must pass. Which should apply?

These two answers conflict: if FR-6 and FR-7 are not must-haves, the success measure cannot require them. Without FR-6 a person's tasks vanish whenever the page reloads, which is risk R2 in the RAID log.

A. All seven features are still required for success; FR-6 and FR-7 are simply built last
B. Only the five chosen must-haves (FR-1 to FR-5) are required; FR-6 and FR-7 are optional and the success measure is narrowed to match
C. Add FR-6 (tasks survive a reload) to the must-haves, keep FR-7 optional, and narrow the success measure to FR-1 to FR-6
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
