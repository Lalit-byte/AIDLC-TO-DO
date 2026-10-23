<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-23T05:59:18Z [unit delete-task] — read "the task that took the deleted task's place" (Q1: A) as: next row down, and the row above when the deleted row was last; the answer only named the empty list for the no-successor case.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-10-23T05:59:18Z [unit delete-task] — wrote no entities.md or rules.md: the unit is `ui` kind and, as in complete-task, the BR3.x rules sit in functional-spec.md with traceability pointing at them.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-23T05:59:18Z [unit delete-task] — Q2: A (built-in dialog element) keeps the code small and accessible; the cost is a small stand-in for open and close calls in tests. Focus return on Cancel is set explicitly by App so tests and real browsers behave the same.

- 2026-10-23T06:38:27Z [unit edit-task] — Q3: A (only one task edited at a time) needs the page to know which task is being edited, so the edit id is held by App and passed down; contract C5 gets an additive change (editingId, onStartEdit, onEndEdit) listed for its owner. The typed text stays local to the row, as the catalogue says.

- 2026-10-23T07:30:00Z [unit empty-guidance] — Q1: A (hint also shows beside the load-failed notice) keeps the rule to `hasTasks` alone; the "0 items left" part of AC9.1.1 is left to the count unit (U7) because the count line does not exist yet.

- 2026-10-23T09:50:00Z [unit keep-tasks] — most of U6 (shape check, backup, failure notices, all-or-nothing saving) was already built in add-task, so the spec marks those rules "built in add-task" and covers only the tab refresh, the MessageBar block and the three open edge cases; Q1 to Q3 were all answered A (keep list on damage from another tab, last save wins, extra fields are damage).

- 2026-10-23T10:15:00Z [unit storage-note] — no real question was open (position and words were fixed by the mockups and FR8.1), so the questions file holds only the design basis and the summary confirmation; the person confirmed it. Screen M9 omits the line but FR8.1 says always, so the spec shows it there too.

- 2026-10-23T10:40:00Z [unit count-remaining] — as with storage-note, wording, position and behaviour were fixed by the requirements and mockups, so the questions file holds only the design basis and the confirmation; the count part of AC9.1.1 left by empty-guidance is delivered here (BR7.5).

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-23T06:38:27Z [unit edit-task] — where the add form's two refusal messages live so the row and the form share one copy; left to the Code Generation plan.
