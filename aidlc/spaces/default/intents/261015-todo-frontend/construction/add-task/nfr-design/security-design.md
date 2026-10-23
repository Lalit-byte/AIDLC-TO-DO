# Security Design: add-task (U1), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Security requirements NFR3.1 to NFR3.4, NFR4.1, NFR5.1 to NFR5.3, NFR6.1, NFR7.1, NFR7.2, NFR8.1, NFR8.2: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/security-requirements.md`
- Tech stack decisions: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/tech-stack-decisions.md`
- Functional design (rules BR1.5, BR1.9 to BR1.16, workflows W2 to W5): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- Contracts C1 to C3: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Team practices and hard rules: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `nfr-design-questions.md` in this folder, cited as [Q1] and [Q2].

Scope of this document: the controls that make the security and quality requirements true for the add-task Unit. There is no sign-in, no server, no secrets and no encryption in phase 1; the design is about plain-text display, keeping data in the browser, checking saved data, never overwriting without a copy, and keyboard and screen-reader use.

## Controls

### C-1. Titles are shown as plain text (NFR4.1)

- The title is passed to React as a text child, never as HTML. React escapes it, so `<b>x</b>` is displayed as those characters.
- ESLint forbids inserting raw HTML [Q2: A]: the React rule against `dangerouslySetInnerHTML`, plus a restriction on the properties `innerHTML`, `outerHTML` and `insertAdjacentHTML`. These rules apply everywhere, including `src/services/`.
- A test adds `<b>x</b>` and checks the literal characters appear and no bold element exists.

### C-2. Storage and network stay in `src/services/` (NFR5.1, NFR5.2)

- ESLint rules [Q2: A] forbid the names `localStorage`, `sessionStorage`, `fetch`, `XMLHttpRequest`, `WebSocket` and `navigator.sendBeacon` in every file except under `src/services/`. The rule configuration has one override that allows them in that folder only.
- The title rules file in that folder (`titleRules`) computes only; a lint override for it forbids all of those names too.
- A test replaces the network call with a spy, adds a task, reloads the page, and checks the spy was never called (NFR5.1).
- Limit of the control: a lint rule cannot catch every way of reaching storage (for example through an aliased `window`). Reading the code at each checkpoint is the backstop and is listed in the checkpoint note.

### C-3. Packages are checked before each merge (NFR5.3)

- `npm audit` is run before each Bolt's merge and its report is read [Q5 of the requirements]. It does not block the merge. Findings go into the checkpoint note; a high-severity finding is raised with you.
- The app has no third-party scripts, fonts or styles loaded from the network. The lock file fixes versions.

### C-4. Saved data is checked on load and on save (NFR6.1)

One shape check, kept inside `TaskStorage` and used by both `load` and `save`:

- The saved text is read as the saved format (a version and a list of tasks). `version` must be 1.
- Every task must have exactly the keys `id`, `title`, `completed`, `createdAt`, `updatedAt`, with `id` a non-empty text, `title` a text that passes the title rules and is already trimmed, `completed` a true-or-false value, and both times text that reads as a valid ISO 8601 time.
- A title with leading or trailing spaces in saved data is treated as not passing, so the list is unreadable and the damaged-data path (C-6) applies. This settles the question the earlier review left open: the saved title must already be trimmed.
- `load` returns `unreadable` for anything that fails; `save` returns `invalid-task` for any task that fails.
- Unknown extra fields make a task fail the check in this Unit (extra fields are U6's open question).

### C-5. A save is all or nothing (NFR8.1)

- The whole list, with its version, is turned into one text value first. Only if that succeeds is it stored, under one name (`todo-app.tasks`), in one storage call. The browser stores a value completely or not at all, so a failed call leaves the previous value unchanged.
- Storage errors are mapped to the contract's reasons: a quota error to `full`, a refused-access error to `blocked`, anything else to `failed`. None is caught silently: each becomes a result the hook turns into the save-failed notice.

### C-6. Damaged data is never overwritten without a copy (NFR8.2)

When `load` returns `unreadable`, `TaskStorage` keeps the exact text it read. At the next `save`:

1. If a copy is already made for this text, skip to step 4.
2. Choose a backup name `todo-app.tasks.damaged.` plus the time in milliseconds; if that name already exists, add `-1`, `-2` and so on until a free name is found. A name is only ever written when it is free, so no backup is overwritten.
3. Store the text under that name. If this fails, return `{ ok: false, reason }` with the reason of the failure, write nothing else, and leave the original untouched. If it succeeds, remember that the copy is done.
4. Write the new list (C-5). If it fails after the copy, return the failure and keep the copy marked as done, so the next `save` does not copy again.
5. When the new list is written, forget the unreadable text.

A `blocked` load keeps no text, so no copy is made.

### C-7. Keyboard, labels, messages and contrast (NFR3.1 to NFR3.4)

- The add input has a real `label` element ("Task title"); the placeholder is extra. The Add button is a native button. The add row is a form, so Enter and the button take the same path.
- A refused add shows its message in an element announced as an alert, linked to the input (`aria-describedby`), with the input marked invalid while the message shows. The message begins with "(!)" so color is not the only signal.
- Focus is visible on every control (a 2 px ring in the accent color from the design file) and the page keeps native focus order.
- Colors come from `docs/DESIGN.md` as written. The color pairs of this Unit (body text on card, muted text on card, danger text on card, accent button text on accent) are listed in the component tests' documentation and checked for 4.5 to 1 once by hand with a contrast checker at the first checkpoint, because the simulated browser (jsdom) cannot compute contrast.
- The automated accessibility check [Q4 of the requirements] runs on the empty page, the page with tasks and the refused state in the component tests (jest-axe or an equivalent wrapper around axe). It checks names, labels and roles; it does not check announcements, so the test also asserts the alert element and its link to the input, and a manual keyboard run at the first checkpoint covers the rest.

### C-8. Test plan that proves the controls (NFR7.1, NFR7.2)

The test environment is Vitest with jsdom and React Testing Library. Tests are written layer by layer, each layer's tests written and run before the next:

1. Title rules and storage service (title cases, shape check, save, failure results, backup rules, all-or-nothing, two backups in one millisecond).
2. The hook (add, refused add, notice transitions, save-after-draw, failed save followed by a good save, load failures).
3. The components (add by keyboard, refused add keeps text and focus, plain-text display, accessibility check, timing guard).

Each new component, hook and service function has its happy path and at least two edge or error cases. The coverage report must show at least 80% of lines for this Unit's code, and the full suite passes before each merge. No test is weakened to pass.

## Requirement coverage

| Requirement | Control |
|-------------|---------|
| NFR3.1 | C-7 (native controls, focus ring, keyboard test, manual run) |
| NFR3.2 | C-7 (label, alert linked to the input, axe check, assertion on the alert) |
| NFR3.3 | C-7 ("(!)" mark, contrast checked by hand once) |
| NFR3.4 | C-7, C-8 |
| NFR4.1 | C-1 |
| NFR5.1 | C-2 |
| NFR5.2 | C-2 |
| NFR5.3 | C-3 |
| NFR6.1 | C-4 |
| NFR7.1 | C-8 |
| NFR7.2 | C-8 |
| NFR8.1 | C-5 |
| NFR8.2 | C-6 |

## Assumptions & Open Questions

- [assumption] The simulated browser is jsdom. jsdom cannot compute contrast or layout, which is why contrast has a manual check.
- [assumption] The color pairs checked for contrast are those the design file names; if `docs/DESIGN.md` changes, the check is repeated.
- [assumption] Stricter treatment of extra fields in saved data (they make a list unreadable) is acceptable in this Unit; U6 may relax it.
- [assumption] No content security policy and no encryption are used in phase 1: nothing is hosted and the data is the person's own text kept in their own browser.
- Open question: if a person's browser has storage disabled, every save fails with `blocked` and the person sees the save-failed notice for each add. Whether a quieter message is wanted is left for U6.
