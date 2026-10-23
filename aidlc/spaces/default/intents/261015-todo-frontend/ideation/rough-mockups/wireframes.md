# Wireframes: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Scope document and intent backlog: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/` (FR-1 to FR-7, desktop browsers only, accessibility at sensible defaults).
- Project design file: `docs/DESIGN.md`, followed as written [Q1].
- Answers recorded in `rough-mockups-questions.md` in this folder, cited as [Q1] to [Q5].

These are low-fidelity sketches of structure and wording, not final visuals. Colors, spacing and type sizes come from `docs/DESIGN.md` and are not repeated here.

## Screen inventory

The app is one page with no navigation [Q1]. It has seven states, drawn below. Each is tied to the feature it shows.

| ID | State | Shows feature |
|----|-------|---------------|
| W1 | Empty list (first visit) | FR-1, FR-6 |
| W2 | List with tasks | FR-1, FR-2, FR-5, FR-7 |
| W3 | Add attempt with an empty title | FR-1 |
| W4 | Editing a task title | FR-3 |
| W5 | Delete confirmation | FR-4 |
| W6 | Filter with no matching tasks | FR-5 |
| W7 | Long task title | FR-1, FR-3 |

## Information hierarchy

1. Page title: "Todo List"
2. Add a task: the input and the Add button (the one primary action)
3. The task list
4. Summary line: remaining count and the All / Active / Completed filter

## W1. Empty list (first visit)

```
+--------------------------------------------------------+
|  Todo List                                             |
|                                                        |
|  [ What needs to be done?                 ]  [ Add ]   |
|                                                        |
|     No tasks yet. Add one above.                       |
|                                                        |
|  ----------------------------------------------------  |
|  0 items left        [All] [Active] [Completed]        |
+--------------------------------------------------------+
```

- Notes: the empty message tells the person what will appear and what to do next. Wording is from `docs/DESIGN.md`. The count reads "0 items left".
- Accessibility: heading level h1 "Todo List"; landmark main; keyboard entry point is the input, which has focus on page load.

## W2. List with tasks

```
+--------------------------------------------------------+
|  Todo List                                             |
|                                                        |
|  [ What needs to be done?                 ]  [ Add ]   |
|                                                        |
|  [ ] Buy milk                           [Edit]  [x]    |
|  [x] Send invoice (struck through)      [Edit]  [x]    |
|  [ ] Book dentist                       [Edit]  [x]    |
|                                                        |
|  ----------------------------------------------------  |
|  2 items left        [All] [Active] [Completed]        |
+--------------------------------------------------------+
```

- Notes: the newest task is at the top of the list (FR-1). A completed task is muted and struck through, so status is never shown by color alone (FR-2). The "All" button is highlighted for the current filter. The count updates after every change (FR-7). The "[x]" at the right is the delete button; its visible label should read "Delete" in the later visual design, so it is not mistaken for the complete checkbox.
- Accessibility: h1 "Todo List"; landmarks: main, with the list as a list region and the filter buttons as a labeled group; keyboard entry point is the input, then Tab moves through each task's checkbox, Edit and Delete, then the filter buttons. Every control has a visible focus ring.
- Long lists: the whole page scrolls and the input scrolls away with it [Q5]. The count and filter line sit below the list.

## W3. Add attempt with an empty title

```
+--------------------------------------------------------+
|  Todo List                                             |
|                                                        |
|  [                                         ]  [ Add ]  |
|   ! Please enter a task title.                         |
|                                                        |
|  [ ] Buy milk                           [Edit]  [x]    |
|  ----------------------------------------------------  |
|  1 item left         [All] [Active] [Completed]        |
+--------------------------------------------------------+
```

- Notes: the message appears under the input, in red with the "!" mark so color is not the only signal. Add stays enabled and the list is unchanged. Text the person already typed is kept. A title over 200 characters gets a similar message, such as "Title must be 200 characters or fewer."
- Accessibility: h1 "Todo List"; the message is announced to screen readers when it appears; keyboard focus stays in the input.

## W4. Editing a task title

```
+--------------------------------------------------------+
|  Todo List                                             |
|                                                        |
|  [ What needs to be done?                 ]  [ Add ]   |
|                                                        |
|  [ ] [ Buy oat milk____________ ]  Enter=save Esc=cancel|
|  [x] Send invoice (struck through)      [Edit]  [x]    |
|                                                        |
|  ----------------------------------------------------  |
|  1 item left         [All] [Active] [Completed]        |
+--------------------------------------------------------+
```

- Notes: the title becomes an editable field in place. Enter saves and Esc cancels (FR-3). The hint is shown while editing. Saving an empty title is rejected with the same message as W3.
- Accessibility: h1 "Todo List"; focus moves into the edit field when editing starts and returns to the task's Edit button when it ends; keyboard entry point is the Edit button.

## W5. Delete confirmation

```
+--------------------------------------------------------+
|  Todo List                                             |
|                                                        |
|  [ ] Buy milk                           [Edit]  [x]    |
|        +--------------------------------------+        |
|        |  Delete this task?                   |        |
|        |  "Buy milk"                          |        |
|        |        [ Cancel ]   [ Delete ]       |        |
|        +--------------------------------------+        |
|                                                        |
+--------------------------------------------------------+
```

- Notes: deleting asks first [Q3] because removal is permanent in phase 1 (FR-4). The message names the task. Choosing Delete removes it from the list and from storage; Cancel closes the message and leaves the task. Esc also cancels.
- Accessibility: the message is a dialog with the heading "Delete this task?" (h2); keyboard focus is held inside it and starts on Cancel, the safer choice; focus returns to the task's Delete button when it closes.

## W6. Filter with no matching tasks

```
+--------------------------------------------------------+
|  Todo List                                             |
|                                                        |
|  [ What needs to be done?                 ]  [ Add ]   |
|                                                        |
|     No tasks match this filter.                        |
|                                                        |
|  ----------------------------------------------------  |
|  2 items left        [All] [ACTIVE*] [Completed]       |
+--------------------------------------------------------+
```

- Notes: shown when, for example, Completed is chosen and nothing is completed yet. Wording is from `docs/DESIGN.md`. The "*" stands for the highlighted current filter. The count still shows all remaining active tasks, not only the visible ones.
- Accessibility: h1 "Todo List"; the current filter button is marked as pressed for screen readers; keyboard entry point is the filter group.

## W7. Long task title

```
+--------------------------------------------------------+
|  Todo List                                             |
|                                                        |
|  [ ] Renew the passport and book the    [Edit]  [x]    |
|      appointment with the consulate                    |
|      before the end of the month, then                 |
|      email the confirmation to the family             |
|  [ ] Buy milk                           [Edit]  [x]    |
+--------------------------------------------------------+
```

- Notes: the full title wraps onto as many lines as it needs [Q4], up to the 200 characters allowed (FR-1). The Edit and Delete buttons stay on the right of the first line and do not move with the text.
- Accessibility: h1 "Todo List"; the title is the accessible name of its checkbox, so the whole title is announced; keyboard entry point is the checkbox.

## Not drawn

- Loading state: tasks are read from the browser at start, so no loading view is expected in phase 1.
- Phone and tablet layouts: out of scope for phase 1 [Q2]. `docs/DESIGN.md` still says "usable at 320px width", which no longer matches the scope decision; see the open question below.
- Sign-in, settings, due dates, tags and drag-and-drop: out of scope.

## Assumptions & Open Questions

- [assumption] The delete confirmation is drawn as a small dialog over the list; an inline "Delete? Yes / No" next to the task is an equally valid choice that the user has not picked.
- [assumption] The delete button is relabelled "Delete" in later visual design, because "[x]" in the layout from `docs/DESIGN.md` looks like a close mark and is easily confused with the complete checkbox.
- [assumption] "Error" wording in W3 ("Please enter a task title.") is a draft; final wording is set in Refined Mockups.
- Open question: `docs/DESIGN.md` says the page must be usable at 320px width, which conflicts with the desktop-only decision [Q2]. Who updates `docs/DESIGN.md`, and when? Left for the owner of that file.
