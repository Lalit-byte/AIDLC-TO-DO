# RAID Log: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Answers recorded in `feasibility-questions.md` in this folder, cited as [Q1] to [Q10].

## Risks

| ID | Risk | Likelihood | Impact | Mitigation | Source |
|----|------|-----------|--------|-----------|--------|
| R1 | The 1-week target slips because scope grows beyond FR-1 to FR-7. | Medium | Medium | Hold to the requirements and exclusions already approved; defer anything new to a later phase. | [Q6], [Q9] |
| R2 | Tasks stored only on one device can be lost if the person clears their browser data; people may expect them to be kept. | Medium | Low | State plainly in the interface and documentation that tasks live in this browser until phase 2 adds a backend. | [desc], intent statement |
| R3 | The under 100 ms response target is harder to meet if a person keeps a very long list. | Low | Low | Confirm the expected maximum list size in Requirements Analysis (hypothesis, not yet measured). | Intent statement |
| R4 | The intent names the general public, but the app is only run locally, so the real audience cannot use it yet. | Medium | Medium | Confirm in Scope Definition whether a public launch belongs to phase 1 or phase 2. | [Q3], intent statement |
| R5 | Privacy exposure grows once phase 2 stores tasks on a server. | Medium | Medium | Revisit privacy and regulation before phase 2 starts. | [Q5], [Q10] |

## Assumptions

| ID | Assumption | Status |
|----|-----------|--------|
| A1 | [assumption] The 1-week target covers phase 1 development only, not any hosting or public launch. | Not confirmed |
| A2 | [assumption] Desktop-only support is acceptable even though the audience is the general public. | Not confirmed |
| A3 | Phase 1 needs no cloud account or hosting. | Confirmed by [Q3], [Q4] |

## Issues

None. No blocker was reported [Q8].

## Dependencies

| ID | Dependency | Owner |
|----|-----------|-------|
| D1 | Phase 2 (backend) depends on phase 1 finishing and on the task data shape being kept stable between phases. | Project owner |
| D2 | No external teams, services or approvals are needed for phase 1 [Q8]. | n/a |

## Assumptions & Open Questions

None beyond those listed under Assumptions and in the risks above.
