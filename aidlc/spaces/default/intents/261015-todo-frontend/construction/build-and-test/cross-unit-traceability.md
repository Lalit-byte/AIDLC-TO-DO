# Cross-Unit Traceability: Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Enumerated from: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` (FR1 to FR9 with sub-IDs, NFR1 to NFR8) and `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/stories.md` (40 three-segment ACs).
- Coverage read from the nine per-unit files `aidlc/spaces/default/intents/261015-todo-frontend/construction/<unit>/code-generation/traceability.json`. No stage-level `construction/code-generation/traceability.json` exists (the workflow has Units).
- Supplementary (not part of the gate): `aidlc/spaces/default/intents/261015-todo-frontend/inception/user-stories/traceability.json` (FR and NFR to story).
- Target files were checked against the file list of `frontend/` (all targets named in `OK` entries exist).

## Verdict: FAIL

Rule applied: each enumerated ID must have status `OK` in at least one code-generation `traceability.json` entry whose target file exists.

| Group | Enumerated | Covered with `OK` | Uncovered |
|-------|-----------|-------------------|-----------|
| FR (FR1 to FR9, 41 IDs with parents) | 41 | 0 | 41 |
| NFR (NFR1 to NFR8) | 8 | 0 | 8 |
| AC (three-segment) | 40 | 36 | 4 |

Reasons:

1. FR and NFR IDs are never used as `id` in any code-generation `traceability.json`. The Units trace acceptance criteria (AC), business rules (BR) and, for add-task only, sub-requirements `NFR1.1` to `NFR8.2`. The parent `NFR1` to `NFR8` and every `FRn` and `FRn.m` are therefore uncovered by exact ID under this gate. This is a ledger-shape gap (the IDs are covered upstream by story, see below), not necessarily missing behaviour.
2. Four ACs have no `OK` entry anywhere (listed below).

## Uncovered IDs

### Acceptance criteria with no `OK` entry

| ID | Ledger entry | Evidence in the code (not counted as `OK`) |
|----|--------------|-------------------------------------------|
| AC2.1.2 | `complete-task`: `Deferred` (visual and contrast check pending, owner: human) | Muted line-through class exists; real rendering unverified (matrix TV-14, TV-10) |
| AC6.1.5 | `keep-tasks`: `pending` | Storage is each browser's own `localStorage`; second-browser run not done (matrix TV-28) |
| AC7.1.4 | `count-remaining`: `Deferred` | `filter-tasks` summary says the BR5.6 test in `App.test.jsx` closes it, but no `filter-tasks` entry carries AC7.1.4, so the ledger was not updated |
| AC9.1.1 | `empty-guidance`: `Deferred` (the "0 items left" half belongs to count-remaining) | `App.test.jsx` line 895 ("0 items left" on a first visit) passes; the ledger was not updated |

### FR and NFR IDs (all, by exact ID)

All of: FR1, FR1.1 to FR1.7, FR2, FR2.1 to FR2.3, FR3, FR3.1 to FR3.5, FR4, FR4.1 to FR4.3, FR5, FR5.1 to FR5.4, FR6, FR6.1 to FR6.5, FR7, FR7.1 to FR7.3, FR8, FR8.1, FR9, FR9.1, NFR1 to NFR8.

## Per-ID coverage: acceptance criteria

All 36 `OK` entries point at files that exist under `frontend/` (the add-task ledger writes paths relative to `frontend/`, the later Units prefix `frontend/`).

| Story | AC IDs | Status | Owning Unit | Target files |
|-------|--------|--------|-------------|--------------|
| US1.1 | AC1.1.1 to AC1.1.6 | all `OK` | add-task | `src/App.test.jsx`, `src/services/titleRules.js`, `src/hooks/useTasks.js`, `src/components/TaskItem.jsx` |
| US2.1 | AC2.1.1, AC2.1.3, AC2.1.4 `OK`; AC2.1.2 `Deferred` | 3 of 4 | complete-task | `src/hooks/useTasks.js`, `src/components/TaskItem.jsx`, `src/styles.css` (AC2.1.2 only) |
| US3.1 | AC3.1.1 to AC3.1.4 | all `OK` | delete-task | `frontend/src/App.test.jsx` |
| US4.1 | AC4.1.1 to AC4.1.5 | all `OK` | edit-task | `frontend/src/App.test.jsx`, `useTasks.js`, `TaskItem.jsx`, `TaskEditField.jsx`, `useTasks.test.jsx` |
| US5.1 | AC5.1.1 to AC5.1.5 | all `OK` | filter-tasks | `frontend/src/App.test.jsx` |
| US6.1 | AC6.1.1 to AC6.1.4, AC6.1.6 to AC6.1.8 `OK`; AC6.1.5 `pending` | 7 of 8 | keep-tasks | `frontend/src/App.test.jsx`, `taskStorage.test.js`, `taskStorage.js` |
| US7.1 | AC7.1.1 to AC7.1.3 `OK`; AC7.1.4 `Deferred` | 3 of 4 | count-remaining | `frontend/src/App.test.jsx`, `Counter.test.jsx` |
| US8.1 | AC8.1.1, AC8.1.2 | all `OK` | storage-note | `frontend/src/App.test.jsx` |
| US9.1 | AC9.1.2 `OK`; AC9.1.1 `Deferred` | 1 of 2 | empty-guidance | `frontend/src/App.test.jsx` |

## Per-ID coverage: NFR sub-IDs recorded by add-task

`NFR1.1` to `NFR1.5`, `NFR2.1`, `NFR3.1` to `NFR3.4`, `NFR4.1`, `NFR5.1` to `NFR5.3`, `NFR6.1`, `NFR7.1` to `NFR7.3`, `NFR8.1`, `NFR8.2` are all `OK` in `add-task/code-generation/traceability.json` (targets such as `src/App.test.jsx`, `src/hooks/useTasks.test.jsx`, `src/services/taskStorage.js`, `eslint.config.js`, `vite.config.js`, `package-lock.json`, `src/test/axe.js`; all exist). `NFR1.4` points at the add-task `code-summary.md`, which lists the manual Chrome timing as still open, so an `OK` in the ledger is not evidence that the manual check was done (matrix TV-04 is `Unverified`). The same applies to `NFR2.1` (`vite.config.js`; matrix TV-06 `Unverified`) and `NFR3.3` (`src/styles.css`; matrix TV-10 `Unverified`). These sub-IDs are not FR or NFR IDs of `requirements.md`, so they do not satisfy the gate.

## Supplementary: FR and NFR coverage by story (not counted by the gate)

`inception/user-stories/traceability.json` marks every FR and NFR `OK` against a story except NFR2 and NFR7, which it marks `Deferred` to build-and-test. Mapping from story to the Unit that built it: US1.1 add-task (FR1), US2.1 complete-task (FR2), US3.1 delete-task (FR4), US4.1 edit-task (FR3), US5.1 filter-tasks (FR5), US6.1 keep-tasks (FR6), US7.1 count-remaining (FR7), US8.1 storage-note (FR8), US9.1 empty-guidance (FR9). Build and Test results for NFR2 and NFR7: NFR7 is met by this stage (97.96% lines, 247 of 247 passing, matrix TV-21 to TV-23); NFR2 is `Unverified` (matrix TV-06).

## Findings to surface at the approval gate

1. Ledger gap: no code-generation `traceability.json` names any FR or NFR ID; the gate cannot be satisfied by exact ID without adding such entries (a ledger edit, not a code change).
2. AC2.1.2, AC6.1.5, AC7.1.4 and AC9.1.1 have no `OK` entry. AC7.1.4 and AC9.1.1 appear closed by passing tests and need only their ledger entries updated; AC2.1.2 and AC6.1.5 need real-browser checks.
3. This stage did not edit any `traceability.json`.

## Assumptions & Open Questions

- [assumption] The gate was applied literally (exact ID, status `OK`, in a code-generation ledger); the supplementary story mapping was reported but not counted.
- Open question: whether the owner wants FR and NFR IDs added to the per-unit ledgers (or the gate accepted via the story ledger) so the final gate can pass.
