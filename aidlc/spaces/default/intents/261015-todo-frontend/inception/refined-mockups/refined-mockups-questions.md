# Refined Mockups Questions

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Rough wireframes and user flows: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/rough-mockups/` (W1 to W7, flows 1 to 6).
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` (FR1 to FR9, NFR1 to NFR8, open items on the 320px conflict and dialog versus inline delete).
- User stories: `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md` (US1.1 to US9.1).
- Project design file: `docs/DESIGN.md` (single centered page, colors, spacing, states, accessibility; followed as written).

Already answered earlier and not asked again: follow `docs/DESIGN.md`, desktop only, delete asks first, long titles wrap, whole page scrolls, filter resets to All, accessibility at sensible defaults (keyboard use, visible focus, labels, contrast), the design-system question (there is no component library; `docs/DESIGN.md` is the design system).

The questions below settle the open design items the earlier stages left for this stage.

## Q1. How should the "Delete this task?" question appear?

Wireframe W5 drew a small dialog over the list. An inline question that replaces the task's buttons is the other common choice.

A. A small dialog over the list, with the list dimmed behind it
B. Inline: the task's Edit and Delete buttons are replaced by "Delete this task?  [Cancel] [Delete]" on the task's own row
X. Other (please specify)

[Answer]: A

## Q2. How should the 320px line in `docs/DESIGN.md` be handled, given phase 1 is desktop only?

`docs/DESIGN.md` says the page must be usable at 320px width (phone size), which conflicts with the desktop-only decision (requirement NFR2). This is one of the open items carried from Requirements Analysis.

A. The desktop-only decision wins for phase 1: the mockups cover desktop only, and I list the 320px line as an edit you make to `docs/DESIGN.md`
B. The desktop-only decision wins for phase 1, and you want me to change the 320px line in `docs/DESIGN.md` myself now
C. The 320px line wins: add a phone-width mockup after all (this changes the desktop-only decision)
X. Other (please specify)

[Answer]: A

## Q3. Is the draft wording of the messages final?

The requirements gave draft wording for two messages and left the third open:

- Empty title: "Please enter a task title."
- Title too long: "Title must be 200 characters or fewer."
- Tasks cannot be loaded or saved (not yet worded): "Your tasks could not be loaded." and "Your change could not be saved."

A. Yes; use this wording as final
B. Use this wording, with changes I will describe (please specify)
X. Other (please specify)

[Answer]: A

## Q4. When saving a change fails, what should the person see?

A save can fail if browser storage is full or blocked. The requirements say a clear message is shown (FR6.3) but not whether the change stays on screen. This is a gap the requirements review pointed out.

A. The change stays on screen with the message "Your change could not be saved", and it will be lost on reload
B. The change is undone, so the list matches what is saved, and the message says the change could not be saved
X. Other (please specify)

[Answer]: A

## Q5. Where should the line "Your tasks are saved in this browser only" go?

It is always visible (requirement FR8.1). The position was left open in the user stories.

A. Directly under the page title, above the add box
B. At the bottom of the card, below the count and filter line
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
