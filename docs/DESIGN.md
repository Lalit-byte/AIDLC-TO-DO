# DESIGN

> UI/UX source of truth for the frontend. Keep components consistent with this file.

## Layout (single page, centered, max-width 600px)
```
+------------------------------------------+
|  Todo List                               |
|  [ What needs to be done?        ] [Add] |
|  [ ] Task one                   [Edit][x]|
|  [x] Task two (struck through)  [Edit][x]|
|  ---------------------------------------- |
|  2 items left   [All] [Active] [Completed]|
+------------------------------------------+
```

## Components
| Component | Responsibility |
|-----------|----------------|
| TaskForm | Input + Add button; shows validation message |
| TaskItem | Checkbox, title, inline edit, delete |
| TaskList | Renders filtered items; empty-state text |
| FilterBar | All / Active / Completed buttons; active one highlighted |
| Counter | "N items left" |

## Visual tokens
- Font: system font stack. Base size 16px.
- Colors: background `#f5f5f7`, card `#ffffff`, text `#1d1d1f`, accent `#2563eb`, danger `#dc2626`, muted `#6b7280`.
- Spacing scale: 4, 8, 16, 24 px. Card radius 8px.
- Completed task: muted color + line-through.

## States
- Empty list: "No tasks yet. Add one above."
- Empty filter result: "No tasks match this filter."
- Invalid input: red message under the input; Add stays enabled.

## Accessibility
- Every control reachable by keyboard; visible focus ring.
- Checkbox and buttons have accessible labels.
- Contrast at least WCAG AA.
- Responsive: usable at 320px width.
