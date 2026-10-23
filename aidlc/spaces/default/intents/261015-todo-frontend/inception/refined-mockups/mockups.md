# Refined Mockups: Todo List Frontend (Phase 1, desktop)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Rough wireframes W1 to W7 and user flows: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/rough-mockups/`
- Requirements FR1 to FR9, NFR1 to NFR8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- User stories US1.1 to US9.1: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`
- Project design file `docs/DESIGN.md` (layout, colors, spacing, states), followed as written.
- Answers recorded in `refined-mockups-questions.md` in this folder, cited as [Q1] to [Q5].

These mockups refine the rough wireframes with real wording, spacing and the colors from `docs/DESIGN.md`. They are drawn in text, so proportions are approximate; the exact values are in `design-system-mapping.md`. They cover desktop only [Q2 of this stage; requirement NFR2].

## Page frame (all screens)

- One centered card on a light page, maximum width 600 px, 24 px padding inside the card, 8 px corner radius.
- Page background `#f5f5f7`; card `#ffffff`; body text `#1d1d1f` at 16 px in the system font.
- From top to bottom inside the card: title "Todo List", the browser-only line [Q5], the add row, the message area, the task list, the summary row (count and filters).

## Screens and states

| ID | State | Stories | Replaces |
|----|-------|---------|----------|
| M1 | Empty list (first visit) | US9.1, US8.1 | W1 |
| M2 | List with tasks | US1.1, US2.1, US5.1, US7.1, US8.1 | W2 |
| M3 | Add attempt with an empty title | US1.1 | W3 |
| M4 | Editing a task title | US4.1 | W4 |
| M5 | Delete dialog | US3.1 | W5 |
| M6 | Filter with no matching tasks | US5.1 | W6 |
| M7 | Long task title | US1.1, US4.1 | W7 |
| M8 | Saved tasks could not be loaded | US6.1 | new |
| M9 | A change could not be saved | US6.1 | new |

### M1. Empty list (first visit)

```
+----------------------------------------------------------+
|  Todo List                                       (h1)    |
|  Your tasks are saved in this browser only.      (muted) |
|                                                          |
|  [ What needs to be done?                   ]  [  Add  ] |
|                                                          |
|        No tasks yet. Add one above.             (muted) |
|                                                          |
|  ------------------------------------------------------  |
|  0 items left          [All*] [Active] [Completed]       |
+----------------------------------------------------------+
```

- The input has focus when the page opens. Add is the one filled (accent `#2563eb`) button.
- "All" is the chosen filter (the "*" marks the highlighted one); it is highlighted and exposed as pressed.

### M2. List with tasks

```
+----------------------------------------------------------+
|  Todo List                                               |
|  Your tasks are saved in this browser only.              |
|                                                          |
|  [ What needs to be done?                   ]  [  Add  ] |
|                                                          |
|  [ ] Buy milk                         [ Edit ] [ Delete ]|
|  [x] ~~Send invoice~~ (muted)         [ Edit ] [ Delete ]|
|  [ ] Book dentist                     [ Edit ] [ Delete ]|
|                                                          |
|  ------------------------------------------------------  |
|  2 items left          [All*] [Active] [Completed]       |
+----------------------------------------------------------+
```

- The newest task is at the top (FR1.2). A completed task is muted `#6b7280` with a line through it (FR2.2).
- The delete button reads "Delete" in words, not "x", so it cannot be mistaken for the checkbox (a rough-mockups finding).
- Edit is an outlined button; Delete is an outlined button with the danger color `#dc2626` text.

### M3. Add attempt with an empty title

```
|  [                                          ]  [  Add  ] |
|  (!) Please enter a task title.              (danger)    |
```

- The message sits directly under the add row, in danger color, with a "(!)" mark so color is not the only signal [Q3]. The same message is used when a title is empty after trimming (FR1.3, FR3.4).
- A title over 200 characters shows "Title must be 200 characters or fewer." in the same place and the typed text stays [Q3].
- Add stays enabled; the list is unchanged.

### M4. Editing a task title

```
|  [ ] [ Buy oat milk_______________ ]  [ Save ] [ Cancel ]|
|        Enter to save, Esc to cancel             (muted)  |
```

- The title becomes an input with the current text selected and focus in it (FR3.1). Enter saves (FR3.2) and Esc cancels (FR3.3).
- Save and Cancel buttons are added beside the field so the action is visible to mouse users; keyboard use is unchanged.
- Rejected saves show the M3 messages under the field (FR3.4).

### M5. Delete dialog [Q1]

```
+----------------------------------------------------------+
|  [ ] Buy milk                         [ Edit ] [ Delete ]|
|         +--------------------------------------+         |
|         | Delete this task?              (h2)  |         |
|         | "Buy milk"                           |         |
|         |        [ Cancel ]   [ Delete ]       |         |
|         +--------------------------------------+         |
|          (the page behind is dimmed)                     |
+----------------------------------------------------------+
```

- A small dialog over the list, with the rest of the page dimmed [Q1]. Cancel has focus first (FR4.1). Esc or Cancel closes it (FR4.3). Delete uses the danger color.
- The task's title is shown inside quotation marks and wraps if long.

### M6. Filter with no matching tasks

```
|  [ What needs to be done?                   ]  [  Add  ] |
|        No tasks match this filter.              (muted) |
|  ------------------------------------------------------  |
|  2 items left          [All] [Active] [Completed*]       |
```

- Drawn with Completed highlighted so the drawing matches the message (a rough-mockups finding). The count still shows every incomplete task (FR7.3).

### M7. Long task title

```
|  [ ] Renew the passport and book the     [ Edit ] [ Delete ]|
|      appointment with the consulate before                |
|      the end of the month, then email the                 |
|      confirmation to the whole family                     |
|  [ ] Buy milk                         [ Edit ] [ Delete ]|
```

- The title wraps over as many lines as it needs (up to 200 characters) and never makes the page scroll sideways or overlap the buttons; the buttons stay level with the first line.

### M8. Saved tasks could not be loaded [Q3]

```
|  Todo List                                               |
|  Your tasks are saved in this browser only.              |
|  (!) Your tasks could not be loaded.        (danger)     |
|  [ What needs to be done?                   ]  [  Add  ] |
|        No tasks yet. Add one above.                      |
|  0 items left          [All*] [Active] [Completed]       |
```

- Shown above the add row when saved data is unreadable (FR6.3). The list starts empty and the damaged data is left alone. The message stays until the page is reloaded.

### M9. A change could not be saved [Q4]

```
|  Todo List                                               |
|  (!) Your change could not be saved.        (danger)     |
|  [ What needs to be done?                   ]  [  Add  ] |
|  [ ] Buy oat milk                     [ Edit ] [ Delete ]|
|  1 item left           [All*] [Active] [Completed]       |
```

- The change stays on screen and the message appears above the add row [Q4]. It disappears when the next change is saved successfully. The change will be lost on reload, because it was never saved.

## Story coverage

| Story | Screens |
|-------|---------|
| US1.1 Add a task | M2, M3, M7 |
| US2.1 Complete or reopen | M2 |
| US3.1 Delete | M5 |
| US4.1 Edit | M4, M7 |
| US5.1 Filter | M2, M6 |
| US6.1 Keep tasks across reloads | M8, M9 |
| US7.1 Remaining count | M1, M2, M6 |
| US8.1 Know where tasks are kept | M1, M2, M8, M9 (the line is on every screen) |
| US9.1 Empty-list guidance | M1 |

## Not designed

- Phone and tablet layouts, and any layout narrower than a desktop window (requirement NFR2).
- A loading view: tasks are read from the browser as the page opens.
- Undo after delete, clear completed, due dates, tags, drag-and-drop (out of scope).

## Assumptions & Open Questions

- [assumption] Save and Cancel buttons are shown while editing (M4). The requirements only name Enter and Esc; adding the buttons is a design choice not asked of the user.
- [assumption] The failed-save message sits above the add row and disappears after the next successful save (M9). The requirements say a message is shown but not where or for how long.
- [assumption] The load-failure message stays until the page is reloaded (M8).
- [assumption] The dimmed page behind the dialog uses a black overlay at 40 percent opacity; `docs/DESIGN.md` has no color for this.
- Open question: the two situations the earlier reviews flagged (a tab acting on a task the other tab removed, and a rapid double submit) have no screen or behavior yet. Left for the owner.
- Open question: the dialog and the message area are components that `docs/ARCHITECTURE.md` does not list (it names TaskForm, TaskItem, TaskList, FilterBar, Counter). Left for Domain Design.
