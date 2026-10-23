# Requirements: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Intent statement: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/intent-capture/intent-statement.md`
- Scope document and intent backlog: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/scope-definition/`
- Feasibility artifacts (constraint register C-T1 to C-Q1, RAID log R1 to R5): `aidlc/spaces/default/intents/261015-todo-frontend/ideation/feasibility/`
- Wireframes W1 to W7 and user flows 1 to 6: `aidlc/spaces/default/intents/261015-todo-frontend/ideation/rough-mockups/`
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Project documents: `docs/PRD.md` (original feature list and pass/fail checks), `docs/DESIGN.md`, `docs/ARCHITECTURE.md` (data shape).
- Answers recorded in `requirements-analysis-questions.md` in this folder, cited as [Q1] to [Q7].

## Intent analysis

People in the general public need a simple, fast way to capture tasks and track what is done (intent statement). Phase 1 delivers this as a frontend that runs in the browser on a desktop, keeps each person's tasks in their own browser, and is finished in 7 calendar days with no budget. The backend is phase 2 and is not part of these requirements.

Depth: Standard. Type: new project. Scope: a single screen with seven features.

Numbering: the seven features keep the order and meaning of `docs/PRD.md` FR-1 to FR-7. In this document they are numbered FR1 to FR7 (and FR1.1, FR1.2 and so on), and these IDs are permanent from here on. FR8 and FR9 are new in this stage; their origin is stated against each.

## Functional requirements

### FR1. Add a task (PRD FR-1)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR1.1 | The app shall let a person add a task by entering a title of 1 to 200 characters, after leading and trailing spaces are removed. | A title of 1 character and a title of 200 characters are both added; each is shown without the leading and trailing spaces. | PRD FR-1; scope document |
| FR1.2 | A newly added task shall appear at the top of the list. | After adding "B" to a list that holds "A", the list shows "B" above "A". | PRD FR-1 |
| FR1.3 | The app shall reject an empty title, or a title of only spaces, and show the message "Please enter a task title." under the input, leaving the list unchanged. | Submitting an empty input and a spaces-only input adds nothing and shows the message. | PRD FR-1; wireframe W3 |
| FR1.4 | The app shall reject a title longer than 200 characters after trimming, show a message that it must be 200 characters or fewer, keep what the person typed, and leave the list unchanged. | A 201-character title adds nothing, shows the message and keeps the typed text. | PRD FR-1; user flow 1 |
| FR1.5 | Pressing Enter in the add input shall add the task exactly as the Add button does. | Typing a title and pressing Enter adds one task; pressing Add with the same input adds one task. | [Q7] |
| FR1.6 | The app shall allow two tasks with the same title. | Adding "Buy milk" twice results in two separate tasks. | [Q6] |
| FR1.7 | After a task is added, the input shall be cleared and ready for the next title. | The input is empty after a successful add. | User flow 1; see assumption A1 |

### FR2. Mark a task complete or incomplete (PRD FR-2)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR2.1 | The app shall let a person mark a task complete or incomplete with a checkbox. | Ticking the checkbox marks the task complete; unticking marks it incomplete. | PRD FR-2 |
| FR2.2 | A complete task shall look different from an incomplete one by more than color alone (muted text with a line through it). | A complete task shows a line through its title and muted color; it is distinguishable in grayscale. | PRD FR-2; `docs/DESIGN.md`; wireframe W2 |
| FR2.3 | Changing a task's complete state shall not change its position in the list. | Ticking the second of three tasks leaves it second. | User flow 2; see assumption A2 |

### FR3. Edit a task title (PRD FR-3)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR3.1 | The app shall let a person edit a task's title in place, by pressing Edit. | Pressing Edit turns the title into an editable field holding the current title, with focus in it. | PRD FR-3; wireframe W4 |
| FR3.2 | Pressing Enter shall save the edited title. | After changing the text and pressing Enter, the list shows the new title. | PRD FR-3 |
| FR3.3 | Pressing Esc shall cancel the edit and keep the old title. | After changing the text and pressing Esc, the list shows the old title. | PRD FR-3 |
| FR3.4 | The app shall apply the same title rules as FR1.1, FR1.3 and FR1.4 when saving an edit, showing the same messages and keeping the task unchanged. | Saving an empty title or a 201-character title is rejected with the matching message. | Wireframe W4; user flow 3 |
| FR3.5 | A saved edit shall keep the task's position and complete state. | Editing the second of three tasks leaves it second and in its previous complete state. | User flow 3 |

### FR4. Delete a task (PRD FR-4)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR4.1 | Pressing Delete on a task shall ask "Delete this task?" and show the task's title, with Cancel and Delete choices; Cancel shall be the choice that has focus first. | Pressing Delete shows the question and the title; nothing is removed yet. | Rough Mockups answer (delete asks first); wireframe W5 |
| FR4.2 | Choosing Delete shall remove the task from the list and from the saved tasks. | After choosing Delete and reloading, the task is not shown. | PRD FR-4 |
| FR4.3 | Choosing Cancel or pressing Esc shall close the question and keep the task. | After Cancel or Esc, the task is still in the list. | Wireframe W5 |

### FR5. Filter the list (PRD FR-5)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR5.1 | The app shall offer the filters All, Active and Completed, showing only the matching tasks. | With one active and one complete task, All shows 2, Active shows 1, Completed shows 1. | PRD FR-5 |
| FR5.2 | The current filter shall be clearly marked, visually and for screen readers. | The selected filter button is highlighted and exposed as pressed. | `docs/DESIGN.md`; wireframe W6 |
| FR5.3 | When the chosen filter matches no task, the list area shall show "No tasks match this filter." | With no complete task, choosing Completed shows that message. | `docs/DESIGN.md`; wireframe W6 |
| FR5.4 | After a page reload, the filter shall be All. | Choose Active, reload, and All is selected. | [Q4] |

### FR6. Keep tasks across reloads (PRD FR-6)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR6.1 | The app shall keep each person's tasks in their own browser so they are shown again after the page is reloaded or the browser is reopened. | Add two tasks, reload, and both are shown. | PRD FR-6; intent statement |
| FR6.2 | After a reload, tasks shall appear in the same order with the same complete state and the same title. | Add tasks, complete one, reload: order and states are unchanged. | PRD FR-6 |
| FR6.3 | If saved tasks cannot be read, or a change cannot be saved, the app shall show a clear message, start with an empty list when the saved data is unreadable, and leave the damaged data as it is. | With the saved data replaced by invalid text, opening the app shows the message and an empty list; the invalid text is still in storage. When saving is blocked, a change shows the message. | [Q2]; RAID R2 |
| FR6.4 | When the app is open in two tabs of the same browser, a change in one shall appear in the other. | Add a task in tab 1 and it appears in tab 2 without a reload. | [Q3] |
| FR6.5 | Tasks shall not be shared between browsers, devices or people; there are no accounts. | Tasks added in one browser are not shown in another. | Intent statement; constraint register C-O3 |

### FR7. Show how many tasks remain (PRD FR-7)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR7.1 | The app shall show the number of tasks that are not complete, in the form "N items left". | With three tasks of which one is complete, the line reads "2 items left". | PRD FR-7; `docs/DESIGN.md` |
| FR7.2 | The count shall read "1 item left" for one task and "0 items left" for none. | The wording is singular at 1 and "0 items left" at 0. | Wireframes W1 and W3 |
| FR7.3 | The count shall update after every add, complete or un-complete, delete and reload, and shall not depend on the chosen filter. | The count is the same under All, Active and Completed. | PRD FR-7; wireframe W6 |

### FR8. Tell people where their tasks are kept (new in this stage)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR8.1 | The page shall always show a short line saying tasks are saved in this browser only, such as "Your tasks are saved in this browser only". | The line is visible with an empty list and with a full list. | [Q5]; RAID risk R2; user flow 6 open question |

### FR9. Empty list guidance (new in this stage)

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| FR9.1 | When there are no tasks at all, the list area shall show "No tasks yet. Add one above." | A new visit shows that message, and the count reads "0 items left". | `docs/DESIGN.md`; wireframe W1 |

## Non-functional requirements

| ID | Requirement | Pass/fail check | Origin |
|----|-------------|-----------------|--------|
| NFR1 | Adding, completing or un-completing, and deleting a task shall each show their result in under 100 ms, for a list of up to 100 tasks. | Measured in the supported browsers with a list of 100 tasks, each action shows its result in under 100 ms. | Intent statement success metric; [Q1]; RAID R3 |
| NFR2 | The app shall work in the current versions of Chrome, Edge, Firefox and Safari on a desktop. Phones, tablets and older browsers are not supported in phase 1. | The seven features pass their checks in each of those four browsers. | Feasibility and Scope Definition answers (desktop only); constraint register C-T3 |
| NFR3 | Every control shall be reachable and usable by keyboard, with a visible focus ring; every input shall have a visible label or an accessible name; status shall never be shown by color alone; text contrast shall be at least 4.5 to 1. | Using only the keyboard, a person can add, complete, edit, delete and filter; an automated accessibility scan reports no contrast or missing-name failures. | Feasibility accessibility answer (sensible defaults); `docs/DESIGN.md`; constraint register C-Q1 |
| NFR4 | Task titles shall always be shown as plain text, so that text containing HTML tags or other markup is displayed as typed and never run. | Adding a title of `<b>x</b>` shows those characters literally. | Corner checklist (text, markup) |
| NFR5 | Phase 1 shall send no task data anywhere outside the browser. | Using the app produces no network requests carrying task data. | Constraint register C-R1; RAID R5 |
| NFR6 | A task shall keep the shape agreed in `docs/ARCHITECTURE.md` (id, title, complete state, created time, updated time), so phase 2 can mirror it without changing the screen. | Saved tasks contain exactly those five fields. | `docs/ARCHITECTURE.md`; PRD phase 2 outline |
| NFR7 | Tests shall cover at least 80% of lines, and the full test suite shall pass before every merge. | A coverage report shows 80% or more of lines covered; the suite is green. | Team practices (Testing Posture); org rule for `mvp` scope |
| NFR8 | A change shall be saved completely or not at all, so a failed save never leaves a half-saved list. | A simulated failure while saving leaves the previously saved tasks readable. | Corner checklist (storage and state) |

## Constraints

- Frontend only; no server in phase 1 (constraint register C-T1).
- Built in basic React, in JavaScript (initial description; team practices).
- Desktop browsers only; runs locally; no cloud accounts; no budget (C-T3, C-T4, C-O2).
- Finish within 7 calendar days (C-O1, scope answer).
- No accounts or login; each browser keeps its own tasks (C-O3).
- Browser storage and network access are kept inside the storage service folder `src/services/` (affirmed hard rule in team practices).

## Assumptions

- A1. [assumption] After a task is added, focus stays in the add input. Not confirmed by the user.
- A2. [assumption] Completing a task does not move it down or away; a completed task keeps its position (FR2.3). Not confirmed by the user.
- A3. [assumption] All on-screen messages use the wording in the wireframes, which is draft wording; final wording is set in Refined Mockups.
- A4. [assumption] There is no maximum number of tasks. The 100 ms target is checked up to 100 tasks (NFR1); beyond that the app still works but no speed target is promised.
- A5. [assumption] Browsers that block storage entirely (for example strict private modes) are handled by FR6.3, not by a separate requirement.
- A6. [assumption] The delete question is shown as a small dialog over the list (wireframe W5), not inline next to the task. Not confirmed by the user.

## Out of scope

- Due dates and reminders, tags or categories, drag-and-drop ordering (intent statement).
- User accounts and login; sharing tasks between people or devices (intent statement).
- Phones, tablets and older browsers (NFR2).
- Public launch and hosting (scope document).
- Offline sync, clearing all completed tasks, undo after delete (`docs/PRD.md` and wireframes do not include them).
- The backend, which is phase 2.

## Open questions

- What "deployed" means for phase 1 is unresolved: the team practices keep the space default (staging on every merge) although phase 1 runs only locally with no staging target. Owner: the project owner. Left for Delivery Planning.
- `docs/DESIGN.md` still says the page must be usable at 320px width, which conflicts with NFR2 (desktop only). Owner: the person who maintains `docs/DESIGN.md`. Left for Refined Mockups.
- Whether the delete question is a dialog or sits inline next to the task (A6). Left for Refined Mockups.
- Whether to keep the PRD numbering (FR-1 to FR-7) in `docs/PRD.md` beside these IDs (FR1 to FR9). Left for the owner of `docs/PRD.md`.
