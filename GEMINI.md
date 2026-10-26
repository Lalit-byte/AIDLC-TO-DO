# GEMINI.md - Project Context & Workflow Guidelines

## Project Overview
This project is a React-based Todo List frontend built using **AI-DLC (AI-Driven Development Life Cycle)**. The repository uses shared documentation as the source of truth across all developer and AI sessions.

---

## Core Knowledge & Project Documents

Before starting work on any task, always consult these essential documents:

- **[docs/RULES.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/RULES.md)**: Coding, architecture, and testing standards.
- **[docs/TASKS.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/TASKS.md)**: The task board. Lists pending, in-progress, and completed units.
- **[docs/MEMORY.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/MEMORY.md)**: Dated log of project decisions and completed milestones.
- **[docs/PRD.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/PRD.md)**: Requirements, user scope, and acceptance criteria.
- **[docs/ARCHITECTURE.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/ARCHITECTURE.md)**: System architecture, stack definitions, and `Task` data shape.
- **[docs/DESIGN.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/DESIGN.md)**: Design system tokens, accessibility, and visual guidelines.
- **[FLOW.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/FLOW.md)** & **[DEVELOPER-GUIDE.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/DEVELOPER-GUIDE.md)**: Multi-developer git workflow and task execution steps.

---

## AI-DLC Task Execution Lifecycle

When picking up or implementing a task:
1. **Check State**: Read `docs/MEMORY.md` and `docs/TASKS.md`.
2. **Claim the Task**: Claim ONE task whose dependencies are completed by marking its status as `in-progress (Name)` in `docs/TASKS.md`.
3. **Check the Unit Design**: Review the unit's specifications under:
   `aidlc/spaces/default/intents/261015-todo-frontend/construction/<unit>/functional-design/`
4. **Strict File Boundaries**: Edit *only* the files assigned to that task in `docs/TASKS.md`. Do not touch unrelated files.
5. **Quality Checks**: Run tests and linting from `frontend/`:
   - `npm test` (all tests must pass; 80%+ line coverage floor)
   - `npm run lint`
   - `npm run format:check`
   - `npm run build`
6. **Complete & Record**:
   - Set the task status to `done` in `docs/TASKS.md`.
   - Append one dated entry to `docs/MEMORY.md` describing what was implemented.
   - Update `docs/ARCHITECTURE.md` if any structural changes were introduced.

---

## Coding & Architectural Rules

- **React Architecture**: Functional components and hooks only (no class components). One component per file with PascalCase filenames. Custom hooks must start with `use`.
- **Service Isolation**: Browser storage (`localStorage`) and network requests (`fetch`/`axios`) live **strictly** within `frontend/src/services/`. Components and hooks must never access storage or network APIs directly.
- **Validation**: Validate input at the boundary. Task titles must be trimmed and between 1–200 characters (enforced via `frontend/src/services/titleRules.js`).
- **Data Shape**: The task object shape is fixed: `{ id, title, completed, createdAt, updatedAt }`. Do not alter this shape without approval.
- **Error Handling**: Surface errors gracefully to the UI; no silent `catch` blocks.
- **Accessibility**: All interactive elements must support keyboard navigation and have visible focus rings. Text contrast must meet a 4.5:1 ratio.
- **Testing**: Vitest + React Testing Library. Include happy-path plus at least 2 edge/error cases for every component or service function. Use accessibility tests (`frontend/src/test/axe.js`).
