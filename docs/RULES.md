# RULES

> Coding and working rules for every developer and every Claude session. Short on purpose (loaded every session).

## Code
- React functional components and hooks only; no class components.
- One component per file, PascalCase file names; hooks start with `use`.
- Never access localStorage or the network outside `frontend/src/services/`.
- Validate input at the boundary (task title: trim, 1-200 chars).
- No hardcoded secrets; use environment variables.
- Handle and surface errors; no silent catches.
- Format with Prettier, lint with ESLint; both must pass.

## Testing
- Every new component/hook gets tests: happy path plus at least two edge/error cases.
- Run the full test suite before marking a task done. Never weaken a test to make it pass.

## Working with AI-DLC and Claude
- Before starting: read MEMORY.md and TASKS.md, then pick ONE task. Do not start work that is not in TASKS.md.
- Claim a task by setting its status to `in-progress` with your name in TASKS.md before editing code.
- Stay inside the files listed on the task. Need another file? Add it to the task first.
- After finishing: set the task to `done`, add a dated line to MEMORY.md, update ARCHITECTURE.md if structure changed.
- Do not edit PRD.md or the data shape without owner approval.
- Keep context small: read only files you need; do not paste large files into chat.

## Git (once git is enabled)
- Trunk-based: short-lived branch per task, squash-merge to `main`.
- Pull `main` before starting a task.
