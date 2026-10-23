# Evidence

## Inspected

- `.claude/aidlc-common/stages/inception/practices-discovery.md`: stage steps and artifact requirements.
- `aidlc/spaces/default/memory/org.md` and `phases/inception.md`: space defaults for the five areas. `team.md` and `project.md` are empty templates, so there was no prior affirmed baseline.
- `docs/RULES.md`: code, testing, working-with-AI, and git rules (trunk-based, squash-merge once git is enabled; Prettier and ESLint; test expectations).
- `docs/ARCHITECTURE.md`: stack (React, Vite, plain CSS, Vitest and React Testing Library), layout, `taskStorage.js` as the only storage touchpoint.
- `docs/PRD.md`: FR-1 to FR-7, phase split, under-100 ms response metric.
- `ideation/scope-definition/scope-document.md` and `ideation/feasibility/constraint-register.md`: local run, 7 calendar days, no budget, no cloud, desktop only, scope `mvp`.
- Workspace state: Git is not initialised (not a git repository). No source code exists yet, so none was inspected.
- Participants: the lead (this agent) only; no contribution files. The human supplied all confirmations through the interview file `practices-discovery-questions.md`.

## Inferred

- The org-default branching and merge practice matches what `docs/RULES.md` already states for the future Git setup.
- Testing tooling is Vitest and React Testing Library per project docs.
- Deployment: the space default (staging on merge, manual production approval) has no target in phase 1.
- The coverage floor comes from the `mvp` scope default in org.md.

## Interview decisions

- Q1: D. Git, several developers will join, trunk-based with short-lived branches squash-merged into `main`.
- Q2: A. Build the thin end-to-end slice first (add a task and see it in the list, FR-1). No autonomy choice recorded; that is asked in Construction.
- Q3: A. Test-after (methodology confirmed by the human).
- Q4: A. Keep the 80% floor; run the full tests locally before each merge (no CI server).
- Q5: C. Not sure what "deployed" means for phase 1.
- Q6: B. TypeScript with Prettier and ESLint (superseded by Q10).
- Q7: H. "Never weaken a test to make it pass" is a hard rule (the first group of rules was unreadable and re-asked in Q9).
- Q8: B. Leave deployment unrecorded; the space default stays in effect.
- Q9: A, B, C, D. Hard rules: storage and network inside `src/services/`, input validation at the boundary, handle and surface errors, pass Prettier and ESLint.
- Q10: B. Keep JavaScript; TypeScript may come in phase 2. This is the final language decision.
- Consolidated summary: "Looks correct".

## Remaining uncertainty

- Deployment conflict (unresolved): the space default of deploy-on-merge to staging cannot be met, because phase 1 runs locally with no cloud accounts or budget and no staging target exists. The human did not define what "deployed" means (Q5 C, Q8 B).
- Git is not initialised; trunk-based practice cannot take effect until a repository is created.
- Prettier and ESLint config files do not exist yet and must be created in Construction.
- Adding a free CI server later is not decided; until then the local full-suite run is the merge gate.
- Whether TypeScript is adopted in phase 2 is open.
- The Construction autonomy choice is not yet made.
