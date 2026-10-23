# User Flow: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Scope document and intent backlog: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/`
- Wireframes: `wireframes.md` in this folder, screens W1 to W7.
- Answers recorded in `rough-mockups-questions.md` in this folder, cited as [Q1] to [Q5].

## Who and where they start

Persona: a member of the general public who wants to note and track tasks in the browser, using a current desktop browser [Q2]. They have no account and nothing is shared; their tasks live in their own browser (intent statement).

Entry point: opening the page. First visit shows W1; a return visit shows W2 with the tasks from last time (FR-6).

## Core flow (happy path)

```
Open page
   |
   v
[W1 empty / W2 list]
   |
   +--> Type a title --> Add ----------------------> task appears at top   (FR-1)
   |
   +--> Tick checkbox ------------------------------> task done / not done  (FR-2)
   |
   +--> Edit --> change title --> Enter ------------> title updated         (FR-3)
   |
   +--> Delete --> confirm ------------------------> task removed           (FR-4)
   |
   +--> All / Active / Completed ------------------> list narrows           (FR-5)
   |
   +--> Reload the page ---------------------------> same tasks still there (FR-6)

Every change above updates "N items left"                                    (FR-7)
```

## Flow 1: Add a task (FR-1)

Persona: member of the public. Trigger: wants to note something to do.

1. W1 or W2 -> types a title in the input -> text appears in the input.
2. -> presses Add or Enter -> the task appears at the top of the list, the input clears, the count goes up by one.

Success outcome: the new task is the first item in the list.

Error paths:
- Title empty or only spaces -> W3 message "Please enter a task title." -> type a title and try again; the list is unchanged.
- Title longer than 200 characters -> message that it must be 200 characters or fewer -> shorten it; what was typed is kept.

## Flow 2: Complete or reopen a task (FR-2)

Trigger: finished (or reopens) a task.

1. W2 -> ticks the checkbox -> the task is muted and struck through, the count goes down by one.
2. -> unticks it -> the task returns to normal, the count goes up by one.

Success outcome: the list and the count agree about what is done.

Error paths: none expected.

## Flow 3: Edit a task title (FR-3)

Trigger: a title has a mistake or has changed.

1. W2 -> presses Edit -> W4, the title becomes an editable field with focus.
2. -> changes the text and presses Enter -> the new title is saved and shown.

Success outcome: the task keeps its place and its done/not done state.

Error paths:
- Presses Esc -> the change is discarded and the old title stays.
- Saves an empty title -> the same message as W3 -> type a title or press Esc.

## Flow 4: Delete a task (FR-4)

Trigger: a task is no longer needed.

1. W2 -> presses Delete on a task -> W5 asks "Delete this task?" and names it [Q3].
2. -> chooses Delete -> the task is removed from the list and from the browser's saved tasks, and the count updates.

Success outcome: the task is gone, including after a reload.

Error paths:
- Chooses Cancel or presses Esc -> the message closes and the task stays.

## Flow 5: Filter the list (FR-5)

Trigger: wants to see only some tasks.

1. W2 -> presses Active or Completed -> the list shows only matching tasks and that button is highlighted.
2. -> presses All -> the whole list returns.

Success outcome: the visible tasks match the chosen filter; the count is unchanged.

Error paths:
- Nothing matches -> W6 "No tasks match this filter." -> choose All or add or complete a task.

## Flow 6: Return later (FR-6)

Trigger: closes the tab or reloads the page and comes back.

1. Opens the page again in the same browser -> W2 shows the same tasks in the same order, with the same done state.

Success outcome: nothing was lost.

Error paths:
- A different browser, a private window, or cleared browser data -> W1 empty list, because each browser keeps its own tasks (intent statement). This is risk R2 in the RAID log; the interface and the documentation say so plainly.

## Assumptions & Open Questions

- [assumption] Pressing Enter in the add input behaves like pressing Add. The project requirements only describe Enter for saving an edit (FR-3), so this is a default the user has not confirmed.
- [assumption] The warning for "browser data cleared" is shown only in documentation, not as a screen in the app. Not confirmed by the user.
- Open question: should the page show a short note such as "Your tasks are saved in this browser only" for first-time visitors (risk R2)? Left for Requirements Analysis.
