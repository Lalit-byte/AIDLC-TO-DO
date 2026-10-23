# Code Summary: add-task (U1), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Approved plan: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/code-generation/code-generation-plan.md` (Steps 1 to 12).
- Design: `functional-design/`, `nfr-requirements/`, `nfr-design/` of this Unit; contracts C1 to C5 in `inception/contract-design/contract-summary.md`.
- Project documents `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/TASKS.md`.

## What was built

The walking skeleton: a person adds a task, sees it at the top of the list, and finds it again after a reload. The code is a React and Vite project at the workspace root (JavaScript, plain CSS, npm).

| File | Job |
|------|-----|
| `src/services/titleRules.js` | Pure `checkTitle`: trim, 1 to 200 visible characters (text segmenter, code point fallback) |
| `src/services/taskStorage.js` | `load`, `save`, `checkTitle` (delegates); one shape check for both; all-or-nothing write; backup of unreadable data; error mapping to `full`, `blocked`, `failed` |
| `src/hooks/useTasks.js` | List and notice state, `add`, save after the draw through a "save is due" ref |
| `src/components/TaskForm.jsx` | Labeled input, Add button, alert message with "(!)", focus rules |
| `src/components/TaskList.jsx`, `TaskItem.jsx` | Rows keyed by id; title as a plain text child |
| `src/App.jsx`, `src/main.jsx`, `src/styles.css` | Page frame, the only reader of the hook, a plain notice line, tokens from `docs/DESIGN.md` |
| `package.json`, `vite.config.js`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.gitignore`, `index.html` | Project, test, lint and format configuration |

## Decisions made while building

- **Save after the draw (D2).** `add` raises `saveDueRef`; a no-dependency `useEffect` starts, once per due save, `requestAnimationFrame` then `setTimeout(0)`; `runSave` clears the record first, then saves the list from `tasksRef`. Two adds before that step give one save of the latest list (tested).
- **Notice** is derived from two booleans (`loadFailed`, `saveFailed`), which gives exactly the state machine of the functional spec (`save-failed` outranks `load-failed`; a good save returns to `load-failed` only if the load had failed).
- **Storage service** is built by `createTaskStorage()`; the app uses the single `TaskStorage` instance. Each `load` resets the unreadable-text state, so the state never outlives the load that created it. Tests create their own instances.
- **TaskForm** uses an uncontrolled input: it reads `input.value` and clears it in the same step, which is what makes the second of two quick submits see an empty input (BR1.16).
- **No `React.StrictMode`** in `src/main.jsx`, so the saved list is read exactly once at page open (NFR1.5); StrictMode would read it twice in development.
- **Notices on screen.** U6 owns the real `MessageBar`; `App` shows the two fixed texts in a plain `role="status"` line so the failure states are visible and testable in this Unit.
- **`TaskList` accepts `hasTasks`** (passed by `App`) but does not use it yet; the empty-list message is a later Unit.
- **Lint rules** follow the security design: restricted globals and properties outside `src/services/`, `react/no-danger`, `innerHTML`, `outerHTML`, `insertAdjacentHTML` forbidden everywhere, one override for `src/services/`, titleRules kept strict, one narrow override (`localStorage`, `fetch`) for test files. A deliberate probe file using `localStorage`, `window.fetch`, `innerHTML` and `dangerouslySetInnerHTML` was flagged by every rule and then deleted.

## Deviations from the plan

- ESLint is pinned to major version 9 (`eslint@9.39.5`). The newest ESLint major is not yet inside the peer range of `eslint-plugin-react`, so `npm install` refused it. `npm` prints a deprecation notice for 9.39.5 ("no longer supported"). Moving to a newer ESLint is a follow-up once the React plugin supports it; it does not affect behaviour.
- `react/prop-types` is switched off because the project is plain JavaScript and does not add the prop-types package; the shapes are fixed by contracts C4 and C5.
- The suite has 91 tests, more than the "about 45" in the plan, because each file got its edge and error cases (including the segmenter fallback, each rejected task shape, and the backup rules).
- `src/test/tasks.js` and `src/test/axe.js` (test helpers) were added beside `src/test/setup.js`.
- The first test-after run of the hook tests showed a pending post-paint save of one test running in the next test; the fix was in the test file (each test waits for its own save to finish), not in the code.

## Results of the checks

| Check | Command | Result |
|-------|---------|--------|
| Layer 1: title rules and storage | `npx vitest run src/services/titleRules.test.js src/services/taskStorage.test.js` | 40 passed |
| Layer 2: hook | `npx vitest run src/hooks/useTasks.test.jsx` | 17 passed |
| Layer 3: components and page | `npx vitest run src/components/TaskForm.test.jsx src/components/TaskItem.test.jsx src/components/TaskList.test.jsx src/App.test.jsx` | 34 passed |
| Whole suite | `npm test` | 7 files, 91 tests passed |
| Coverage | `npm run test:coverage` | Lines 97.4%, statements 97.46%, branches 97.14%, functions 100% (floor 80% unchanged in `vite.config.js`) |
| Lint | `npm run lint` | no problems |
| Format | `npm run format:check` | all files formatted |
| Build | `npm run build` | built (22 modules) |
| Package report | `npm audit` | found 0 vulnerabilities |

Uncovered lines (all defensive): `useTasks.js` line 40 (the rare no-save-due early return of `runSave`), `taskStorage.js` line 33 (a task whose `title` is not text), line 67 (a missing `window.localStorage` object) and line 132 (`JSON.stringify` failure after the shape check passed).

## Open items for the checkpoint

These cannot run in the simulated browser and are NOT done by this stage.

1. **Manual keyboard run** in a real browser: Tab to the input, type, Enter, Tab to Add, Enter or Space; the focus ring is visible on both controls.
2. **Manual speed check (NFR1.4)** in Chrome with 100 tasks (performance recording): the new row appears in under 100 ms. The suite's 100 ms guard is a code-time regression guard only.
3. **Four-browser behaviour check (NFR2.1)** for Chrome, Edge, Firefox and Safari is for Build and Test.
4. **Contrast pairs.** Computed ratios from the `docs/DESIGN.md` colors (to be confirmed once with a contrast checker, as the design asks):

   | Pair | Ratio | Needed |
   |------|-------|--------|
   | Text `#1d1d1f` on card `#ffffff` | 16.83 to 1 | 4.5 |
   | Muted `#6b7280` on card (placeholder, input border) | 4.83 to 1 | 4.5 text, 3 border |
   | Danger `#dc2626` on card (message, notice) | 4.83 to 1 | 4.5 |
   | White on accent `#2563eb` (Add button) | 5.17 to 1 | 4.5 |
   | Focus ring accent on card | 5.17 to 1 | 3 |
   | Focus ring accent on page background `#f5f5f7` | 4.75 to 1 | 3 |

   All pairs pass by calculation. If a hand check disagrees, the owner of `docs/DESIGN.md` decides the color before the checkpoint passes.
5. **`npm audit`** reported 0 vulnerabilities at the time of the run; re-run before each merge (NFR5.3).
6. **Git** is not set up in this folder, so nothing was committed or merged. The `docs/TASKS.md` row `U1` is `in-progress` and should be set to `done` after approval.

## Edits that the design changes make to earlier documents (for their owners)

- FR6.3 wording: damaged data is kept as a backup copy, then replaced (functional spec).
- Screen M9 wording: the failed change stays on screen and is saved with the next successful save.
- Contract C2, C3 and C5 wording: backup copy on first save after unreadable data; `load` checks version and every task; `TaskForm` derives its `message` from the `reason` it gets back.
- `docs/ARCHITECTURE.md`: list `src/services/titleRules.js` next to `taskStorage.js`, and the axe test helper `src/test/axe.js`.
- `docs/ARCHITECTURE.md` and ADR-006: ids and times are made by `useTasks`, not by the storage service.

## Assumptions & Open Questions

- [assumption] The exact versions are those `npm install` resolved on the day of the build; `package-lock.json` is the record (React 19.3.1, Vite 8.3.4, Vitest 5.0.5, ESLint 9.39.5, Prettier 3.9.10).
- [assumption] The post-paint callback worked in the simulated browser without waiting helpers beyond `waitFor`; the mechanism was not changed.
- Open question: whether to move to a newer ESLint major when `eslint-plugin-react` supports it.
- Open question: `package.json` `engines` is `>=24.11.0` (the Node installed here, `v24.11.1`); the owner may prefer a looser range.
