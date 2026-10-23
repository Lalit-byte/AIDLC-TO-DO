# Team Practices

> Confirmed by the human in the practices-discovery interview (Q1-Q10). Where a practice is still open, it is marked as unresolved.

## Way of Working

- Version control is Git. Several developers will join the project (Q1: D).
- Trunk-based development: one `main` trunk, short-lived branch per task resolved in 1-2 days, squash-merge into `main` so each task or Bolt is one commit. This is the org default (`aidlc/spaces/default/memory/org.md`) and matches `docs/RULES.md` "Git (once git is enabled)": pull `main` before starting a task.
- Prerequisite: Git is not yet initialised in this folder (not a git repository). It must be set up (`git init`, first commit on `main`) before this practice takes effect.

## Walking Skeleton

- Yes: build the thin end-to-end slice first, then the other features (Q2: A). The slice is adding a task and seeing it in the list (FR-1).
- The slice is verified by a human-authorized command before later Units. No autonomy choice is recorded here; it is asked separately when Construction starts.

## Testing Posture

- **Methodology**: test-after
- **Ordering**: Write each testable layer (component, hook, storage service), then write and run that layer's tests before moving to the next layer.
- **Methodology evidence**: Human confirmed in the interview (Q3: A).
- Tooling (`docs/ARCHITECTURE.md`, `docs/RULES.md`): Vitest and React Testing Library.
- Coverage floor (org.md, `mvp` scope; Q4: A): 80% line coverage. Not to be weakened to pass a step.
- No automated build server exists (no cloud accounts, no budget), so the full test suite is run locally before every merge. This is how "CI execution before merge" is met for now. Adding a free CI server later is not decided.
- Test content (`docs/RULES.md`, matches construction guardrails): each new component or hook gets the happy path plus at least two edge or error cases; run the full suite before marking a task done (guidance, not a hard rule).

## Deployment

- No deployment practice was recorded (Q8: B). The space default stays in effect: deploy on merge to a staging environment, with a separate manual approval for production (`aidlc/spaces/default/memory/org.md`).
- Unresolved conflict: phase 1 runs locally only, with no cloud accounts and no budget (constraint register C-T4, C-O2; scope out-of-scope "Public launch and hosting"). No staging target exists, so the space default cannot be carried out as written. No deployment target is invented here. The human must decide what "deployed" means for phase 1 (or when hosting is revisited with phase 2).

## Code Style

- Language: JavaScript. The human first chose TypeScript (Q6: B), then chose "Keep JavaScript" (Q10: B) after seeing that `docs/ARCHITECTURE.md` names `taskStorage.js`. Q10 is the final decision. TypeScript may come in phase 2.
- Formatting with Prettier and linting with ESLint; both must pass (`docs/RULES.md`, Q9).
- React functional components and hooks only (guidance from `docs/RULES.md`, not a hard rule).
- One component per file, PascalCase file names, hooks start with `use`.
- Prettier and ESLint config files do not exist yet and must be created in Construction.
