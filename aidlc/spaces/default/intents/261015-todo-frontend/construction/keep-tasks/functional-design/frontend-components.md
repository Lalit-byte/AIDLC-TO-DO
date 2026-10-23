# Frontend Components: keep-tasks (U6), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflows W1 to W6, rules BR6.1 to BR6.15).
- Contracts C3 to C5: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Screens M8 and M9 and the MessageBar spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Decisions ADR-003, ADR-005, ADR-006: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/decisions.md`
- The earlier component designs: `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/frontend-components.md` and the later units' designs
- Team practices (one component per file, React functional components and hooks; browser storage only in the services folder): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] to [Q3].

## Component hierarchy

One new screen block, `MessageBar`. `App` reads `useTasks` and renders `MessageBar` above `TaskForm`; the rest is unchanged. The storage service and the state hook gain the tab refresh.

| Block | File | Change in this unit |
|-------|------|---------------------|
| MessageBar | `src/components/MessageBar.jsx` (new) | The message line above the add row: the load-failed or save-failed text, or nothing |
| App | `src/App.jsx` | Renders `MessageBar` above the add row, in place of the plain notice line below it |
| useTasks | `src/hooks/useTasks.js` | Subscribes to `TaskStorage` when the page opens and unsubscribes when it closes; replaces the list when another tab's list arrives; keeps the "another tab left damaged data" flag; the notice follows the extended state machine |
| TaskStorage | `src/services/taskStorage.js` | Adds `subscribe(listener)` (storage-change signal, re-read, damaged-text bookkeeping) |
| styles | `src/styles.css` | Restyles the notice as the message block |

(Paths are relative to the `frontend/` folder.) `TaskForm`, `TaskList`, `TaskItem`, `DeleteDialog` and the title rules are not touched.

## Props, state and values

Contract C5 gives `MessageBar` the input `notice` (null, or `{ kind, text }` with `kind` `load-failed` or `save-failed`). It holds no state.

`TaskStorage.subscribe(listener)` (contract C3) returns a function that stops the watching. It calls the listener with `{ ok: true, tasks }` when another tab changed the saved tasks and they read well (including an empty list when the saved list was removed), or `{ ok: false, reason: 'unreadable' }` when they read as damaged. It never calls the listener for a change made by its own tab and it never writes.

`useTasks` returns what it returned; the only visible differences are that its list can be replaced by another tab's list (BR6.4) and that its notice can become load-failed after damage from another tab (BR6.9).

## MessageBar

- Shows one line above the add row: "(!) Your tasks could not be loaded." or "(!) Your change could not be saved.", in the danger color (BR6.13). When `notice` is null it renders nothing.
- It is announced to screen readers as an alert when it appears (a role of alert), and the "(!)" mark makes the message more than color alone.
- It holds no state and no buttons; there is nothing to dismiss: the message goes when its cause goes (BR6.3, BR6.9).
- `data-testid="notice"` stays on the line, so existing tests that look for it keep working.

## Interaction flows

| Flow | Steps |
|------|-------|
| Reload | The page opens with the saved tasks in the saved order |
| Saved data damaged | The message line shows above the add row, the list is empty, and the message stays until reload (screen M8) |
| Save fails | The change stays on screen; the message line shows; it goes after the next good save (screen M9) |
| Add in tab 2 | Tab 1's list gains the task at once, with no message and no focus change |
| Other tab leaves damaged data | Tab 1 keeps its list and shows the load-failed message; its next change saves its list after a backup of the damaged text |
| Other tab clears browser data | Tab 1's list becomes empty, with no message |
| Tab 1 was editing a task tab 2 deleted | The edit ends and the dialog closes with nothing removed (BR4.12, BR3.8) |

## Focus and accessibility

| Requirement | Implementation |
|-------------|----------------|
| Announcement | The message line is an alert: read out when it appears |
| Not by color alone | The "(!)" mark and the words carry the meaning, with the danger color as an extra |
| Contrast | `#dc2626` on the white card is at least 4.5 to 1 (4.83 to 1 as calculated earlier) |
| Focus | No control in the block; a refresh by another tab never moves focus (BR6.4); a row that was being edited or confirmed and is gone follows BR4.12 and BR3.8 |
| Test ids | `data-testid="notice"` on the message line, as before |

## Integration points

The only outside contact is the browser's own storage and its signal that another tab changed it, both inside `TaskStorage` (the services folder). No network call; no task data leaves the browser (BR6.8).

## Assumptions & Open Questions

- [assumption] The message block keeps the class names of the old notice where tests and styles use them, with the "(!)" mark added; styling details are the Code Generation plan's.
- [assumption] `useTasks` subscribes in an effect when the page opens and removes the subscription when the page closes; the listener replaces the list through the hook's own list holder (never reads browser storage).
- When the other tab's list arrives, the hook sets both its screen list and the list its next save reads, and drops any save made due but not yet run (rule BR6.14, no longer an assumption).
- The subscription accepts only signals from this browser's local storage whose key is the saved-tasks key or absent (a clear-everything); a blocked read during a signal is ignored (rules BR6.12 and the kept-text rule in State held).
- Open question: none.
