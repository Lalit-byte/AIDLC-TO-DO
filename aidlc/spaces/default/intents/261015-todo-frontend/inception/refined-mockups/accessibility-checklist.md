# Accessibility Checklist: Todo List Frontend (Phase 1, desktop)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Requirements NFR3 (keyboard, visible focus, names, status not by color alone, contrast): `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Feasibility accessibility answer (sensible defaults, no formal standard): `aidlc/spaces/default/intents/261015-todo-frontend/ideation/feasibility/constraint-register.md` (C-Q1)
- Mockups, interaction spec and design system mapping in this folder.
- Answers recorded in `refined-mockups-questions.md` in this folder, cited as [Q1] to [Q5].

The agreed level is sensible defaults, not a formal standard: labels, keyboard use and contrast. The checks below use the WCAG 2.1 AA wording as the yardstick, without it being a requirement. "Designed" means the mockups and interaction spec call for it; "To verify" means Build and Test confirms it in the finished app.

## Checklist

| ID | Check | Applies to | Designed | To verify in Build and Test |
|----|-------|-----------|----------|----------------------------|
| A1 | Every function works with the keyboard alone: add, tick, edit, delete, filter | US1.1 to US5.1 | Yes (interaction rules; each component) | Walk through each story with no mouse |
| A2 | Tab order follows reading order: input, Add, then each task's checkbox, Edit, Delete, then filters | All | Yes | Tab through a list of five tasks |
| A3 | Every focusable control shows a visible focus ring (2 px accent) | All | Yes (design system mapping) | Look at focus on every control |
| A4 | Every input and button has an accessible name; the checkbox's name is the task title | TaskForm, TaskItem | Yes (interaction spec) | Automated accessibility scan plus a screen reader pass |
| A5 | Text contrast is at least 4.5 to 1 on its background | All | Yes (contrast table; muted text only on white) | Run a contrast tool on every state |
| A6 | Status is not shown by color alone: completed tasks have a line through them; errors have a "(!)" mark; the chosen filter is bold with a border | US2.1, US5.1, US1.1, US6.1 | Yes | Check the app in grayscale |
| A7 | Messages are announced when they appear (empty title, title too long, could not be loaded or saved) | US1.1, US4.1, US6.1 | Yes | Screen reader pass |
| A8 | The delete dialog keeps focus inside it, starts on Cancel, closes on Esc and returns focus to the task's Delete button | US3.1 | Yes | Keyboard walk-through |
| A9 | The chosen filter is exposed as pressed | US5.1 | Yes | Automated scan plus screen reader pass |
| A10 | The count is announced politely when it changes | US7.1 | Yes | Screen reader pass |
| A11 | The page has one level-1 heading ("Todo List"); the dialog heading is level 2; the page language is declared | All | Yes | Automated scan |
| A12 | Animations are under 300 ms and are turned off when the system asks for reduced motion | All | Yes (interaction rules) | Turn on reduced motion and confirm |
| A13 | The page works when zoomed to 200 percent without sideways scrolling in a desktop window | All | Not specified in the requirements | Check; a failure is logged, not blocking |

A13 goes beyond the agreed "sensible defaults"; it is listed as a check, not as a requirement.

## Mapping to the requirement NFR3

| Part of NFR3 | Checks |
|--------------|--------|
| Every control reachable and usable by keyboard | A1, A2, A8 |
| Visible focus ring | A3 |
| Accessible name or label on every input | A4 |
| Status never by color alone | A6, A9 |
| Text contrast at least 4.5 to 1 | A5 |

This closes the gap the user-stories review raised (focus ring, accessible names and contrast had no criterion): the design now states each one, and the checks above give Build and Test something to verify. The user stories themselves have not been changed.

## Assumptions & Open Questions

- [assumption] "Sensible defaults" is read as the checks A1 to A12, using WCAG 2.1 AA wording as a yardstick. Not confirmed by the user.
- Open question: whether the user stories should gain acceptance criteria for the focus ring, names and contrast, now that the checks exist here. Left for the owner at the gate or in Units Generation.
