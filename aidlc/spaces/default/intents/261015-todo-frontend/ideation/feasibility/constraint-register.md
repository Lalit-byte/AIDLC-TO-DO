# Constraint Register: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Answers recorded in `feasibility-questions.md` in this folder, cited as [Q1] to [Q10].

## Technical constraints

| ID | Constraint | Source |
|----|-----------|--------|
| C-T1 | Phase 1 is a frontend only; it must work without any server, with the backend arriving in phase 2. | [desc] |
| C-T2 | The frontend is built in basic React. | [desc] |
| C-T3 | Support current desktop browsers only; mobile and older browsers are out of phase 1. | [Q2] |
| C-T4 | No cloud services are used in phase 1; the app runs locally. | [Q3], [Q4] |
| C-T5 | Add, toggle and delete respond in under 100 ms. | Intent statement (success metrics) |

## Organizational constraints

| ID | Constraint | Source |
|----|-----------|--------|
| C-O1 | Target finish within 1 week of starting phase 1. | [Q6], [Q9] |
| C-O2 | No budget; no paid services or tools. | [Q6] |
| C-O3 | Each browser keeps its own tasks; no user accounts or login in phase 1. | Intent statement (scope signal) |
| C-O4 | Left out of the first version: due dates and reminders, tags or categories, drag-and-drop ordering. | Intent statement (scope signal) |
| C-O5 | The people building it are comfortable with React, so no learning time is budgeted. | [Q1] |

## Regulatory and quality constraints

| ID | Constraint | Source |
|----|-----------|--------|
| C-R1 | No regulatory requirement is identified for phase 1. Privacy is recorded as a low risk and revisited in phase 2. | [Q5], [Q10] |
| C-Q1 | Accessibility follows sensible defaults (labels, keyboard use, contrast); no formal standard such as WCAG is required. | [Q7] |

## Assumptions & Open Questions

- [assumption] No project-wide quality target beyond the intent's success metrics (FR-1 to FR-7 passing, under 100 ms) applies. Not confirmed by the user.
- Open question: is a "1 week" target measured in calendar days or working days? Left for Scope Definition.
