import TaskEditField from './TaskEditField.jsx';

// One task row in display form. The title is passed as a text child, so it is always
// shown as plain text and never run as markup (BR1.5, NFR4.1).
// Only the checkbox toggles the task (BR2.6); the title is not a label. The checkbox is
// named by pointing at the title text (BR2.7). The complete look is the muted color plus
// a line through the title, so it does not rely on color alone (BR2.3).
// The Delete button is named "Delete" plus the title (BR3.10) and only asks the page to
// confirm (`onAskDelete`); it never removes anything itself (BR3.1).
// The Edit button is named the same way (BR4.10). While `editingId` names this task, the
// row shows the editing field instead of the title, Edit and Delete (BR4.13); the title
// text stays in the page, visually hidden, so the checkbox keeps its name. Esc pressed
// anywhere inside the editing row cancels the edit (BR4.3).
export default function TaskItem({
  task,
  editingId = null,
  onToggle,
  onAskDelete,
  onStartEdit,
  onEndEdit,
  onEdit,
}) {
  const titleId = `task-title-${task.id}`;
  const deleteId = `task-delete-${task.id}`;
  const editId = `task-edit-${task.id}`;
  const editing = editingId === task.id;

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onEndEdit(true);
    }
  }

  function handleSave(text) {
    const result = onEdit(task.id, text);
    if (result.ok) {
      onEndEdit(true);
    }
    return result;
  }

  return (
    <li
      className={task.completed ? 'task-item task-item--completed' : 'task-item'}
      data-testid="task-item"
      data-task-id={task.id}
      onKeyDown={editing ? handleKeyDown : undefined}
    >
      <input
        type="checkbox"
        className="task-item__checkbox"
        data-testid="task-checkbox"
        checked={task.completed}
        aria-labelledby={titleId}
        onChange={() => onToggle(task.id)}
      />
      {editing ? (
        <>
          <span className="visually-hidden" id={titleId}>
            {task.title}
          </span>
          <TaskEditField
            taskId={task.id}
            title={task.title}
            onSave={handleSave}
            onCancel={() => onEndEdit(true)}
          />
        </>
      ) : (
        <>
          <span className="task-item__title" id={titleId}>
            {task.title}
          </span>
          <button
            type="button"
            id={editId}
            className="task-item__edit"
            data-testid="edit-button"
            aria-labelledby={`${editId} ${titleId}`}
            onClick={() => onStartEdit(task.id)}
          >
            Edit
          </button>
          <button
            type="button"
            id={deleteId}
            className="task-item__delete"
            data-testid="delete-button"
            aria-labelledby={`${deleteId} ${titleId}`}
            onClick={() => onAskDelete(task.id)}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
}
