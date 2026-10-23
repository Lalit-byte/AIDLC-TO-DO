# Frontend Components: storage-note (U8), Todo List Frontend (Phase 1)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Behaviour and rules: `functional-spec.md` in this folder (workflow W1, rules BR8.1 to BR8.5).
- Screens M1, M2 and M8 and the interaction spec: `aidlc/spaces/default/intents/261015-todo-frontend/inception/refined-mockups/mockups.md` and `interaction-spec.md`
- Component catalogue (`App`): `aidlc/spaces/default/intents/261015-todo-frontend/inception/domain-design/components.md`
- Team practices (one component per file, React functional components and hooks): `aidlc/spaces/default/intents/261015-todo-frontend/inception/practices-discovery/team-practices.md`

## Component hierarchy

No new component. The line is a fixed paragraph written in the page frame.

| Block | File | Change in this unit |
|-------|------|---------------------|
| App | `src/App.jsx` | Adds one paragraph with the text "Your tasks are saved in this browser only." directly under the title and before the message line |
| styles | `src/styles.css` | Adds the muted style for the line |

(Paths are relative to the `frontend/` folder.) No other block, hook or service is touched.

## Props, state and values

None: the line takes no input, holds no state and calls nothing.

## Look

- One line of muted text under the page title (screens M1, M2 and M8); it wraps if the page is narrow.
- No icon, no button, no animation.

## Interaction flows

| Flow | Steps |
|------|-------|
| Open the page | The line is shown under the title, with an empty list and with tasks |
| Anything else | Nothing changes the line |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Reading | Ordinary paragraph text, not a live region (BR8.4) |
| Contrast | The muted color `#6b7280` on the white card is at least 4.5 to 1 |
| Keyboard | No control to reach |
| Plain text | Fixed words, never markup |
| Test id | `data-testid` on the line for tests |

## Integration points

None. No storage function, no action, no network call.

## Assumptions & Open Questions

- [assumption] The line is a paragraph element, placed in the page frame between the title and the message line.
- Open question: none.
