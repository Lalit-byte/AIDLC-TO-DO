# Scope Document: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Feasibility assessment and constraint register: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/feasibility/`
- Answers recorded in `scope-definition-questions.md` in this folder, cited as [Q1] to [Q6].
- Feature list FR-1 to FR-7: `docs/PRD.md`.

## Scope statement

Phase 1 delivers a working todo list in the browser for the general public, run locally, in 7 calendar days and with no spend [Q3]. The backend is phase 2 and is not part of this scope.

## In scope

| Feature | What a person can do | Priority tier | Source |
|---------|---------------------|---------------|--------|
| FR-1 | Add a task with a title of 1 to 200 characters | Must have | [Q1] |
| FR-2 | Mark a task complete or incomplete | Must have | [Q1] |
| FR-3 | Edit a task title | Must have | [Q1] |
| FR-4 | Delete a task | Must have | [Q1] |
| FR-5 | Filter the list by All, Active or Completed | Must have | [Q1] |
| FR-6 | Tasks are still there after the page is reloaded | Required for success, built last | [Q1], [Q6] |
| FR-7 | See the count of remaining active tasks | Required for success, built last | [Q1], [Q6] |

FR-6 and FR-7 were not chosen as must-haves [Q1], but the success measure agreed in Intent Capture requires all seven features to pass, and the user confirmed that this still applies [Q6]. They are therefore required for phase 1 acceptance and built after the five must-haves.

## Out of scope

| Item | Reason | Source |
|------|--------|--------|
| Due dates and reminders | Left out of the first version | Intent statement |
| Tags or categories | Left out of the first version | Intent statement |
| Drag-and-drop ordering | Left out of the first version | Intent statement |
| User accounts and login | No accounts in phase 1; each browser keeps its own tasks | Intent statement |
| Public launch and hosting | Phase 1 is run locally; any launch comes with or after phase 2 | [Q2] |
| Phone and tablet support | Desktop browsers only for phase 1; mobile may come later | [Q5] |
| The backend | Phase 2 | [desc] |

## Success definition

- All seven features (FR-1 to FR-7) pass their pass/fail checks [Q6]; intent statement.
- Adding, toggling and deleting a task respond in under 100 ms; intent statement.
- Phase 1 is finished within 7 calendar days [Q3].

## Value stream

Person decides to note a task, then adds it (FR-1), sees it in the list, completes it when done (FR-2), corrects or removes it when plans change (FR-3, FR-4), narrows the list to what matters (FR-5), and trusts that it is still there next time and knows how much is left (FR-6, FR-7). Value reaches the person at the first step, so the build follows this order [Q4].

## Sequencing

Value first [Q4]: the features people use most come first. The detailed order is in `intent-backlog.md`.

## Constraints carried forward

- Desktop browsers only, local run, no cloud accounts, no budget [Q5], [Q2]; constraint register C-T3, C-T4, C-O2.
- Privacy is recorded as a low risk and revisited when phase 2 stores data on a server; constraint register C-R1.

## Assumptions & Open Questions

- [assumption] The order of FR-3 (edit) and FR-4 (delete) within the value-first sequence is a product-agent proposal, not chosen by the user.
- [assumption] "Required for success, built last" for FR-6 and FR-7 is not a standard priority tier; it records that they are needed for acceptance but sequenced after the must-haves [Q6].
- Open question: with FR-6 built last, a person could lose tasks on reload during the interim builds (risk R2 in the RAID log). Accepted for now as a consequence of the value-first order [Q4]; revisit in Delivery Planning.
