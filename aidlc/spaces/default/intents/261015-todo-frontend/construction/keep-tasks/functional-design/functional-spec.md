# Functional Specification: keep-tasks (U6), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition and boundaries (U6 keep-tasks, story US6.1): `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md`
- Requirements FR6.1 to FR6.5, NFR5, NFR6, NFR8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Acceptance criteria AC6.1.1 to AC6.1.8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Contracts C2 to C5 and their open questions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Component catalogue and decisions ADR-003, ADR-005, ADR-006: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md` and `decisions.md`
- Screens M8 and M9 and the MessageBar spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- The add-task functional design, which already settled saving all or nothing, the checks on load, the damaged-data backup and both notices (rules BR1.10 to BR1.14, notice state machine, workflows W1, W4, W5): `aidlc/spaces/default/intents/261015-todo-frontend/construction/add-task/functional-design/functional-spec.md`
- The later units' designs (edit and delete reactions to a task leaving the list, BR3.8 and BR4.12): `aidlc/spaces/default/intents/261015-todo-frontend/construction/delete-task/functional-design/functional-spec.md` and `.../edit-task/functional-design/functional-spec.md`
- Answers recorded in `functional-design-questions.md` in this folder, cited as [Q1] to [Q3].

## Purpose and scope

keep-tasks makes sure a person's tasks survive reloads and that they are told plainly when they cannot be loaded or saved; two tabs stay in step. Most of this was built with the first slice (add-task): the page already saves the whole list in one step, reads it back, checks every task, keeps a copy of damaged data before the first save over it, keeps a failed change on screen and shows the two notices. This document is the source of truth for the whole behaviour of US6.1, and says clearly which rules are already built (marked "built in add-task") and which are new in this Unit. It is design only: no code.

New in this Unit:
- noticing changes another tab makes to the saved tasks and refreshing the list (FR6.4): the storage service's `subscribe` (contract C3) and the state hook's use of it;
- the message line as its own block above the add row (`MessageBar`, screens M8 and M9), with the "(!)" mark and as an alert;
- the answers to the unusual cases still open: damage made by another tab [Q1], saving an older list [Q2], extra fields on a saved task [Q3].

Not in this Unit: the empty-list hint (U9) and the browser-only line (U8), which sit near these messages.

## Workflows

### W1. Open the page (built in add-task)

`useTasks` asks `TaskStorage.load()` once. A good list is shown in saved order; a missing list is an empty list; an unreadable or blocked result gives an empty list and the load-failed message (add-task W1, BR1.11).

### W2. Save a change (built in add-task)

Each change is drawn first, then the whole list is saved in one step after the draw; a failed save keeps the change on screen and shows the save-failed message; the next good save clears it (add-task W2, W4, BR1.10, BR1.12).

### W3. First save after damaged data (built in add-task)

`TaskStorage` copies the damaged text to a backup name before the first write over it (add-task W5, BR1.13).

### W4. Another tab changes the saved tasks (new)

1. The person changes tasks in tab 2. Tab 2 saves the whole list as usual.
2. The browser tells tab 1 that the saved tasks changed. (It never tells the tab that made the change.)
3. `TaskStorage` in tab 1 reads the saved text again and tells its subscriber, `useTasks`, the result: a list of tasks (BR6.4), or unreadable (BR6.9). A saved list that no longer exists counts as an empty list (BR6.12).
4. For a list of tasks, `useTasks` replaces the list on screen with it, starts no save, and clears the save-failed message because the screen now matches what is saved (BR6.4, BR6.14). No message tells the person anything changed.
5. Rows react by the earlier rules: a task that left the list ends its edit and closes its delete dialog with nothing removed (BR4.12, BR3.8).

### W5. Another tab leaves damaged data (new)

1. Steps 1 to 3 of W4 run and the saved text is unreadable (not the saved format, an unknown version, a task that fails the checks, or a task with an extra field).
2. Tab 1 keeps its list on screen unchanged, `TaskStorage` keeps the damaged text in memory as unreadable data not yet backed up, and the load-failed message shows (BR6.9 [Q1]). The message stays until the page is reloaded.
3. When the person next changes something in tab 1, W2 runs: the save first copies the damaged text to a backup name and then writes this tab's list, as in W3. Nothing is lost on either side.

### W6. Reload and other browsers

A reload is W1 and shows the same tasks, order, titles and states (BR6.1). A different browser or device has its own storage and shows none of these tasks (BR6.5).

## State held

No new state in the page or the rows. `useTasks` keeps what it kept (the list, the save-failed flag, whether the load failed) and gains one flag: whether another tab left the saved data damaged. That flag and the load-failed flag together decide the load-failed message; both last until the page is reloaded. `TaskStorage` already holds the unreadable text kept for the backup; it also sets it when another tab's change reads as unreadable, and clears it when a later read of the saved text is good. `TaskStorage` holds the subscriber and removes it when `useTasks` stops watching. Its kept unreadable text is updated by every re-read in the same way, whether at load or on a signal: a good list clears it; a removed list clears it; damaged text replaces any older kept text and marks it not yet backed up, even if an earlier kept text was already backed up by this tab (a new backup is made for the new text at the next save); a blocked or failed read leaves it as it was, and during a signal a blocked or failed read is ignored (no call to the subscriber, no change on screen) because it is not damage. The re-read shares the one reading code with the load, which resets the kept text only according to this rule.

### Notice state machine (extends add-task's)

One message is shown at a time; save-failed outranks load-failed.

| From | Event | To |
|------|-------|----|
| none | load returns unreadable or blocked | load-failed |
| none | a save fails | save-failed |
| none | a save succeeds | none |
| none | another tab leaves damaged data | load-failed |
| none | another tab's list arrives | none |
| load-failed | a save fails | save-failed |
| load-failed | a save succeeds | load-failed (until reload) |
| load-failed | another tab's list arrives | load-failed (until reload) |
| load-failed | another tab leaves damaged data | load-failed (stays until reload) |
| save-failed | a save fails | save-failed |
| save-failed | a save succeeds, and no load damage was seen | none |
| save-failed | a save succeeds, and load damage was seen | load-failed |
| save-failed | another tab's list arrives | none, or load-failed when load damage was seen |
| save-failed | another tab leaves damaged data | save-failed (it is the newer problem; load-failed shows again after the next good save or after the other tab's list arrives) |

Text fallback: the message line shows nothing, the load-failed message (kept until reload) or the save-failed message (kept until the screen matches the saved tasks again, by a good save or by another tab's list); a failed save is always shown first.

## Business rules

| ID | Category | Rule | Source |
|----|----------|------|--------|
| BR6.1 | policy | Tasks are kept in the person's own browser. After a reload, or after the browser is closed and reopened, the same tasks appear in the same order with the same titles and complete states. Built in add-task (BR1.10, BR1.11); checked again here. | FR6.1, FR6.2, AC6.1.1 |
| BR6.2 | policy | When the saved text cannot be read as tasks (not the saved format, a task that fails the checks, an unknown version number, or a task with an extra field [Q3]), the page shows the message "Your tasks could not be loaded." above the add row, starts with an empty list, and leaves the damaged data untouched until a save first copies it to a backup name. Built in add-task (BR1.11, BR1.13); extra fields and unknown versions stay unreadable. | FR6.3, AC6.1.2, contract C2 |
| BR6.3 | policy | When a save is blocked or fails, the change stays on screen and the message "Your change could not be saved." shows above the add row until the next successful save (or until another tab's list arrives, BR6.14). Built in add-task (BR1.12). | FR6.3, AC6.1.3 |
| BR6.4 | policy | When another tab of the same browser changes the saved tasks, this tab replaces its list on screen with the saved list, without a reload, without a message, and without starting a save. The tab that made the change is never told by the browser, so there is no echo. `TaskStorage.subscribe` is how `useTasks` hears about it (contract C3, ADR-003); `useTasks` starts watching when the page opens and stops when it closes. | FR6.4, AC6.1.4, ADR-003 |
| BR6.5 | constraint | Tasks are never shared between browsers, devices or people: each browser's own storage holds its own tasks, there are no accounts, and nothing is sent anywhere. | FR6.5, AC6.1.5 |
| BR6.6 | constraint | A save writes the whole list in one step or writes nothing; if it fails part way, the tasks saved before are unchanged and still readable and no half-saved list can appear. Built in add-task (BR1.10). | NFR8, AC6.1.6 |
| BR6.7 | constraint | A saved task holds exactly five fields: `id`, `title`, `completed`, `createdAt`, `updatedAt`. A task with another field is treated as damaged (BR6.2) and is never saved with extra fields [Q3]. Built in add-task (BR1.9, BR1.10). | NFR6, AC6.1.7, [Q3] |
| BR6.8 | constraint | Using the app, in any of the cases above, sends no task data outside the browser: no call of this Unit reaches the network. | NFR5, AC6.1.8 |
| BR6.9 | policy | When another tab leaves the saved tasks damaged, this tab keeps its list on screen unchanged and shows "Your tasks could not be loaded." The damaged text is kept in memory as not yet backed up, so the next change made here saves this tab's list after first copying the damaged text to a backup name. The message stays until the page is reloaded [Q1]. | [Q1], FR6.3 |
| BR6.10 | policy | Every save writes the whole list from this tab, and the last save wins: there is no check before saving for a list that is older than the saved one. The change notices of BR6.4 keep tabs in step almost always, and a change made in the very short gap before a notice arrives can overwrite another tab's change [Q2]. | [Q2], contract C3 and C4 open question |
| BR6.11 | constraint | A saved list with a version number the app does not know is unreadable (BR6.2); the version number is checked on every read, including a read caused by another tab. | contract C2 |
| BR6.12 | constraint | When another tab removes the saved list altogether (its browser data was cleared), the saved list no longer exists and counts as an empty list, not as damaged data: this tab's list becomes empty, with no message. The browser reports a clear-everything to other tabs as a storage-change signal with no key; so a signal triggers the re-read when its key is the saved-tasks key or when it has no key at all, and only when it comes from this browser's local storage; a signal for any other key or any other storage area is ignored. Check: a simulated signal for the tasks key, one with no key, and one for another key (ignored). | contract C3, W4 |
| BR6.13 | policy | The message line is its own block (`MessageBar`) above the add row. It shows one message at a time, in the danger color with a "(!)" mark before the text, announced to screen readers as an alert when it appears, and nothing when there is no message. The two texts are exactly "Your tasks could not be loaded." and "Your change could not be saved." | FR6.3, screens M8 and M9, interaction spec |
| BR6.14 | policy | When another tab's list replaces this tab's list, the hook sets both the list on screen and the list the next save reads, and clears its "save due" record, so a later save can never write the old list back over the other tab's. A change of this tab that had failed to save and was still on screen is replaced as well, a change made just before the signal whose save has not yet run is dropped (a save that already ran can overwrite the other tab's change, as BR6.10 says; one still due is dropped), and the save-failed message goes away, because the screen now matches the saved tasks. | W4, ADR-006 |
| BR6.15 | constraint | A read caused by another tab never changes saved data: it only reads. `TaskStorage` alone reads and writes browser storage. | team hard rule, contract C3 |

## Rules summary (derived)

BR6.1, BR6.2, BR6.3, BR6.6 and BR6.7 are the keeping and failing rules built in add-task; BR6.4 and BR6.14 are the new tab-to-tab refresh; BR6.9 to BR6.12 are the unusual cases (damage from another tab, older lists, unknown versions, a removed list); BR6.13 is the message block; BR6.5, BR6.8 and BR6.15 are the safety rules.

## Corners swept (storage, tabs, messages)

| Corner | Settled how |
|--------|-------------|
| Reload with tasks | BR6.1 |
| Saved text damaged, unknown version, extra field | BR6.2, BR6.7, BR6.11 |
| Browser refuses storage | BR6.3 (and `blocked` on load, BR6.2) |
| Save fails part way | BR6.6 |
| Storage full | A save fails (`full`): BR6.3 |
| Two tabs, add in one | BR6.4 |
| Two tabs, both change quickly | BR6.10: last save wins; accepted |
| Another tab clears browser data | BR6.12 |
| Another tab leaves damaged data | BR6.9 [Q1] |
| Other tab's list arrives while a save failed here | BR6.14 |
| Other tab's list arrives while editing or confirming a delete on a task that is gone | Earlier rules (BR4.12, BR3.8) |
| Other tab's list arrives while editing a task that still exists | The edit stays open; the row's typed text is kept; saving replaces the other tab's version of that task (BR6.10) |
| The tab that saved | Not told by the browser; no echo (BR6.4) |
| Backup when the damaged text arrives from another tab | BR6.9 |
| Message wording and look | BR6.13 |
| Different browser or device | BR6.5 |
| Network | BR6.8 |
| Key name and backup names | Unchanged from add-task (`todo-app.tasks`, `todo-app.tasks.damaged.<time>`) |

## Changes to earlier documents (for their owners to approve)

This stage does not edit approved documents.

- Contract C3: `subscribe(listener)` is as written (`listener({ ok: true, tasks })` or `listener({ ok: false, reason: unreadable })`); additionally, when it reports unreadable, `TaskStorage` keeps that damaged text as unreadable data not yet backed up so that the next `save` backs it up first (BR6.9), and a later good read clears it.
- Contract C2 and C3 open questions: the second ("last save wins") is answered here as accepted [Q2]; the fourth (extra fields) is answered here as unreadable [Q3]. The first was answered in add-task; the third (rapid double submit) in add-task BR1.16.
- The unit definition lists the shape check, load and save failure results and all-or-nothing saving as U6 work; they were pulled into U1 (add-task) so that the first slice could save safely, as add-task's design already notes. This Unit keeps the tab refresh, the message block and the unusual cases.
- The notice is now shown in `MessageBar` above the add row (screens M8 and M9) with the "(!)" mark and as an alert; add-task showed it as plain page text below the add row with a status role.

## Assumptions & Open Questions

- [assumption] The browser's storage-change signal is the only way another tab is noticed; a tab that is not told (a browser that does not send it) simply does not refresh, and a reload shows the saved list.
- [assumption] The saved list is read again in full on each signal; no merge of the two lists is attempted (BR6.10).
- [assumption] The message that follows damage from another tab stays until the page is reloaded, like the one after a damaged load (BR6.9), even after a later good save here; this was not asked.
- [assumption] A signal about an unrelated storage key, or one that does not change the saved tasks, is ignored.
- Open question: whether a very large saved list (more than the browser's allowance) needs a message other than save-failed. Not decided; left as in add-task.
