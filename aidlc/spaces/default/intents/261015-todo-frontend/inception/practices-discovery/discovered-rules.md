# Discovered Rules

> Confirmed by the human in the interview. Source: `docs/RULES.md` (Code and Testing sections), hard-rule selections in Q7 and Q9. Other rules from `docs/RULES.md` (run the full test suite, no hardcoded secrets, no class components) stay as guidance in `team-practices.md`.

## Mandated

- ALWAYS keep all browser storage and network access inside `src/services/` (source: `docs/RULES.md`, Code; Q9).
- ALWAYS validate input at the boundary: trim the task title and enforce 1-200 characters (source: `docs/RULES.md`, Code; Q9).
- ALWAYS handle and surface errors rather than catching them silently (source: `docs/RULES.md`, Code; Q9).
- ALWAYS pass Prettier formatting and ESLint linting (source: `docs/RULES.md`, Code; Q9).

## Forbidden

- NEVER weaken a test to make it pass (source: `docs/RULES.md`, Testing; Q7).
