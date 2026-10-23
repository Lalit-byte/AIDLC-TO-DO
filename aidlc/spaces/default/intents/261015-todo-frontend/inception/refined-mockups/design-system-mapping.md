# Design System Mapping: Todo List Frontend (Phase 1, desktop)

## Sources

- [desc] Initial description: "Todo list frontend using basic React (phase 1 of 2; backend comes in phase 2)"
- [scope] Workflow-selected scope: `mvp`.
- Project design file `docs/DESIGN.md` (colors, spacing, font, states), followed as written.
- Mockups and interaction spec: `mockups.md` and `interaction-spec.md` in this folder.
- Requirements: `aidlc/spaces/default/intents/261015-todo-frontend/inception/requirements-analysis/requirements.md` (NFR3).
- Answers recorded in `refined-mockups-questions.md` in this folder, cited as [Q1] to [Q5].

There is no component library to align with; `docs/DESIGN.md` is the project's design system, and these mockups use it as written. Contrast ratios below are calculated from the hex values using the standard WCAG formula and are approximate to one decimal; Build and Test confirms them with a tool.

## Tokens used (from `docs/DESIGN.md`)

| Token | Value | Used for |
|-------|-------|----------|
| Font | System font stack, base 16 px | All text |
| Page background | `#f5f5f7` | Area outside the card |
| Card | `#ffffff` | The card and the dialog |
| Text | `#1d1d1f` | Titles, labels, headings |
| Accent | `#2563eb` | Add button, focus ring, chosen filter |
| Danger | `#dc2626` | Delete button text, error messages |
| Muted | `#6b7280` | Completed titles, hints, the browser-only line, empty messages |
| Spacing | 4, 8, 16, 24 px | Gaps and padding |
| Card radius | 8 px | Card and dialog |

## Token needed that is not in `docs/DESIGN.md`

| Token | Proposed value | Used for | Status |
|-------|----------------|----------|--------|
| Overlay | black at 40 percent opacity | Dimmed page behind the delete dialog [Q1] | Proposed; the owner of `docs/DESIGN.md` adds it |
| Focus ring | 2 px solid accent `#2563eb`, 2 px offset | Every focusable control | Stated in `docs/DESIGN.md` as "visible focus ring" without a value; value proposed here |

## Component to token mapping

| Component | Element | Tokens |
|-----------|---------|--------|
| Page | Title "Todo List" | Text, 24 px spacing below |
| Page | Browser-only line [Q5] | Muted, 8 px spacing |
| TaskForm | Input | Card background, 1 px border in muted, Text; focus ring |
| TaskForm | Add button | Accent fill, white text |
| TaskForm / TaskItem | Error message | Danger text with a "(!)" mark |
| TaskItem | Title | Text; completed: Muted with a line through |
| TaskItem | Edit button | Outlined, Text |
| TaskItem | Delete button | Outlined, Danger text |
| TaskList | Empty messages | Muted |
| FilterBar | Buttons | Outlined; chosen: accent border and bold text |
| Counter | "N items left" | Muted |
| DeleteDialog | Panel | Card background, 8 px radius; Delete in Danger; Overlay behind |
| MessageBar | Message | Danger text with a "(!)" mark |

## Contrast check (NFR3: text at least 4.5 to 1)

| Pair | Ratio (approx.) | Result |
|------|-----------------|--------|
| Text `#1d1d1f` on card `#ffffff` | about 16 to 1 | Pass |
| Muted `#6b7280` on card `#ffffff` | about 4.8 to 1 | Pass |
| Danger `#dc2626` on card `#ffffff` | about 4.8 to 1 | Pass |
| Accent `#2563eb` on card `#ffffff` | about 5.2 to 1 | Pass |
| White text on accent `#2563eb` (Add button) | about 5.2 to 1 | Pass |
| Muted `#6b7280` on page background `#f5f5f7` | about 4.4 to 1 | Fail by a small margin |

Rule that follows: muted text is only placed on the white card, never directly on the page background. Everything in the mockups follows it, so no fix is needed today; it must stay true if the layout changes.

## Assumptions & Open Questions

- [assumption] The border of the input is the muted color; `docs/DESIGN.md` gives no border color. Its contrast against white (about 4.8 to 1) also meets the 3 to 1 rule for interface parts.
- [assumption] The 2 px accent focus ring with a 2 px offset is a proposed value, not from `docs/DESIGN.md`.
- Open question: who adds the overlay and focus ring tokens to `docs/DESIGN.md`. Same owner as the 320px line edit [Q2].
