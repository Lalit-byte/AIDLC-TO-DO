# Security Requirements: add-task (U1), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Non-functional requirements NFR3 to NFR8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Functional design of this Unit (rules BR1.5, BR1.9 to BR1.15): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Contracts C1 to C3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Team practices and hard rules (storage only in `src/services/`, validate input at the boundary, handle errors, pass Prettier and ESLint, never weaken a test): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `nfr-requirements-questions.md` in this folder, cited as [Q1] to [Q5].

Scope of this document: how the add-task Unit protects the person's tasks and the page. There are no accounts, no server and no secrets in phase 1 (requirement constraints), so the model is small: text typed into the page, saved in the person's own browser, never sent anywhere.

## Threat considerations

| Threat | Why it applies | Control |
|--------|----------------|---------|
| Typed text run as page code (script or markup in a title) | A title is free text shown back on the page | NFR4.1: titles are shown as plain text, never as markup |
| Task data leaving the browser | The product promise is browser-only (intent statement) | NFR5.1, NFR5.2 |
| A corrupted or hand-edited saved list breaking the page or the next save | Saved data lives in the browser where the person or another script can change it | NFR6.1, NFR8.1, NFR8.2: saved data is checked on load; a list that fails the check is treated as unreadable and kept as a backup |
| Another script on the same page address reading the tasks | Browser storage is shared by every script on one address | Accepted risk: phase 1 pages load only the app's own code and its packages; the vulnerability report below is the check |
| Vulnerable installed packages | The page is built from public packages | NFR5.3 |
| Losing the person's data by overwriting | A save can replace damaged data | NFR8.2: nothing is overwritten without a copy |

## Requirements

| ID | Requirement | Measure | Source |
|----|-------------|---------|--------|
| NFR3.1 | Every control of this Unit (the add input and the Add button) can be reached and used with the keyboard alone, with a visible focus ring. | A test that adds a task using only the keyboard; a manual keyboard run at the first checkpoint [Q4]. | NFR3 |
| NFR3.2 | The add input has a visible label or an accessible name ("Task title"); the placeholder is not the only label; the refusal message is linked to the input and announced when it appears. | An automated accessibility check (axe) on the add row and on the refused state reports no missing-name failures [Q4]. | NFR3 |
| NFR3.3 | Messages never rely on color alone (a "(!)" mark is shown as well), and text contrast is at least 4.5 to 1. | The same automated check reports no contrast failures where contrast can be computed, and the design file's colors are used as written. | NFR3 |
| NFR3.4 | The automated accessibility check is part of the component tests and runs in the full suite. | The test exists and passes. | NFR3, [Q4] |
| NFR4.1 | A title is shown as plain text. A title such as `<b>x</b>` is displayed as those characters and never run as markup; no code in this Unit inserts typed text as HTML. | A test adds `<b>x</b>` and finds the literal characters and no bold element; a lint rule forbids inserting raw HTML. | NFR4, BR1.5 |
| NFR5.1 | The Unit sends no task data anywhere outside the browser: no network request is made by the app's own code for any action of this Unit. | A test or a browser network view shows no request carrying task data while adding and reloading. | NFR5 |
| NFR5.2 | All browser storage and network access is inside `src/services/`; components and the hook never touch it. | A lint rule or a search check finds no storage or network use outside `src/services/`; the title rules file in that folder only computes. | NFR5, BR1.15, team hard rule |
| NFR5.3 | Before each merge the package manager's known-vulnerability report is run and read; it does not block the merge [Q5]. Findings are noted in the checkpoint. | The report was run for each Bolt merge; findings are listed in the checkpoint note. | NFR5, [Q5] |
| NFR6.1 | A saved task has exactly the five agreed fields (`id`, `title`, `completed`, `createdAt`, `updatedAt`), and a loaded list is accepted only if every task has them with the right kinds and a title that passes the title rules. | Saving a task with a missing, extra or wrongly typed field is refused with `invalid-task`; loading data with such a task is `unreadable`. | NFR6, BR1.10, BR1.11 |
| NFR8.1 | A save writes the whole list completely or not at all. | A simulated failure during the write leaves the previously saved list readable. | NFR8, BR1.10 |
| NFR8.2 | Saved data that could not be read is never overwritten without a copy: it is copied to a backup name first, no backup is ever overwritten, and if the copy fails nothing else is written. | Tests: unreadable data followed by an add leaves a backup holding the exact original text; a failed copy leaves the original untouched; two backups in the same millisecond both survive. | NFR8, BR1.13 |
| NFR7.1 | Tests cover at least 80% of lines of this Unit's code, with the happy path and at least two edge or error cases for each new component, hook and service function, and the full suite passes before each merge. | A coverage report of 80% or more and a passing suite. | NFR7, team practices |
| NFR7.2 | Tests are written layer by layer in the team's order (title rules and storage service, then the hook, then the components); each layer's tests are written and run before the next layer. | The Code Generation plan lists the layers in that order. | NFR7, team practices |

## Compliance and data

- No personal data is collected by the product: a task title is whatever the person types, kept only in their own browser. No accounts, no consent screen, no retention rules apply in phase 1.
- Titles and backups are not shown, logged or sent anywhere other than the page the person is looking at.

## Assumptions & Open Questions

- [assumption] Other scripts on the same address are not a threat in phase 1, because the app loads only its own code and installed packages. If a later phase adds third-party scripts, this needs revisiting.
- [assumption] No content security policy is set in phase 1, because nothing is hosted; the question returns with hosting in phase 2.
- [assumption] The vulnerability report does not block the merge [Q5]; if a high-severity finding appears, it is raised at the checkpoint for you to decide.
- Open question: the accessibility check cannot compute contrast in a simulated browser for every color pair; whether a manual contrast check in a real browser is also needed for the add row. Left for Build and Test.
