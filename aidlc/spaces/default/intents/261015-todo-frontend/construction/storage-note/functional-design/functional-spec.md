# Functional Specification: storage-note (U8), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U8 storage-note, story US8.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirement FR8.1, NFR3, NFR4, NFR5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC8.1.1 and AC8.1.2: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Component catalogue (`App` shows the line, holds no business rules): `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Screens M1, M2 and M8 and the interaction spec; Q5 of Refined Mockups (where the line goes): `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md`, `interaction-spec.md` and `refined-mockups-questions.md`
- The page code this builds on: `frontend/src/App.jsx`
- Design basis recorded in `functional-design-questions.md` in this folder (no open questions; confirmed by the person).

## Purpose and scope

storage-note tells a person, on every visit, where their tasks live: in their own browser only. This addresses the risk that tasks seem to vanish when browser data is cleared or another browser is used. This document is the source of truth for the line's behaviour and rules. It is design only: no code.

In this unit: one fixed line of text in the page frame (`App`), under the page title. No new state, action, storage function, hook change or component is needed, and the other blocks are not touched.

Not in this unit: the empty-list hint (U9), the load and save messages (U6), the count (U7).

## Workflows

### W1. The page is shown

1. `App` renders the page frame: the title, then the line "Your tasks are saved in this browser only.", then the message line (if any), the add row, the list and the other blocks (BR8.1 to BR8.4).
2. The line is there whatever else is on the page: an empty list, a list of tasks, a message, an edit or a delete dialog (BR8.3).

There is no other workflow: the line is not a control and nothing a person does changes it.

## State held

None. The line is fixed text and depends on nothing.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR8.1 | policy | When the list is empty, the page shows the line "Your tasks are saved in this browser only." under the title. | FR8.1, AC8.1.1 |
| BR8.2 | policy | When the list has tasks, the page shows the same line, in the same place. | FR8.1, AC8.1.2 |
| BR8.3 | constraint | The line is always shown: it does not depend on the list, the filter, any message, an edit in progress or the delete dialog, and it is also shown when a load or save message is showing (screen M9 does not draw it, but FR8.1 says always). | FR8.1, interaction spec |
| BR8.4 | policy | The line sits directly under the page title and above the message line and the add row, as plain muted text (the muted color, at least 4.5 to 1 on the card). It is a paragraph of fixed text, not a control, not clickable and not announced as a live message; it is never markup. | screens M1, M2 and M8, NFR3, NFR4 |
| BR8.5 | constraint | The line adds no state, no storage or network use and no new component; it is written in the page frame (`App`), which holds no business rules. | catalogue, NFR5, team hard rule |

## Rules summary (derived)

BR8.1 and BR8.2 are the two acceptance criteria; BR8.3 says it never goes away; BR8.4 says where it is and how it looks and is read; BR8.5 keeps it free of state and storage.

## Corners swept

| Corner | Settled how |
|--------|-------------|
| Empty list, first visit | BR8.1 |
| List with tasks | BR8.2 |
| A load or save message is showing | BR8.3: the line is still shown, above the message |
| Editing a task, or the delete dialog open | BR8.3: the line stays; the dialog dims the page behind it as it does everything else |
| Filter chosen | BR8.3: unaffected |
| Screen reader | BR8.4: ordinary text, read as the page is moved through; not a live message |
| Contrast | BR8.4 |
| Keyboard | Nothing to reach |
| Another browser or device | The line is the same text; what it says is the reason tasks are not shared (FR6.5) |

## Changes to earlier documents

None. This Unit follows the catalogue (`App` shows the browser-only line) and the mockups as written.

## Assumptions & Open Questions

- [assumption] The exact words are "Your tasks are saved in this browser only." (screens M1, M2 and M8; FR8.1 allows "a line such as" this).
- [assumption] The line is a paragraph element placed after the page title and before the message line in the page frame.
- Open question: none.
