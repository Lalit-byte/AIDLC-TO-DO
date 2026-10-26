---
name: aidlc
description: AI-DLC workflow assistant for running lifecycle stages, claiming tasks, and tracking progress in the Todo List project.
---

# AI-DLC Assistant for Antigravity

This skill helps navigate and execute tasks under the AI-Driven Development Life Cycle (AI-DLC) in this repository.

## Quick Status & Inspection Commands
- Run `aidlc --status` in terminal to check the active AI-DLC stage and intent.
- Run `aidlc --doctor` to validate the environment configuration.

## Task Claiming & Execution Steps
1. Consult [docs/TASKS.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/TASKS.md) to find the next available task whose dependencies are satisfied.
2. Update the row to `in-progress (<YourName>)`.
3. Check the functional design specification in `aidlc/spaces/default/intents/261015-todo-frontend/construction/<unit>/functional-design/functional-spec.md`.
4. Implement the changes strictly within the files listed in `docs/TASKS.md`.
5. Run tests from `frontend/`:
   ```bash
   cd frontend
   npm test
   npm run lint
   npm run build
   ```
6. Set the task to `done` in `docs/TASKS.md` and append a dated log entry in [docs/MEMORY.md](file:///c:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/docs/MEMORY.md).
