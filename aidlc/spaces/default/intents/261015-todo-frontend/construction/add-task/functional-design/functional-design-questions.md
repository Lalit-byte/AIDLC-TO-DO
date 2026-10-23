# Functional Design Questions: add-task (U1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Unit definition: `aidlc/spaces/default/intents/261015-todo-frontend/inception/units-generation/unit-of-work.md` (U1 add-task, story US1.1)
- Requirements FR1.1 to FR1.7, FR6.1, FR6.2, NFR1, NFR4, NFR6: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Component catalogue and decisions ADR-001 to ADR-006: `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md` and `decisions.md`
- Contracts C1 to C5 and their open questions: `aidlc/spaces/default/intents/261015-todo-frontend/inception/contract-design/contract-summary.md`
- Refined screens M1 to M9: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md`
- Bolt plan (decisions settled here before U1 is coded, [Q4] of Delivery Planning): `aidlc/spaces/default/intents/261015-todo-frontend/inception/delivery-planning/bolt-plan.md`

Context: add-task is the first slice. It builds the page, the state hook, the saving and loading of tasks in the browser, and the title rules. Most behaviour is already fixed by earlier answers. The questions below are only what is still open and what changes how the first slice is built. Delivery Planning asked for U6's two open decisions to be settled here, so Questions 1 and 2 are those.

## Question 1: What happens on screen when a save fails?

Contract C4 says a change stays on screen when saving fails, and the next successful save writes the whole list, so the earlier change can be saved then. The refined screen M9 says that change "will be lost on reload". These two disagree: with the contract's rule, a later successful save would quietly keep it.

A. Keep it on screen and let the next successful save write it too. The warning stays until a save works. Simple and never loses what the person sees, but it contradicts M9's "lost on reload" wording, which would be reworded.
B. Take the change back off the screen when its save fails, so the list on screen always matches what is saved. The person sees the message and tries again.
C. Keep it on screen, but when a later save succeeds, write only the later change and drop the failed one. Rejected as hard to explain.
X. Other (please specify)

[Answer]: A

## Question 2: After saved data could not be read, may a save replace it?

If the saved data is damaged, the app shows the load-failure message and starts with an empty list (FR6.3 says to leave the damaged data as it is). When the person then adds a task, saving it would write a new list over the damaged data. U1's first save must follow one rule.

A. Refuse to save until the page is reloaded or the browser data is cleared; show the same message. Keeps the damaged data exactly as it is (FR6.3), but the person cannot add tasks in that session.
B. Let the first successful save replace the damaged data. The person can keep working, but the damaged data is lost, which goes against FR6.3.
C. Before replacing, copy the damaged text to a second storage name (a backup) and then save the new list. The person can keep working and nothing is lost, but the original name no longer holds it, so FR6.3 would be reworded to "kept as a backup".
X. Other (please specify)

[Answer]: C

## Question 3: Where do the title rules live in the code?

The title rules (trim spaces, 1 to 200 characters) are inside the storage service by decision ADR-002 [Q2 of Domain Design]. Phase 2 replaces the storage service with one that calls a backend, which would take the rules with it. The open question was whether to keep them in a small separate file of their own inside the same services folder.

A. A separate rules file in `src/services/` that the storage service calls, and that the add form and edit field can also use to check a title before saving. The rules survive the phase 2 swap, and there is one place to test them.
B. Inside the storage service's own file, as the catalogue says. One file fewer, but the phase 2 swap must carry the rules.
X. Other (please specify)

[Answer]: A

## Question 4: Where does focus go after a task is added?

Requirement FR1.7 clears the input after an add; the assumption in the requirements (A1) that focus stays in the input is not yet confirmed. Keyboard-only use (AC1.1.1) depends on it.

A. Focus stays in the add input, ready for the next title.
B. Focus moves to the new task in the list.
X. Other (please specify)

[Answer]: A

## Question 5: How is each task's id made?

Contract C1 says the state hook assigns each task a unique id when it is added. An id must be unique, stay the same after reloads, and be a plain text value (phase 2 mirrors it).

A. The browser's built-in unique id maker (`crypto.randomUUID`). Standard and collision-free; it works on the local development address and in current desktop Chrome, Edge, Firefox and Safari.
B. The current time in milliseconds plus a random piece of text, made by the app. Works anywhere, but two adds in the same millisecond depend on the random piece.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

- [assumption] The saved list is stored under one name, `todo-app.tasks`, as proposed in contract C2; not asked.
- [assumption] A rapid double submit adds exactly one task, because the add input is cleared in the same step as the add; a second submit then sees an empty input and shows the empty-title message. No extra rule is added for it.
- [assumption] The input has focus when the page opens, as drawn in M1.
- [assumption] U1 shows tasks in display form only (the title as plain text); the checkbox, Edit and Delete buttons arrive in their own Units.

## Consolidated Summary Confirmation

- A failed save keeps the change on screen, and the next successful save writes it too; the "lost on reload" wording of screen M9 is changed to match (Q1: A).
- After saved data could not be read, the first save copies the damaged text to a backup storage name and then saves the new list; requirement FR6.3 ("leave the damaged data as it is") is reworded to "kept as a backup" (Q2: C).
- The title rules live in their own file in `src/services/`, called by the storage service and usable by the forms (Q3: A).
- Focus stays in the add input after a task is added (Q4: A).
- Each task id comes from the browser's built-in unique id maker, `crypto.randomUUID` (Q5: A).

- Looks correct
- Request changes

[Answer]: Looks correct
