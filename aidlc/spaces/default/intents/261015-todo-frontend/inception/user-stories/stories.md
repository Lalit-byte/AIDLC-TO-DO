# User Stories: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Requirements (FR1 to FR9, NFR1 to NFR8): `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Persona: `personas.md` in this folder (Casey, the everyday task keeper).
- Scope document and intent backlog (build order): `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/`
- Wireframes and user flows: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/rough-mockups/`
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Answers recorded in `user-stories-questions.md` in this folder, cited as [Q1] to [Q4].

## How the stories are organized

One story per requirement group [Q2], grouped by feature in the build order of the intent backlog [Q4]: add, complete, delete, edit, filter, keep, count, then the two small additions. Every story is Must Have [Q3] because all features are required for phase 1 success. Casey is the only persona [Q1].

## Story map

| Order | Story | Requirement group | Priority | Depends on |
|-------|-------|-------------------|----------|-----------|
| 1 | US1.1 Add a task | FR1 | Must Have | none |
| 2 | US2.1 Complete or reopen a task | FR2 | Must Have | US1.1 |
| 3 | US3.1 Delete a task | FR4 | Must Have | US1.1 |
| 4 | US4.1 Edit a task title | FR3 | Must Have | US1.1 |
| 5 | US5.1 Filter the list | FR5 | Must Have | US1.1, US2.1 |
| 6 | US6.1 Keep tasks across reloads | FR6 | Must Have | US1.1 |
| 7 | US7.1 See how many tasks remain | FR7 | Must Have | US1.1, US2.1 |
| 8 | US8.1 Know where tasks are kept | FR8 | Must Have | none |
| 9 | US9.1 Be guided when the list is empty | FR9 | Must Have | US1.1 |

The thin end-to-end slice agreed in Practices Discovery is US1.1 (add a task and see it in the list). The MVP boundary is decided in Delivery Planning; every story here is above the line today.

## US1.1 Add a task (FR1)

As Casey, I want to add a task by typing a title, so that I can capture it before I forget it.

Priority: Must Have.

Acceptance criteria:

- AC1.1.1: Given the add input has focus, when I type "Buy milk" and press Enter or Add, then a task titled "Buy milk" appears at the top of the list, the input is empty, and this works using only the keyboard.
- AC1.1.2: Given the add input is empty or holds only spaces, when I press Enter or Add, then the message "Please enter a task title." appears under the input and the list is unchanged.
- AC1.1.3: Given I have typed 201 characters, when I press Add, then a message says the title must be 200 characters or fewer, my text is kept, and no task is added; and given I type exactly 200 characters, the task is added.
- AC1.1.4: Given a task titled "Buy milk" exists, when I add "Buy milk" again, then the list holds two separate tasks with that title.
- AC1.1.5: Given I type the text `<b>x</b>` as a title, when I add it, then the characters are shown exactly as typed and nothing is rendered as markup.
- AC1.1.6: Given a list of 100 tasks, when I add a task, then the new task is shown in under 100 ms.

INVEST notes: independent (first in the build order); valuable (nothing else works without it); small enough for one change although it carries six criteria; testable through the criteria above.

## US2.1 Complete or reopen a task (FR2)

As Casey, I want to tick a task as done and untick it again, so that I can see what is finished and what is left.

Priority: Must Have.

Acceptance criteria:

- AC2.1.1: Given an incomplete task, when I tick its checkbox, then the task is marked complete, and when I untick it, it is incomplete again.
- AC2.1.2: Given a complete task, when I look at the list, then its title is muted and has a line through it, so it can be told apart without relying on color.
- AC2.1.3: Given three tasks, when I tick the second, then it stays second in the list.
- AC2.1.4: Given a task checkbox has focus, when I press Space, then the task toggles, and the change is shown in under 100 ms with a list of 100 tasks.

INVEST notes: depends on US1.1 only to have a task to tick; valuable (the core purpose of tracking what is done); small; testable.

## US3.1 Delete a task (FR4)

As Casey, I want to delete a task I no longer need after being asked to confirm, so that my list stays clean without losing a task by accident.

Priority: Must Have.

Acceptance criteria:

- AC3.1.1: Given a task titled "Buy milk", when I press its Delete button, then the question "Delete this task?" appears with the title "Buy milk", Cancel has focus first, and the task is still in the list.
- AC3.1.2: Given the question is showing, when I choose Delete, then the task is removed from the list, and after a reload it is still gone.
- AC3.1.3: Given the question is showing, when I choose Cancel or press Esc, then the question closes and the task stays in the list.
- AC3.1.4: Given a list of 100 tasks, when I confirm a delete using only the keyboard, then the task is removed in under 100 ms.

INVEST notes: independent of the other actions once US1.1 exists; valuable; small; testable.

## US4.1 Edit a task title (FR3)

As Casey, I want to correct a task's title in place, so that I can fix a mistake without deleting and re-adding the task.

Priority: Must Have.

Acceptance criteria:

- AC4.1.1: Given a task, when I reach its Edit button by keyboard or mouse and activate it, then the title becomes an editable field holding the current title and focus is in it.
- AC4.1.2: Given I am editing, when I change the text and press Enter, then the new title is saved and shown.
- AC4.1.3: Given I am editing, when I change the text and press Esc, then the old title stays.
- AC4.1.4: Given I am editing, when I try to save an empty or spaces-only title, or a title of 201 characters, then the same message as when adding appears and the task is unchanged.
- AC4.1.5: Given a complete task that is second in the list, when I save an edit, then it is still second and still complete.

INVEST notes: depends on US1.1; valuable; small; testable.

## US5.1 Filter the list (FR5)

As Casey, I want to show only active or only completed tasks, so that I can focus on what matters now.

Priority: Must Have.

Acceptance criteria:

- AC5.1.1: Given one active and one complete task, when I choose All, Active and Completed in turn, then the list shows 2, 1 and 1 tasks respectively.
- AC5.1.2: Given a filter is chosen, when I look at the filter buttons, then the chosen one is highlighted and is marked as pressed for screen readers.
- AC5.1.3: Given no task matches the chosen filter, when the list is shown, then it reads "No tasks match this filter."
- AC5.1.4: Given I chose Active and reload the page, when the page opens, then the filter is All.
- AC5.1.5: Given the filter buttons, when I use only the keyboard, then I can reach and choose each one and see which is chosen.

INVEST notes: depends on US1.1 and US2.1 for tasks with both states; valuable; small; testable.

## US6.1 Keep tasks across reloads (FR6)

As Casey, I want my tasks to still be there when I reload or come back, and to be told if they cannot be kept, so that I can trust the list.

Priority: Must Have.

Acceptance criteria:

- AC6.1.1: Given I have added two tasks and completed one, when I reload the page, then both tasks appear in the same order with the same titles and states.
- AC6.1.2: Given the saved tasks are damaged and cannot be read, when I open the app, then a clear message tells me, the list is empty, and the damaged data is left as it is.
- AC6.1.3: Given saving is blocked or fails, when I add a task, then a clear message tells me the change could not be saved.
- AC6.1.4: Given the app is open in two tabs of the same browser, when I add a task in one tab, then it appears in the other without a reload.
- AC6.1.5: Given I opened the app in a different browser or on a different device, when it loads, then none of my tasks from the first browser are shown.
- AC6.1.6: Given a save fails part way, when I reload, then the tasks saved before are still readable and no half-saved list appears.
- AC6.1.7: Given saved tasks, when I inspect one, then it holds exactly an id, a title, a complete state, a created time and an updated time.
- AC6.1.8: Given I use the app, when I watch network activity, then no task data is sent anywhere outside the browser.

INVEST notes: depends on US1.1; valuable (trust in the list); larger than the INVEST ideal because it carries eight criteria; it can be split in Units Generation if the build needs it [Q2].

## US7.1 See how many tasks remain (FR7)

As Casey, I want to see how many tasks are still to do, so that I know how much is left at a glance.

Priority: Must Have.

Acceptance criteria:

- AC7.1.1: Given three tasks of which one is complete, when I look at the list summary, then it reads "2 items left".
- AC7.1.2: Given exactly one task is incomplete, when I look at the summary, then it reads "1 item left"; and given none is incomplete, it reads "0 items left".
- AC7.1.3: Given I add, complete, un-complete or delete a task, or reload the page, when the change is made, then the count is updated to match.
- AC7.1.4: Given a mix of tasks, when I switch between All, Active and Completed, then the count does not change.

INVEST notes: depends on US1.1 and US2.1; valuable; small; testable.

## US8.1 Know where tasks are kept (FR8)

As Casey, I want to be told that my tasks are saved in this browser only, so that I am not surprised when they are missing in another browser.

Priority: Must Have.

Acceptance criteria:

- AC8.1.1: Given the list is empty, when the page is shown, then a line such as "Your tasks are saved in this browser only" is visible.
- AC8.1.2: Given the list has tasks, when the page is shown, then the same line is still visible.

INVEST notes: independent; valuable (addresses the risk that tasks vanish when browser data is cleared); small; testable.

## US9.1 Be guided when the list is empty (FR9)

As Casey, I want a short hint when I have no tasks, so that I know what to do first.

Priority: Must Have.

Acceptance criteria:

- AC9.1.1: Given I open the app for the first time, when the page is shown, then the list area reads "No tasks yet. Add one above." and the summary reads "0 items left".
- AC9.1.2: Given I delete my last task, when the list becomes empty, then the same hint appears.

INVEST notes: depends on US1.1 only for the add flow it points to; valuable; small; testable.

## Coverage of the non-functional requirements

| Requirement | Where it is covered |
|-------------|--------------------|
| NFR1 under 100 ms | AC1.1.6, AC2.1.4, AC3.1.4 |
| NFR2 desktop browsers | Checked across Chrome, Edge, Firefox and Safari when all stories are verified in Build and Test |
| NFR3 keyboard and visible status | AC1.1.1, AC2.1.2, AC2.1.4, AC3.1.4, AC4.1.1, AC5.1.2, AC5.1.5 |
| NFR4 titles shown as plain text | AC1.1.5 |
| NFR5 no task data leaves the browser | AC6.1.8 |
| NFR6 task keeps the agreed shape | AC6.1.7 |
| NFR7 80% line coverage and passing suite | Checked in Build and Test, not by a story |
| NFR8 save is all or nothing | AC6.1.6 |

## Assumptions & Open Questions

- [assumption] "The list summary" in AC7.1.1 is the line below the list shown in the wireframes; its exact position is set in Refined Mockups.
- [assumption] All messages use the draft wording from the requirements; final wording is set in Refined Mockups.
- [assumption] The acceptance criteria for a story's keyboard use cover only the actions of that story; they do not repeat the whole keyboard requirement.
- Open question: the two unusual situations the requirements review raised (a tab editing or deleting a task the other tab removed, and a rapid double submit that must add exactly one task) are not yet acceptance criteria. They were not decided in Requirements Analysis. Left for the owner to settle at the gate or in Units Generation.
- Open question: whether US6.1, with eight criteria, should be split into smaller stories (keeping, failure handling, two tabs). Left for Units Generation.
