# Build Instructions: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Project configuration read for this stage: `frontend/package.json`, `frontend/vite.config.js`, `frontend/eslint.config.js`, `frontend/.prettierrc`.
- Unit code summaries: `aidlc/spaces/default/intents/261015-todo-frontend/construction/*/code-generation/code-summary.md` (nine Units).
- Team practices: `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md` (local-only, no build server).

## Prerequisites

| Item | Value |
|------|-------|
| Node.js | 24.11 or newer (`engines` in `frontend/package.json`) |
| Package manager | npm (lock file `frontend/package-lock.json`) |
| Accounts, services, environment variables | None. Phase 1 is a browser-only app with no server and no secrets. |
| Project folder | `frontend/` (the app); the workspace root holds only the `aidlc/` and `docs/` folders. |

## Install

From the repository root, only when `frontend/node_modules` is missing:

```
npm install --prefix frontend
```

`npm install` may print a deprecation notice for ESLint 9.39.5; this is known (pinned to major 9 because `eslint-plugin-react` does not yet accept the newest major) and does not affect behaviour.

## Build

```
npm run build --prefix frontend
```

This runs `vite build` and writes `frontend/dist/` (one HTML file, one CSS file, one JS file). There is no environment-specific configuration.

## Build verification

1. The command exits with code 0 and prints the three files in `dist/`.
2. `npm run lint --prefix frontend` exits 0 with no output.
3. `npm run format:check --prefix frontend` reports "All matched files use Prettier code style!".
4. `npm audit --prefix frontend` reports `found 0 vulnerabilities` (read it before every merge; it does not block the merge).
5. Optional hand check: `npm run preview --prefix frontend` and open the printed address in a desktop browser.

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| `npm install` refuses an ESLint version | `eslint-plugin-react` peer range; keep ESLint on major 9 as pinned in `package.json`. |
| `npm run test` run from the repository root finds nothing | Use `--prefix frontend` or run from `frontend/`; the project is not at the root. |
| Node older than 24.11 warns about `engines` | Install the current Node release; the `engines` range was set to the installed version and may be loosened by the owner. |
| `Port in use` on `vite preview` | Pass `-- --port <number>`. |
| Build output stale | Delete `frontend/dist/` and build again. |

## Assumptions & Open Questions

- [assumption] The build runs on a developer machine only; there is no build server (team practices), so "CI execution before merge" is met by running these commands locally.
- Open question: whether the owner wants a looser `engines` range than `>=24.11.0` (carried from the add-task code summary).
