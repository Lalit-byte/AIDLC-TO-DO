# User Stories Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` (FR1 to FR9, NFR1 to NFR8).
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md` (general public).
- Scope document and intent backlog: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/` (build order, priority tiers).
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`.

This stage runs with the product manager alone (no extra specialists), so the plan below is for you to decide before the stories are written. Stories use the format "As a [persona], I want [goal], so that [benefit]", with Given/When/Then acceptance criteria.

Already answered earlier and not asked again: the seven features and their order, desktop only, delete asks first, messages and rules in the requirements.

## Q1. Who are the people the stories are written for?

The intent says "the general public", with no accounts and nothing shared, so everyone is the same kind of user. A second persona would only be worth adding if it changes what a story must say.

A. One persona: an everyday task keeper using a desktop browser
B. Two personas: the everyday task keeper, and a keyboard-only user who relies on the keyboard (or a screen reader) to use the page
C. Two personas: the everyday task keeper, and a returning visitor who comes back later to find their tasks
X. Other (please specify)

[Answer]: A

## Q2. How small should each story be?

Smaller stories are easier to build and test one at a time; fewer, larger ones are quicker to read. The backlog from Scope Definition already ranks seven items.

A. One story per requirement group, with several acceptance criteria each (about 9 stories, one per FR1 to FR9)
B. One story per distinct action a person takes, so a group can split into several (about 14 to 18 stories)
X. Other (please specify)

[Answer]: A

## Q3. What priority should each story carry?

Scope Definition made FR1 to FR5 must-haves and called FR6 (tasks survive a reload) and FR7 (remaining count) "required for success, built last", which is not a standard priority label. Stories need a standard one.

A. Must Have for every story in FR1 to FR9, because all seven features are required for success; the build order stays as in the backlog
B. Must Have for FR1 to FR5 stories, Should Have for FR6 and FR7 stories, with a note that both are still required for acceptance
X. Other (please specify)

[Answer]: A

## Q4. How should the stories be grouped?

A. By feature, in the build order of the intent backlog (add, complete, delete, edit, filter, keep, count)
B. By the person's journey: first visit, add and manage, narrow the list, come back later
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
