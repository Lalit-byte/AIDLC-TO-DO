import TaskItem from './TaskItem.jsx';

// Renders the tasks in the order given (newest first). Rows are keyed by id so an add
// draws one new row and leaves the others alone. When there are no tasks at all
// (`hasTasks` false, contract C5) it shows a plain hint instead of a list (BR9.1 to BR9.6);
// when tasks exist but none is shown (a filter), it shows "No tasks match this filter." (BR5.3).
// `editingId`, `onStartEdit`, `onEndEdit` and `onEdit` go to every row unchanged.
export default function TaskList({
  tasks,
  hasTasks,
  editingId,
  onToggle,
  onAskDelete,
  onStartEdit,
  onEndEdit,
  onEdit,
}) {
  if (!hasTasks) {
    return (
      <p className="empty-hint" data-testid="empty-hint">
        No tasks yet. Add one above.
      </p>
    );
  }
  if (tasks.length === 0) {
    return (
      <p className="empty-hint" data-testid="filter-empty">
        No tasks match this filter.
      </p>
    );
  }
  return (
    <ul className="task-list" data-testid="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editingId={editingId}
          onToggle={onToggle}
          onAskDelete={onAskDelete}
          onStartEdit={onStartEdit}
          onEndEdit={onEndEdit}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
