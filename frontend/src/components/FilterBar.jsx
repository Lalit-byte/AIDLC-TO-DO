const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

// The three filter buttons (contract C5). Inputs: `filter` (the chosen value) and
// `onChange(value)`. Holds no state. Native buttons: Tab reaches each, Enter or Space
// presses it; the chosen one is pressed, bold and has an accent border (BR5.2, BR5.5).
export default function FilterBar({ filter, onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks" data-testid="filter-bar">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="filter-bar__button"
          aria-pressed={filter === option.value}
          data-testid={`filter-${option.value}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
