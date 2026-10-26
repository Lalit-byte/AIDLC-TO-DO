import { useEffect, useRef, useState } from 'react';
import Counter from './components/Counter.jsx';
import DeleteDialog from './components/DeleteDialog.jsx';
import FilterBar from './components/FilterBar.jsx';
import MessageBar from './components/MessageBar.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { useTasks } from './hooks/useTasks.js';

const INPUT_TARGET = { kind: 'input' };

// Page frame. The only block that reads the hook (ADR-004).
// It also holds the id of the task being confirmed for deletion and moves focus after
// Cancel and after a delete (BR3.6). A focus request is kept in a ref and honoured in
// this component's own effect, which runs after the dialog's effect has closed the dialog.
export default function App() {
  const {
    visibleTasks,
    filter,
    setFilter,
    hasTasks,
    remaining,
    notice,
    add,
    toggle,
    remove,
    edit,
  } = useTasks();
  const [pendingId, setPendingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const rootRef = useRef(null);
  const focusRequestRef = useRef(null);

  const pendingTask =
    pendingId === null ? null : (visibleTasks.find((task) => task.id === pendingId) ?? null);
  const pendingGone = pendingId !== null && pendingTask === null;

  // The edited id never stays set for a task that is not in the shown list (BR4.12): it is
  // cleared at the moment it is found missing (adjusting state while rendering, as React
  // documents), so the task is not reopened in editing if it comes back, and takes no focus.
  const editingMissing = editingId !== null && !visibleTasks.some((task) => task.id === editingId);
  if (editingMissing) {
    setEditingId(null);
  }
  const shownEditingId = editingMissing ? null : editingId;

  // A task that left the list while its dialog was open: the dialog is already closed
  // (its task is null), nothing is removed, and focus goes to the add input (BR3.8).
  // The stale id is harmless: ids are unique and the next Delete click replaces it.
  useEffect(() => {
    if (pendingGone) {
      rootRef.current?.querySelector('[data-testid="task-input"]')?.focus();
    }
  }, [pendingGone]);

  // Honour a focus request once the page has settled, then clear it.
  useEffect(() => {
    const request = focusRequestRef.current;
    if (request === null) {
      return;
    }
    focusRequestRef.current = null;
    const root = rootRef.current;
    if (root === null) {
      return;
    }
    let target = null;
    if (request.kind === 'row') {
      const row = Array.from(root.querySelectorAll('[data-task-id]')).find(
        (element) => element.dataset.taskId === request.id,
      );
      const testIds = {
        delete: 'delete-button',
        edit: 'edit-button',
        checkbox: 'task-checkbox',
      };
      const testId = testIds[request.control] ?? 'task-checkbox';
      target = row ? row.querySelector(`[data-testid="${testId}"]`) : null;
    }
    // The add input is the fallback when the wanted row is not there.
    (target ?? root.querySelector('[data-testid="task-input"]'))?.focus();
  });

  function askDelete(id) {
    setPendingId(id);
  }

  // Edit on a row makes it the only edited row; any other edit ends without saving (BR4.7).
  function startEdit(id) {
    setEditingId(id);
  }

  // End the edit; with `returnFocus`, focus goes to that row's Edit button (BR4.3, BR4.12).
  function endEdit(returnFocus) {
    if (returnFocus && shownEditingId !== null) {
      focusRequestRef.current = { kind: 'row', id: shownEditingId, control: 'edit' };
    }
    setEditingId(null);
  }

  function cancelDelete() {
    if (pendingId !== null) {
      focusRequestRef.current = { kind: 'row', id: pendingId, control: 'delete' };
    }
    setPendingId(null);
  }

  // Work out where focus goes before the removal: the row now at the deleted position,
  // else the row above, else the add input (BR3.6).
  function confirmDelete(id) {
    const index = visibleTasks.findIndex((task) => task.id === id);
    const neighbour =
      index === -1 ? undefined : (visibleTasks[index + 1] ?? visibleTasks[index - 1]);
    focusRequestRef.current = neighbour
      ? { kind: 'row', id: neighbour.id, control: 'checkbox' }
      : INPUT_TARGET;
    remove(id);
    setPendingId(null);
  }

  // A tick (while Active) or untick (while Completed) takes the row out of view: work out the
  // focus target from the list as shown, before the change, and ask for it (BR5.8). In every
  // other case no focus request is set, so none can be left over after an ignored tick.
  function handleToggle(id) {
    const index = visibleTasks.findIndex((task) => task.id === id);
    const leaves = index !== -1 && filter !== 'all';
    if (leaves) {
      const neighbour = visibleTasks[index + 1] ?? visibleTasks[index - 1];
      focusRequestRef.current = neighbour
        ? { kind: 'row', id: neighbour.id, control: 'checkbox' }
        : INPUT_TARGET;
    }
    toggle(id);
  }

  return (
    <main className="card" ref={rootRef}>
      <h1 className="card__title">Todo List</h1>
      <p className="storage-note" data-testid="storage-note">
        Your tasks are saved in this browser only.
      </p>
      <MessageBar notice={notice} />
      <TaskForm onAdd={add} />
      <TaskList
        tasks={visibleTasks}
        hasTasks={hasTasks}
        editingId={shownEditingId}
        onToggle={handleToggle}
        onAskDelete={askDelete}
        onStartEdit={startEdit}
        onEndEdit={endEdit}
        onEdit={edit}
      />
      <div className="summary" data-testid="summary">
        <Counter remaining={remaining} />
        <FilterBar filter={filter} onChange={setFilter} />
      </div>
      <DeleteDialog task={pendingTask} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </main>
  );
}
