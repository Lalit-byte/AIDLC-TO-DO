# Tech Stack Decisions: add-task (U1), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Stack already named in `docs/ARCHITECTURE.md` (React functional components and hooks, Vite, plain CSS, Vitest and React Testing Library) and in the team practices (JavaScript, Prettier, ESLint, 80% line coverage): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`
- Non-functional requirements NFR1 to NFR8: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md`
- Performance and security requirements of this Unit: `performance-requirements.md` and `security-requirements.md` in this folder.
- Answers recorded in `nfr-requirements-questions.md` in this folder, cited as [Q1] to [Q5].

Scope of this document: the technology choices this Unit's code will use and why. The first Unit creates the project, so these choices serve every later Unit too.

## Decisions

| Area | Choice | Why | Source |
|------|--------|-----|--------|
| Language | JavaScript (no TypeScript in phase 1) | Chosen in Practices Discovery; TypeScript may come in phase 2 | Team practices |
| UI library | React, functional components and hooks only, one component per file | Named in the initial description and the team practices | Initial description, team practices |
| Build and dev server | Vite | Named in `docs/ARCHITECTURE.md`; fast local server and a production build for the local build check | `docs/ARCHITECTURE.md`, Delivery Planning [Q5] |
| Styling | Plain CSS in files, using the colors and spacing in `docs/DESIGN.md` | Named in `docs/ARCHITECTURE.md`; no styling library is needed for one page | `docs/ARCHITECTURE.md` |
| State | One hook (`useTasks`); no global state library | ADR-004 and `docs/ARCHITECTURE.md` rejected Redux and Zustand as overkill | ADR-004 |
| Storage | The browser's local storage, only inside `src/services/` | Phase 1 has no server; phase 2 replaces only this service | NFR5, NFR6 |
| Test tools | Vitest and React Testing Library in a simulated browser; the accessibility check through axe in the component tests | Named in the team practices; axe added for NFR3 [Q4] | Team practices, [Q4] |
| Formatting and linting | Prettier and ESLint; both must pass | Team hard rule | Team practices |
| Versions | The current stable releases of React, Vite and the test tools at the time the project is created, fixed by the lock file [Q2] | Every developer gets the same versions; exact numbers are written into the lock file, not guessed here | [Q2] |
| Package manager | npm [Q3] | Comes with Node; nothing extra for developers who join | [Q3] |
| Node version | The current long-term-support release, recorded in the project files so every developer uses it | Keeps installs reproducible | [Q2] |
| Package checks | The package manager's vulnerability report before each merge, read but not blocking [Q5] | Cheap and local; no build server exists | [Q5], NFR5.3 |
| Browsers | Current Chrome, Edge, Firefox and Safari on desktop | NFR2 | NFR2.1 |
| Unique ids | The browser's built-in unique id maker, with a time-plus-random-text fallback where it is missing | Chosen in Functional Design [Q5 there]; the fallback covers pages opened over plain http on a network address | Functional design BR1.9 |

## Alternatives considered

| Choice | Alternative | Why not |
|--------|-------------|---------|
| Vite | Create React App; Next.js | Create React App is no longer maintained; Next.js adds a server, which phase 1 does not have |
| Plain CSS | A styling library or CSS-in-JS | More tools and more things to learn for one page; plain CSS is what the architecture file names |
| npm | pnpm | Faster, but each developer must install it first [Q3] |
| JavaScript | TypeScript | Decided in Practices Discovery; the shared task shape is described in the contracts instead |
| Local storage | IndexedDB | More code for a list of at most a few hundred small items; local storage is enough and simpler to keep all-or-nothing |

## Project files this Unit creates

- The package file and lock file, the Vite configuration, the entry page, the formatter and linter configuration, and the test configuration with a coverage report. Their exact names and contents belong to the Code Generation plan.

## Assumptions & Open Questions

- [assumption] "Current stable" means the latest stable release on the day the project is created, not a version fixed in this document. The lock file becomes the record.
- [assumption] The vulnerability report command is the package manager's own; no extra tool is installed for it.
- Open question: whether the current Node long-term-support release is installed on the machine that builds. Checked at the start of Code Generation.
- Open question: `docs/ARCHITECTURE.md` should be updated to list the title rules file and the axe test helper; the owner of that file makes the edit.
