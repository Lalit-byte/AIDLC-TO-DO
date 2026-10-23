# Code Generation Plan: add-task (U1), Todo List Frontend (Phase 1)

## Summary

- Builds: the first working slice: add a task, see it at the top of the list, and find it again after a reload (page, add form, list, state hook, storage service, title rules), plus the project setup
- Touches: a new React and Vite project at the workspace root: `package.json`, `vite.config.js`, `eslint.config.js`, `index.html`, and `src/` (components, hooks, services, tests, styles)
- Tests: about 45 automated tests across seven pieces (title rules, storage, hook, three components, page) including accessibility, plain-text, no-network, speed-guard and failure cases, with an 80% line-coverage floor

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and story map (U1 add-task, story US1.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Functional design (workflows W1 to W6, rules BR1.1 to BR1.16, components): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and `frontend-components.md`
- NFR requirements and tech stack: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-requirements/` (NFR1.1 to NFR8.2, `tech-stack-decisions.md`)
- NFR design: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/nfr-design/` (`performance-design.md`, `security-design.md`, `logical-components.md`)
- Contracts C1 to C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`; team practices `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers to the earlier design questions [Q1] to [Q5] of Functional Design, NFR Requirements and NFR Design.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Write each testable layer (component, hook, storage service), then write and run that layer's tests before moving to the next layer.",
  "scope": "mvp",
  "test_strategy": "standard",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: test-after\n- **Ordering**: Write each testable layer (component, hook, storage service), then write and run that layer's tests before moving to the next layer.\n- **Methodology evidence**: Human confirmed in the interview (Q3: A).\n- Tooling (`docs/ARCHITECTURE.md`, `docs/RULES.md`): Vitest and React Testing Library.\n- Coverage floor (org.md, `mvp` scope; Q4: A): 80% line coverage. Not to be weakened to pass a step.\n- No automated build server exists (no cloud accounts, no budget), so the full test suite is run locally before every merge. This is how \"CI execution before merge\" is met for now. Adding a free CI server later is not decided.\n- Test content (`docs/RULES.md`, matches construction guardrails): each new component or hook gets the happy path plus at least two edge or error cases; run the full suite before marking a task done (guidance, not a hard rule)."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:5bae8ea206b768d45f70d2614f33d153dda87a83b5f8352f98f7dc14241d6f92",
  "contract_sha256": "sha256:83f6101ff56457e58b2be6190b96d3cbe41895387a78f56e8f6ae78c468d99dc"
}
```

## Plan steps

The order follows the contract: test-after, layer by layer (storage and rules, then the hook, then the components); each layer's tests are written and run before the next layer. "Data model / database behavior" is the Task shape and its saved format (inside the storage service); there is no separate repository, API or database layer in a browser-only app, so those profile steps are folded into the layers below and noted as not applicable.

### Setup

- [x] **Step 1: Claim the work on the shared board.** Add a row for U1 add-task in `docs/TASKS.md` listing the files this plan touches (the list under "Files" below) and set it to `in-progress`. Stories: US1.1. Files: `docs/TASKS.md`.
- [x] **Step 2: Project structure and production configuration skeleton.** Create `package.json` (npm scripts: `dev`, `build`, `preview`, `lint`, `format`, `format:check`, `test`, `test:coverage`), the lock file, `index.html`, `vite.config.js`, `.gitignore` (ignoring `node_modules` and `coverage`), and the `src/` folders `components/`, `hooks/`, `services/`, `test/`. Install the current stable React, React DOM, Vite and its React plugin, plus the tools in Step 3 and Step 12, with npm [tech stack decisions]; the lock file fixes the versions. Record the Node version in `package.json` `engines`. Stories: US1.1 (setup). Files: `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `.gitignore`.
- [x] **Step 3: Bootstrap the minimal test runner and record the exact unit-scoped command.** Add Vitest, the jsdom environment, React Testing Library, its user-event and jest-dom helpers, and the axe wrapper (`jest-axe`) as development packages. Configure Vitest in `vite.config.js` (jsdom, `src/test/setup.js` for the jest-dom matchers and a clean `localStorage` before each test, coverage with the `v8` provider, a line threshold of 80, coverage counted over `src/**` excluding test files and `src/main.jsx`). The threshold is a floor that must not be lowered. Create `src/test/setup.js`. Run one trivial placeholder-free check that the runner starts (`npx vitest run --passWithNoTests`) and confirm the exact command in `unit-test-instructions.md` works once the first test file exists (Step 5). Stories: US1.1 (NFR7.1, NFR7.2). Files: `vite.config.js`, `src/test/setup.js`, `package.json`.

### Layer 1: title rules and storage service (data model and data access)

- [x] **Step 4: Implement the title rules and the storage service.**
  - `src/services/titleRules.js`: a pure `checkTitle(rawTitle)` returning `{ ok: true, title }` (trimmed) or `{ ok: false, reason: 'empty' | 'too-long' }`; the length counts visible characters (an emoji or an accented letter counts once, by splitting into user-perceived characters with the browser's text segmenter, with a code-point count as fallback) (BR1.1 to BR1.3, BR1.15).
  - `src/services/taskStorage.js`: `checkTitle` (delegates to the rules file), `load()`, `save(tasks)` as in contract C3, under the name `todo-app.tasks` with `version: 1`:
    - one shape check shared by load and save: exactly the five keys; `id` non-empty text; `title` text that passes the rules and is already trimmed; `completed` true or false; `createdAt` and `updatedAt` match a fixed ISO 8601 pattern and parse to a valid date (BR1.10, BR1.11, NFR6.1);
    - `load`: missing saved list is an empty list; unreadable text, wrong version or a failing task is `unreadable` and the exact text is kept in memory; refused access is `blocked` (BR1.11, BR1.14);
    - `save`: check every task, and only then (a) on the damaged-data path make the backup copy first under `todo-app.tasks.damaged.<milliseconds>` with a counter if the name exists (probing existence only on this path), never overwriting, and stop with the failure's reason if the copy fails; (b) build the whole text first and store it in one call; (c) map errors to `full`, `blocked` or `failed`; keep the copy marked as done if the main write fails after it; forget the unreadable text after a successful main write (BR1.10, BR1.13, NFR8.1, NFR8.2, C-4 to C-6 of the security design).
  - Stories: US1.1 (AC1.1.2, AC1.1.3), US6.1 basics. Files: `src/services/titleRules.js`, `src/services/taskStorage.js`.
- [x] **Step 5: Write and run the tests for layer 1.** `src/services/titleRules.test.js` and `src/services/taskStorage.test.js`: trimming, empty, spaces-only, exactly 200 and 201 characters, emoji and accented counting, markup text accepted as text; load of a missing list, a valid list, invalid text, wrong version, a task with a missing, extra or wrongly typed field, an untrimmed saved title, blocked storage; save of a valid list, an invalid task, a full store, a blocked store, the whole list written once, a failure leaving the previous list readable; backup copy holds the exact original text, a failed copy writes nothing else, a backup that succeeds followed by a failed write is not repeated, two backups in the same millisecond both survive, no backup for a blocked load. Run: `npx vitest run src/services/titleRules.test.js src/services/taskStorage.test.js`. Stories: US1.1, NFR6.1, NFR8.1, NFR8.2. Files: the two test files.

### Layer 2: the state hook (business logic)

- [x] **Step 6: Implement the state hook.** `src/hooks/useTasks.js` returns `visibleTasks`, `hasTasks`, `notice` and `add(rawTitle)` (contract C4, this Unit's part). It reads the saved list once at open (a lazy initial value); builds the new task with a new unique id (the browser's built-in unique id maker, falling back to a time-plus-random-text id where it is missing) and one ISO time for both time fields (BR1.9); puts the task at the front; and starts the save through a "save is due" record kept in a ref, cleared before the save runs, with the save reading the latest list from a ref, so a second run with the record cleared does nothing. The save runs after the page has painted: after the commit, a post-paint callback (`requestAnimationFrame` followed by a zero-delay timeout) runs `TaskStorage.save`, never inside the same step as the add (NFR1.2, D2 of the performance design, answer [Q1: A]). The notice follows the state machine of the functional spec (load-failed, save-failed, back to load-failed only when the load had failed), with the fixed texts "Your tasks could not be loaded." and "Your change could not be saved." Stories: US1.1 (AC1.1.1 to AC1.1.4, AC1.1.6). Files: `src/hooks/useTasks.js`.
- [x] **Step 7: Write and run the tests for layer 2.** `src/hooks/useTasks.test.jsx` (hook rendered with Testing Library): first open with no saved list; open with saved tasks; add puts the task first with an id and equal times; refused empty and too-long adds change nothing; duplicate titles allowed; the saved list holds the new task after the post-paint step; **NFR1.2 test**: a `save` that stays pending (or is slow) is called only after the new row is already in the hook's list, and the row is present when `save` is called; failed save then another add writes the whole list including the first task and clears the notice; load failure sets `load-failed`; a save failure after a load failure shows `save-failed` and returns to `load-failed` after a good save; two adds before the post-paint step produce one save of the latest list; the unique-id fallback is used when the built-in maker is missing. Run: `npx vitest run src/hooks/useTasks.test.jsx`. Stories: US1.1, NFR1.2, NFR1.5. Files: the test file.

### Layer 3: screen blocks and the page (frontend behavior)

- [x] **Step 8: Implement the screen blocks, page and styles.** `src/components/TaskForm.jsx` (a form with a labeled input "Task title", placeholder "What needs to be done?", an Add button; reads and clears the input in one step on success; keeps text and focus on refusal; shows the message for the `reason` in an alert element linked to the input, marked invalid, with a "(!)" mark; message cleared when the person types again; focus in the input on open and after a successful add) (BR1.6, BR1.8, BR1.16); `src/components/TaskItem.jsx` (the title as a plain text child, long text wrapping); `src/components/TaskList.jsx` (the tasks, newest first, keyed by id); `src/App.jsx` (reads the hook once, the page frame and title "Todo List", passes data and actions); `src/main.jsx`; `src/styles.css` (plain CSS using the colors, spacing, 600 px card and focus ring from `docs/DESIGN.md`; no animation). Add `data-testid` attributes to the input, the Add button, the message, the list and each row. Stories: US1.1 (AC1.1.1 to AC1.1.5). Files: `src/components/TaskForm.jsx`, `src/components/TaskItem.jsx`, `src/components/TaskList.jsx`, `src/App.jsx`, `src/main.jsx`, `src/styles.css`.
- [x] **Step 9: Write and run the tests for layer 3.** `src/components/TaskForm.test.jsx`, `src/components/TaskItem.test.jsx`, `src/components/TaskList.test.jsx`, `src/App.test.jsx`: add by keyboard only (type, Enter) and by the button; refused empty and 201-character titles show the right message under the row, keep the text and the focus; exactly 200 characters is added; duplicate titles give two rows; `<b>x</b>` is shown literally with no bold element; newest at the top; input cleared and focused after an add; a second submit straight after the first adds one task; page open shows focus in the input; reload (render again) shows the saved tasks in the same order; accessibility check (axe) on the empty page, the page with tasks and the refused state, plus assertions that the message is an alert linked to the input; a network spy that is never called while adding and reloading (NFR5.1); the speed guard: adding to a list of 100 saved tasks takes under 100 ms of code time (NFR1.3, a regression guard, not the real measure); the storage-failure notices appear on the page for the two failures. Run: `npx vitest run src/components/TaskForm.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx`. Stories: US1.1 (AC1.1.1 to AC1.1.6), NFR3.1 to NFR3.4, NFR4.1, NFR5.1. Files: the four test files.

### Not applicable layers

- [x] **Step 10: Repository, API and database layers: not applicable.** The saved list in browser storage is handled in Step 4; there is no server, endpoint, migration or schema in phase 1. This step records that decision and ticks when the plan reaches it. Stories: none. Files: none.

### Environment, checks and documents

- [x] **Step 11: Environment and build configuration.** `eslint.config.js` with the React and hooks rules and the controls of the security design [Q2: A]: restricted global names (`localStorage`, `sessionStorage`, `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `indexedDB`) and restricted properties (the same names on `window` and `globalThis`, `navigator.sendBeacon`, `document.cookie`) outside `src/services/`; raw HTML insertion forbidden everywhere (`react/no-danger`, and the properties `innerHTML`, `outerHTML`, `insertAdjacentHTML`); the one override allowing storage and network names in `src/services/**`; and one narrow override allowing only `localStorage` and `fetch` in test files (`src/**/*.test.{js,jsx}` and `src/test/**`). `.prettierrc` and `.prettierignore`. Confirm `npm run lint`, `npm run format:check`, `npm run build` and the full suite `npm test` all pass, run the coverage report and confirm at least 80% of lines, and run `npm audit` and read the report (it does not block). Stories: US1.1 (NFR5.2, NFR5.3, NFR7.1). Files: `eslint.config.js`, `.prettierrc`, `.prettierignore`, `package.json`.
- [x] **Step 12: Documentation and traceability.** Write `code-summary.md` (files, decisions, coverage, deviations, the open items: the contrast pairs to check by hand including the focus ring against its background at 3 to 1 and what to do if a pair fails, the manual keyboard run, the manual speed check in Chrome with 100 tasks, the `npm audit` result), `traceability.json` (AC1.1.1 to AC1.1.6, the detailed NFR IDs and the business rules BR1.1 to BR1.16, each with an existing workspace file as target) and `source-manifest.json` (every file this Unit created or changed, including those written by `npm install`), all under `construction/add-task/code-generation/`. List in the summary, for the owners, the edits that the design changes make to earlier documents (FR6.3 wording, M9 wording, contract C2, C3 and C5 wording, `docs/ARCHITECTURE.md` for `titleRules` and the axe helper). Stories: US1.1. Files: `construction/add-task/code-generation/code-summary.md`, `traceability.json`, `source-manifest.json`.

## Files this plan creates or changes

`package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.gitignore`, `src/main.jsx`, `src/App.jsx`, `src/styles.css`, `src/components/TaskForm.jsx`, `src/components/TaskItem.jsx`, `src/components/TaskList.jsx`, `src/hooks/useTasks.js`, `src/services/titleRules.js`, `src/services/taskStorage.js`, `src/test/setup.js`, and the test files named in Steps 5, 7 and 9; `docs/TASKS.md`. Generated folders (`node_modules/`, `dist/`, `coverage/`) are claimed as directories in the source manifest where they are written.

## Story-to-step traceability

| Story or requirement | Steps |
|----------------------|-------|
| US1.1 AC1.1.1 (add by keyboard, newest first, input cleared) | 6, 7, 8, 9 |
| US1.1 AC1.1.2 (empty title message) | 4, 5, 8, 9 |
| US1.1 AC1.1.3 (200 and 201 characters) | 4, 5, 8, 9 |
| US1.1 AC1.1.4 (duplicate titles) | 6, 7, 9 |
| US1.1 AC1.1.5 (plain text) | 8, 9, 11 |
| US1.1 AC1.1.6 (under 100 ms for 100 tasks) | 6, 7, 9 |
| NFR1.1 to NFR1.5 | 6, 7, 9, 12 |
| NFR2.1 | 2, 12 |
| NFR3.1 to NFR3.4 | 8, 9, 12 |
| NFR4.1 | 8, 9, 11 |
| NFR5.1 to NFR5.3 | 9, 11 |
| NFR6.1, NFR8.1, NFR8.2 | 4, 5 |
| NFR7.1 to NFR7.3 | 3, 5, 7, 9, 11 |

## Assumptions & Open Questions

- [assumption] The exact versions come from the current stable releases when `npm install` runs; the lock file becomes the record. Not guessed in this plan.
- [assumption] The post-paint callback (`requestAnimationFrame` then a zero-delay timeout) is the deferral mechanism; if it proves flaky in tests, the tests wait for it with Testing Library's waiting helpers, and the mechanism itself is not changed without telling you.
- [assumption] The visible-character count uses the browser's text segmenter, with a code-point count as fallback where it is missing.
- [assumption] Coverage excludes test files and the entry file `src/main.jsx` only; no threshold is lowered and no source file is excluded to reach 80%.
- [assumption] Steps 1 and 12 edit documents outside the source tree (`docs/TASKS.md` and the record folder) because the project rules ask that the files of a task be listed before editing.
- Open question: the contrast pairs cannot be computed in the simulated browser; they are checked by hand at the checkpoint (Step 12). If a pair fails, the owner of `docs/DESIGN.md` decides the color before the checkpoint passes.
- Open question: Git is not set up in this folder (team practices prerequisite), so nothing is committed or merged by this plan.
