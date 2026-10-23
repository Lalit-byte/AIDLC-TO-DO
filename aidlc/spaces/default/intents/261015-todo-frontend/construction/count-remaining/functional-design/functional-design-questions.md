# Functional Design Questions: count-remaining (U7)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U7 count-remaining, story US7.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR7.1 to FR7.3, FR9.1, NFR3, NFR4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC7.1.1 to AC7.1.4 (and the "0 items left" part of AC9.1.1 left to this Unit by empty-guidance): `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Screens M1, M2, M6, M8 and the Counter spec in the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Contracts C4 and C5 (`remaining`, `Counter { remaining }`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- The existing code: `frontend/src/hooks/useTasks.js` and `frontend/src/App.jsx`

Context: nothing about this Unit is open. The count line "N items left" shows the number of tasks that are not complete, whatever the filter, with the wording fixed by the requirements ("N items left", "1 item left", "0 items left"), the place fixed by the mockups (below the list, on the left of the summary line that will also hold the filter buttons), and the way it is read fixed by the interaction spec (announced politely when it changes). The hook returns `remaining` (contract C4) and the block `Counter` receives it (contract C5). No new state, action, storage or question is involved, so there are no questions to ask.

## No open questions

None. This file records the design basis for you to confirm before the artifacts are written.

## Assumptions & Open Questions

- [assumption] The count is worked out from every task in the list, so it does not depend on the filter (FR7.3); until the filter exists the list shown and the full list are the same, and the count already reads from the full list so the filter Unit does not change it.
- [assumption] The line is shown always, including with an empty list ("0 items left", screens M1 and M8) and beside any message; it is plain text in the summary line below the list (screens M1, M2, M6), at the left, with room on the right for the filter buttons that arrive in the filter Unit.
- [assumption] The count is announced politely to screen readers when it changes (a polite live region, not an alert); the first appearance on a page load is not announced as a change.
- [assumption] A count that another tab's refresh changes (keep-tasks) is updated the same way and announced like any other change.
- [assumption] The words are "N items left" for every N other than 1 (including 0) and "1 item left" for exactly one, with the number written as digits.

## Consolidated Summary Confirmation

- The page always shows "N items left" below the list, where N is the number of tasks that are not complete, in the wording "1 item left" for one and "N items left" for every other number including "0 items left", and it does not change when a filter is chosen.
- It updates after every add, tick, untick, delete and reload, and after another tab's change, and screen readers hear it politely when it changes. It is plain text with no control, in the summary line at the left; the filter buttons join it later in the filter unit.
- The number is worked out by the page's state hook from the full list (`remaining`) and handed to a small display block; no new state, storage or question is involved.

- Looks correct
- Request changes

[Answer]: Looks correct
