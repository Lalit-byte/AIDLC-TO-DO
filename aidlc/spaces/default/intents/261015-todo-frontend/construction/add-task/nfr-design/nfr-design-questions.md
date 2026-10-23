# NFR Design Questions: add-task (U1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- NFR requirements of this Unit: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/performance-requirements.md`, `security-requirements.md`, `tech-stack-decisions.md`
- Functional design of this Unit (workflows W2 and W4, rules BR1.7, BR1.10 to BR1.16): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Contracts C3 and C4: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Team practices (storage only in `src/services/`, Prettier and ESLint must pass): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`

Context: a single page with no server needs almost no resilience, scaling or monitoring design; those documents are not produced for this Unit. Two design choices are still open, and one of them follows from a finding in the previous review: the requirement NFR1.2 says the new row must be on screen "before the save result is known", but saving to the browser's storage is a synchronous step, so a slow save would delay the row if it runs in the same step as the add.

## Question 1: When does the save run relative to showing the new row?

A. Right after the page has shown the new row: the add updates the list on screen, and the save runs once the page has drawn it (for example in a hook step that runs after the draw). The row never waits for the save; a failed save then shows the notice a moment later.
B. In the same step as the add, before the page draws. The simplest code; a save of about 20 KB of text is far below 100 ms in a browser, so the 100 ms target is met, but the row does wait for the save, and NFR1.2 would be reworded to say so.
X. Other (please specify)

[Answer]: A

## Question 2: How are the "no storage or network outside `src/services/`" and "no raw HTML" rules enforced?

Requirements NFR5.2 and NFR4.1 can be enforced by a tool or only by reading the code.

A. ESLint rules that fail the check: browser storage and network calls (`localStorage`, `sessionStorage`, `fetch`, `XMLHttpRequest`, `WebSocket`) are forbidden outside `src/services/`, and inserting raw HTML (`dangerouslySetInnerHTML`) is forbidden everywhere. The rules run with the normal lint check, so they cannot be forgotten.
B. No special rules; the rule is checked by reading the code at each checkpoint.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] Resilience, scalability and observability designs are not produced for this Unit: there is no server, no dependency to call, and no one to alert; failures to read or save are already designed in the functional design (the notices, the all-or-nothing save and the backup).
- [assumption] There is no encryption design: tasks are stored as plain text in the person's own browser, as the product promise says, and the data is not sensitive by requirement.
- [assumption] No caching design is needed: the list is held in memory after the one read at page open.

## Consolidated Summary Confirmation

- The add updates the list on screen first; the save runs after the page has drawn the new row, so the row never waits for the save (Q1: A). This replaces the wording of requirement NFR1.2 with a design that can meet it.
- ESLint rules forbid browser storage and network calls outside `src/services/` and forbid raw HTML insertion everywhere; they run with the normal lint check (Q2: A).

- Looks correct
- Request changes

[Answer]: Looks correct
