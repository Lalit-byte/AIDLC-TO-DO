# DEVELOPER GUIDE

> How to pick up and finish a task on the Todo List frontend (phase 1). Read this once, then keep `docs/RULES.md` open while you work.

## Before you start (one time)

1. Get access to the GitHub repository and clone it.
2. Install dependencies: `npm install`
3. Check that everything passes on your machine: `npm test` (all tests must pass before you change anything).
4. Open the folder in Claude Code if you want help. The project rules are loaded from `.claude/` and `docs/RULES.md`.
5. Read, in this order: `docs/MEMORY.md` (what has been decided), `docs/TASKS.md` (the board), `docs/RULES.md` (how we code), `docs/DESIGN.md` (how it looks), `docs/ARCHITECTURE.md` (how it is built).

## How a task is assigned

- The lead puts your name on a row in `docs/TASKS.md`, for example `in-progress (Priya)`, and lists the files you will touch.
- Do not start work that has no row, or a row with someone else's name.
- Need a file that is not on your row? Ask the lead to add it first. Several tasks edit the same files, so this is how we avoid clashes.
- Your task's design is in `aidlc/spaces/default/intents/261015-todo-frontend/construction/<unit>/functional-design/` (for example `construction/delete-task/functional-design/functional-spec.md`). The user stories and acceptance criteria are in `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md`. If your Unit has no design there yet, tell the lead and wait: the design comes first.

## Doing the task

1. Update your local `main`: `git checkout main` then `git pull`.
2. Make a short branch named after your task: `git checkout -b u3-delete-task`.
3. Build the task. Follow the rules below.
4. Write tests as you go (see Testing).
5. Before every push, run all four checks and make sure each one passes:
   - `npm test`
   - `npm run lint`
   - `npm run format:check` (fix with `npm run format`)
   - `npm run build`
6. Push your branch: `git push -u origin u3-delete-task`.
7. Open a pull request on GitHub. Say which task it is, what you changed, and which acceptance criteria it covers.
8. Keep your branch short-lived: merge within one to two days. Pull `main` into your branch often so conflicts stay small.

## Rules that are checked automatically

These come from `docs/RULES.md` and the project's lint rules. A pull request that breaks them will not be merged.

- React functional components and hooks only. One component per file, PascalCase file names, hooks start with `use`.
- Browser storage and network calls live only in `frontend/src/services/`. Components and hooks never touch `localStorage` or `fetch` (lint fails if they do).
- Titles are trimmed and must be 1 to 200 characters. Validation happens in `frontend/src/services/titleRules.js`.
- Show titles as plain text. Never insert raw HTML (lint fails if you do).
- Handle and show errors. No silent `catch`.
- No secrets in the code.
- The task shape is fixed: `id`, `title`, `completed`, `createdAt`, `updatedAt`. Do not change it without the owner's approval.
- Prettier formatting and ESLint must pass.

## Testing

- Every new component, hook or service function gets a happy-path test plus at least two edge or error cases.
- Tests use Vitest and React Testing Library. Examples are next to the code (`*.test.js`, `*.test.jsx`).
- Test the keyboard path for every control, and check accessibility with the existing axe helper in `frontend/src/test/axe.js`.
- The coverage floor is 80% of lines. Never lower it, and never weaken or skip a test to make a check pass. If a check fails, fix the cause or tell the lead.
- Run the whole suite, not only your tests, before you push.

## Accessibility and look

- Every control must work with the keyboard and show a visible focus ring.
- Never show a state by colour alone (for example, completed tasks also get a line through the title).
- Use the colours and spacing in `docs/DESIGN.md`. Text contrast must be at least 4.5 to 1.

## When your pull request is merged

- The lead squash-merges it, so your task becomes one commit on `main`.
- The lead sets your row in `docs/TASKS.md` to `done` and adds a dated line to `docs/MEMORY.md`.
- Pull `main` again before you pick up the next task.

## What you do not touch

- Do not edit `docs/PRD.md` or the task shape without owner approval.
- Do not edit the `aidlc/` folder or `.claude/` unless the lead asks you to. The `aidlc/` files record the workflow for the whole team; two people changing them at once causes conflicts. The lead keeps them up to date.

## Which task can I take?

Finished and merged: U1 add-task, U2 complete-task. The rest can be taken in any order, but give one person at a time to Units that edit the same files:

| Unit | What it does | Touches |
|------|--------------|---------|
| U3 delete-task | Delete with a confirmation dialog | TaskItem, App, useTasks, a new DeleteDialog |
| U4 edit-task | Edit a title in place | TaskItem, useTasks |
| U6 keep-tasks | Load and save failures, damaged data, two-tab sync | taskStorage, useTasks, a new MessageBar, App |
| U5 filter-tasks | All / Active / Completed | a new FilterBar, useTasks, TaskList |
| U7 count-remaining | "N items left" | a new Counter, useTasks |
| U8 + U9 | "Saved in this browser only" line, empty-list message | App, TaskList |

U6 changes the storage service, so only one person should work on it at a time.

## Getting help

- Ask the lead if a rule or design is unclear.
- If you use Claude Code, tell it which task you were given and ask it to read `docs/RULES.md` and your Unit's design first.
- If a check fails and you cannot see why, copy the output into your pull request and ask. Do not change the check.
