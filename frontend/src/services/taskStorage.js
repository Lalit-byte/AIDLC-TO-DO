// Storage service (contract C3). The ONLY place that touches browser storage.
// Rules: BR1.10 to BR1.15, BR6.9 to BR6.15, NFR6.1, NFR8.1, NFR8.2.

import { checkTitle } from './titleRules.js';

export const STORAGE_KEY = 'todo-app.tasks';
export const BACKUP_PREFIX = 'todo-app.tasks.damaged.';
export const SAVED_VERSION = 1;

const TASK_KEYS = ['completed', 'createdAt', 'id', 'title', 'updatedAt'];
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/;

function isIsoTime(value) {
  return typeof value === 'string' && ISO_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

/**
 * The one shape check shared by load and save (BR1.10, BR1.11, NFR6.1).
 * A task has exactly five fields of the right kinds and a title that already passes the rules.
 */
export function isValidTask(task) {
  if (task === null || typeof task !== 'object' || Array.isArray(task)) {
    return false;
  }
  const keys = Object.keys(task).sort();
  if (keys.length !== TASK_KEYS.length || keys.some((key, index) => key !== TASK_KEYS[index])) {
    return false;
  }
  if (typeof task.id !== 'string' || task.id.length === 0) {
    return false;
  }
  if (typeof task.title !== 'string') {
    return false;
  }
  const checked = checkTitle(task.title);
  if (!checked.ok || checked.title !== task.title) {
    return false;
  }
  if (typeof task.completed !== 'boolean') {
    return false;
  }
  return isIsoTime(task.createdAt) && isIsoTime(task.updatedAt);
}

// Map a storage error to the contract's reasons (C-5): quota -> full, refused -> blocked, else failed.
function reasonFor(error) {
  const name = error && error.name;
  const code = error && error.code;
  if (
    name === 'QuotaExceededError' ||
    name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    code === 22 ||
    code === 1014
  ) {
    return 'full';
  }
  if (name === 'SecurityError' || code === 18) {
    return 'blocked';
  }
  return 'failed';
}

function getStorage() {
  // Reading the property can itself throw where the browser refuses storage.
  const storage = window.localStorage;
  if (!storage) {
    throw new DOMException('Storage is not available', 'SecurityError');
  }
  return storage;
}

/**
 * Create a storage service. The app uses the single instance `TaskStorage`;
 * tests create their own so that no unreadable-text state leaks between them.
 */
export function createTaskStorage() {
  // Unreadable text kept in memory after a failed load (BR1.13). Only this service owns it.
  let unreadable = null; // { text: string, backedUp: boolean } | null

  // The one reading code shared by load and subscribe. It changes nothing; it reports
  // { kind: 'blocked' } | { kind: 'good', tasks } | { kind: 'damaged', text }.
  function readSaved() {
    let text;
    try {
      text = getStorage().getItem(STORAGE_KEY);
    } catch {
      // A refused read is reported as the contract's `blocked` result, not swallowed.
      return { kind: 'blocked' };
    }
    if (text === null) {
      return { kind: 'good', tasks: [] };
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = undefined; // not the saved format: handled below as unreadable
    }
    const readable =
      parsed !== null &&
      typeof parsed === 'object' &&
      parsed.version === SAVED_VERSION &&
      Array.isArray(parsed.tasks) &&
      parsed.tasks.every(isValidTask);
    if (!readable) {
      return { kind: 'damaged', text };
    }
    return { kind: 'good', tasks: parsed.tasks };
  }

  function load() {
    unreadable = null;
    const read = readSaved();
    if (read.kind === 'blocked') {
      return { ok: false, reason: 'blocked' };
    }
    if (read.kind === 'damaged') {
      unreadable = { text: read.text, backedUp: false };
      return { ok: false, reason: 'unreadable' };
    }
    return { ok: true, tasks: read.tasks };
  }

  // Watch for another tab's change (BR6.9 to BR6.12, BR6.15). Read only: it never writes.
  // Returns a function that stops the watching.
  function subscribe(listener) {
    function onStorage(event) {
      let area;
      try {
        area = getStorage();
      } catch {
        return; // storage refused: nothing to follow
      }
      if (event.storageArea !== area) {
        return;
      }
      if (event.key !== null && event.key !== STORAGE_KEY) {
        return;
      }
      const read = readSaved();
      if (read.kind === 'blocked') {
        return; // a blocked read is ignored; the kept text stays as it was
      }
      if (read.kind === 'damaged') {
        unreadable = { text: read.text, backedUp: false };
        listener({ ok: false, reason: 'unreadable' });
        return;
      }
      unreadable = null;
      listener({ ok: true, tasks: read.tasks });
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }

  // Copy the unreadable text to a free backup name; never overwrite a backup (BR1.13, C-6).
  function backUp(storage) {
    const base = BACKUP_PREFIX + Date.now();
    let name = base;
    let counter = 0;
    while (storage.getItem(name) !== null) {
      counter += 1;
      name = `${base}-${counter}`;
    }
    storage.setItem(name, unreadable.text);
    unreadable.backedUp = true;
  }

  function save(tasks) {
    if (!Array.isArray(tasks) || !tasks.every(isValidTask)) {
      return { ok: false, reason: 'invalid-task' };
    }
    let text;
    try {
      text = JSON.stringify({ version: SAVED_VERSION, tasks });
    } catch {
      return { ok: false, reason: 'failed' };
    }
    let storage;
    try {
      storage = getStorage();
    } catch {
      // The browser refuses access to storage altogether.
      return { ok: false, reason: 'blocked' };
    }
    if (unreadable !== null && !unreadable.backedUp) {
      try {
        backUp(storage);
      } catch (error) {
        return { ok: false, reason: reasonFor(error) };
      }
    }
    try {
      storage.setItem(STORAGE_KEY, text);
    } catch (error) {
      return { ok: false, reason: reasonFor(error) };
    }
    unreadable = null;
    return { ok: true };
  }

  return { load, save, subscribe, checkTitle };
}

export const TaskStorage = createTaskStorage();
