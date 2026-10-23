# Functional Design Questions: keep-tasks (U6)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition (U6 keep-tasks, story US6.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR6.1 to FR6.5, NFR5, NFR6, NFR8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC6.1.1 to AC6.1.8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Screens M8 and M9 and the MessageBar spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Contracts C2 and C3 and their open questions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component decisions ADR-003 (watching other tabs), ADR-005, ADR-006: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/decisions.md`
- What add-task already built and settled (saving all or nothing, the damaged-data backup, the two notices and their state machine, checking saved data on load): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md` and the existing `frontend/src/services/taskStorage.js` and `frontend/src/hooks/useTasks.js`

Context: much of this Unit was settled earlier. Add-task already made saving all or nothing, shows both messages as notices, checks every saved task on load, keeps a copy of damaged data before the first save over it, and keeps a failed change on screen. The two questions the unit definition left open (what a later save does after a failed save, and which block makes ids) were both answered there. What this Unit adds: noticing changes made by another tab and refreshing the list (FR6.4), the message line above the add row as its own block (screens M8 and M9), and the unusual cases that are still undecided. Three choices are open.

## Question 1: Another tab leaves the saved tasks damaged. What should this tab do?

For example, the other tab (or the person, by editing browser data) leaves text in storage that cannot be read as tasks, while this tab is open with a good list on screen.

A. Keep this tab's list as it is on screen and show the message "Your tasks could not be loaded." The next change made here saves this tab's list, after first copying the damaged text to a backup, so nothing is lost either way.
B. Empty this tab's list and show the message, as if the page had just been opened with damaged data. The person sees the same thing as a fresh load, but the tasks they had on screen disappear until they reload or add new ones.
X. Other (please specify)

[Answer]: A

## Question 2: What if this tab saves a list that is older than the saved one?

Every save writes the whole list. If this tab missed another tab's change (for example the other tab's change notice had not arrived yet), saving would write an old list over the newer one and the other tab's change would be lost or a deleted task would come back.

A. Accept it: the last save wins. The change notices keep the tabs in step almost always, and the gap is very small. Simplest; no extra checks.
B. Check before saving: just before each save, read the saved list and compare it with the last list this tab knew. If another tab changed it meanwhile, do not save; refresh the screen from the saved list and show the message "Your tasks were changed in another tab. Please try again." so the person repeats their change on the fresh list. Safer for data, more code, one more message.
X. Other (please specify)

[Answer]: A

## Question 3: What should happen to extra fields on a saved task?

For example, saved text where a task has a sixth field next to the five agreed ones (id, title, complete state, created time, updated time).

A. Treat it as damaged: the whole saved list is unreadable (message, empty list, backup before the first save). This is how the code already behaves. Strict: saved tasks always hold exactly the five fields.
B. Ignore the extra field when reading and drop it the next time the list is saved. Gentler for a list written by a newer version of the app, but the extra data is lost silently.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] A saved list with a version number the app does not know is treated as unreadable (message, empty list, damaged data left until a save backs it up), as contract C2 says and as the code already does.
- [assumption] When another tab changes the saved tasks, this tab replaces its list with the saved one without any message (FR6.4). A change that failed to save in this tab and is still on screen is replaced too, and the save-failed message goes away, because the screen then matches what is saved.
- [assumption] A saved list that another tab removed altogether (storage cleared) means an empty list, not damaged data.
- [assumption] The message line is its own block above the add row and shows one message at a time, as in screens M8 and M9; the load-failed message stays until reload and a save-failed message goes at the next good save (the notice state machine of add-task is unchanged).
- [assumption] A task that another tab removes or changes while this tab is editing or confirming it is handled by the earlier rules (editing ends, the delete dialog closes with nothing removed).
- [assumption] No task data is sent outside the browser and tasks are never shared between browsers (NFR5, FR6.5); nothing in this Unit adds a network call.
- [assumption] The message "Your tasks could not be loaded." that follows damage made by another tab (Q1) behaves like the one after a damaged load: it stays until the page is reloaded; the next change made here still saves this tab's list after a backup of the damaged text.

## Consolidated Summary Confirmation

- If another tab leaves the saved tasks damaged, this tab keeps its list on screen and shows "Your tasks could not be loaded."; the next change made here saves this tab's list after copying the damaged text to a backup (Q1: A).
- Every save writes the whole list and the last save wins; there is no check before saving for a list that is older than the saved one (Q2: A).
- A saved task with an extra field is treated as damaged, as the code already does: the whole saved list is unreadable (Q3: A).
- Everything else follows the earlier designs and the contracts: changes made by another tab replace this tab's list with the saved one without a message; a saved list with an unknown version number is unreadable; a removed saved list means an empty list; the message line becomes its own block above the add row (screens M8 and M9); saving stays all or nothing; nothing is sent outside the browser.

- Looks correct
- Request changes

[Answer]: Looks correct
