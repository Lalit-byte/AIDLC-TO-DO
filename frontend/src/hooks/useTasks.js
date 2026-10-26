// State hook (contract C4, these Units' part): the shown list (`visibleTasks`, the full list
// narrowed by `filter`), `filter` and `setFilter` (all | active | completed, never saved),
// `hasTasks` and `remaining` (both from the full list), the notice, `add`, `toggle`, `remove`, `edit`.
// Performance design D1, D2: the list lives in memory; the save runs after the new row is drawn.
// Keep-tasks (BR6.4, BR6.9, BR6.14): it also follows another tab through `TaskStorage.subscribe`.

import { useCallback, useEffect, useRef, useState } from 'react';
import { TaskStorage } from '../services/taskStorage.js';
import { checkTitle } from '../services/titleRules.js';

export const LOAD_FAILED_TEXT = 'Your tasks could not be loaded.';
export const SAVE_FAILED_TEXT = 'Your change could not be saved.';

// A new unique id (BR1.9): the built-in maker where the browser has it,
// otherwise a time-plus-random-text id (for example a page opened over plain http).
export function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const random = () => Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${random()}${random()}`;
}

const FILTERS = ['all', 'active', 'completed'];

export function useTasks() {
  // Read the saved list once, when the page opens (NFR1.5).
  const [loaded] = useState(() => TaskStorage.load());
  const loadFailed = !loaded.ok;

  const [tasks, setTasks] = useState(() => (loaded.ok ? loaded.tasks : []));
  const [saveFailed, setSaveFailed] = useState(false);
  // Screen state only (BR5.4): starts as all on every page load, never saved, and a list
  // replaced by another tab does not touch it.
  const [filter, setFilterState] = useState('all');
  // Another tab left damaged data; like a failed load, it stays until the page is reloaded.
  const [otherTabDamaged, setOtherTabDamaged] = useState(false);

  // The latest list, so a save always writes what is on screen now.
  const tasksRef = useRef(tasks);
  // "A save is due" record: raised only by this hook's own actions (D2).
  const saveDueRef = useRef(false);
  const scheduledRef = useRef(false);

  // Runs after the page has painted. The record is cleared before the save runs,
  // so a second run with the record cleared does nothing.
  const runSave = useCallback(() => {
    scheduledRef.current = false;
    if (!saveDueRef.current) {
      return;
    }
    saveDueRef.current = false;
    const result = TaskStorage.save(tasksRef.current);
    setSaveFailed(!result.ok);
  }, []);

  // Follow another tab (BR6.9, BR6.14). State is set only inside the listener.
  useEffect(() => {
    return TaskStorage.subscribe((result) => {
      if (!result.ok) {
        // Damaged data from another tab: keep this tab's list, show the load-failed notice.
        setOtherTabDamaged(true);
        return;
      }
      // The other tab's list replaces both the screen list and the list the next save writes.
      tasksRef.current = result.tasks;
      saveDueRef.current = false;
      setTasks(result.tasks);
      setSaveFailed(false);
    });
  }, []);

  // After each commit: if a save is due, start it after the next paint, never in the add's own step.
  useEffect(() => {
    if (!saveDueRef.current || scheduledRef.current) {
      return;
    }
    scheduledRef.current = true;
    requestAnimationFrame(() => {
      setTimeout(runSave, 0);
    });
  });

  const add = useCallback((rawTitle) => {
    const checked = checkTitle(rawTitle);
    if (!checked.ok) {
      return { ok: false, reason: checked.reason };
    }
    const now = new Date().toISOString();
    const task = {
      id: newId(),
      title: checked.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    const next = [task, ...tasksRef.current];
    tasksRef.current = next;
    setTasks(next);
    saveDueRef.current = true;
    return { ok: true };
  }, []);

  // Flip `completed` of one task (BR2.1, BR2.2, BR2.4). Position and other tasks stay as they are.
  // An id that is not in the latest list changes nothing and starts no save (BR2.9).
  const toggle = useCallback((id) => {
    const current = tasksRef.current;
    if (!current.some((task) => task.id === id)) {
      return;
    }
    const now = new Date().toISOString();
    const next = current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed, updatedAt: now } : task,
    );
    tasksRef.current = next;
    setTasks(next);
    saveDueRef.current = true;
  }, []);

  // Remove one task (BR3.2, BR3.8, BR3.9). The others keep their order and fields.
  // An id that is not in the latest list changes nothing and starts no save.
  const remove = useCallback((id) => {
    const current = tasksRef.current;
    if (!current.some((task) => task.id === id)) {
      return;
    }
    const next = current.filter((task) => task.id !== id);
    tasksRef.current = next;
    setTasks(next);
    saveDueRef.current = true;
  }, []);

  // Replace the title of one task (BR4.2, BR4.5, BR4.8). Order of checks: unknown id is a
  // no-op that reports ok; then the title rules; then "same title" is a no-op that reports ok.
  const edit = useCallback((id, rawTitle) => {
    const current = tasksRef.current;
    const existing = current.find((task) => task.id === id);
    if (!existing) {
      return { ok: true };
    }
    const checked = checkTitle(rawTitle);
    if (!checked.ok) {
      return { ok: false, reason: checked.reason };
    }
    if (checked.title === existing.title) {
      return { ok: true };
    }
    const now = new Date().toISOString();
    const next = current.map((task) =>
      task.id === id ? { ...task, title: checked.title, updatedAt: now } : task,
    );
    tasksRef.current = next;
    setTasks(next);
    saveDueRef.current = true;
    return { ok: true };
  }, []);

  // Notice state machine: save-failed outranks load-failed; a good save returns to
  // load-failed only when the load had failed; load-failed clears only on reload.
  let notice = null;
  if (saveFailed) {
    notice = { kind: 'save-failed', text: SAVE_FAILED_TEXT };
  } else if (loadFailed || otherTabDamaged) {
    notice = { kind: 'load-failed', text: LOAD_FAILED_TEXT };
  }

  // Tasks not yet complete, counted in the full list (never a shown list), derived on every
  // render: not saved and held in no state of its own (BR7.1, BR7.3, BR7.4, BR7.7).
  const remaining = tasks.filter((task) => !task.completed).length;

  // A value that is not one of the three is ignored (BR5.1).
  const setFilter = useCallback((value) => {
    if (FILTERS.includes(value)) {
      setFilterState(value);
    }
  }, []);

  // The full list narrowed by the filter, in the full list's order (BR5.1, BR5.7).
  const visibleTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((task) => (filter === 'completed' ? task.completed : !task.completed));

  return {
    visibleTasks,
    filter,
    setFilter,
    hasTasks: tasks.length > 0,
    remaining,
    notice,
    add,
    toggle,
    remove,
    edit,
  };
}
