# Functional Design Questions: storage-note (U8)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U8 storage-note, story US8.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirement FR8.1: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC8.1.1 and AC8.1.2: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Screens M1, M2 and M8 and the interaction spec; the question about where the line goes (Q5 of Refined Mockups): `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `refined-mockups-questions.md`
- Component catalogue (the line is shown by `App`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- The existing page code: `frontend/src/App.jsx`

Context: nothing about this Unit is open. The unit is one fixed line of text in the page frame (`App`), under the title: it is always visible, with an empty list and with tasks (FR8.1, AC8.1.1, AC8.1.2). Where it goes was decided with you in Refined Mockups (under the title, muted), and its words come from the requirement. No new state, action, storage or component is involved, so there are no questions to ask.

## No open questions

None. This file records the design basis for you to confirm before the artifacts are written.

## Assumptions & Open Questions

- [assumption] The exact words are "Your tasks are saved in this browser only." (screens M1, M2 and M8; FR8.1 allows "a line such as" this).
- [assumption] The line sits directly under the page title and above the message line and the add row, as in screens M1, M2 and M8, in the muted style (the muted color, at least 4.5 to 1 on the card).
- [assumption] The line is plain text in the page frame, not a live message, not a control, and not clickable; screen M9 does not draw it, but the interaction spec and FR8.1 say the line is on every screen, so it is shown there too.
- [assumption] The line does not depend on the list, the filter, any message or any state: it is always shown.
- [assumption] The line is a paragraph of fixed text, never markup.

## Consolidated Summary Confirmation

- The page always shows the line "Your tasks are saved in this browser only." directly under the title, in muted plain text, with an empty list and with tasks, and on every screen including when a message is showing.
- It is fixed text in the page frame: no new state, action, storage or component; it does not depend on the list, the filter or any message.

- Looks correct
- Request changes

[Answer]: Looks correct
