import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTask, makeTasks, savedText } from '../test/tasks.js';
import {
  BACKUP_PREFIX,
  createTaskStorage,
  isValidTask,
  STORAGE_KEY,
  TaskStorage,
} from './taskStorage.js';

afterEach(() => {
  vi.restoreAllMocks();
});

function backupKeys() {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(BACKUP_PREFIX))
    .sort();
}

function quotaError() {
  return new DOMException('The quota has been exceeded', 'QuotaExceededError');
}

function securityError() {
  return new DOMException('Access is denied', 'SecurityError');
}

describe('TaskStorage.load', () => {
  it('returns an empty list when nothing is saved (not a failure)', () => {
    expect(createTaskStorage().load()).toEqual({ ok: true, tasks: [] });
  });

  it('returns the saved tasks in saved order', () => {
    const tasks = [makeTask({ id: 'b', title: 'Second' }), makeTask({ id: 'a', title: 'First' })];
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    expect(createTaskStorage().load()).toEqual({ ok: true, tasks });
  });

  it('treats text that is not the saved format as unreadable', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(createTaskStorage().load()).toEqual({ ok: false, reason: 'unreadable' });
    localStorage.setItem(STORAGE_KEY, 'null');
    expect(createTaskStorage().load()).toEqual({ ok: false, reason: 'unreadable' });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks: 'nope' }));
    expect(createTaskStorage().load()).toEqual({ ok: false, reason: 'unreadable' });
  });

  it('treats a wrong version as unreadable', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, tasks: [] }));
    expect(createTaskStorage().load()).toEqual({ ok: false, reason: 'unreadable' });
  });

  it.each([
    [
      'a missing field',
      () => {
        const t = makeTask();
        delete t.updatedAt;
        return t;
      },
    ],
    ['an extra field', () => makeTask({ note: 'x' })],
    ['a wrongly typed completed', () => makeTask({ completed: 'no' })],
    ['an empty id', () => makeTask({ id: '' })],
    ['an untrimmed title', () => makeTask({ title: ' padded ' })],
    ['a too-long title', () => makeTask({ title: 'a'.repeat(201) })],
    ['a bad time', () => makeTask({ createdAt: 'yesterday' })],
  ])('treats a task with %s as unreadable', (_label, build) => {
    localStorage.setItem(STORAGE_KEY, savedText([makeTask({ id: 'ok' }), build()]));
    expect(createTaskStorage().load()).toEqual({ ok: false, reason: 'unreadable' });
  });

  it('returns blocked when the browser refuses access', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw securityError();
    });
    expect(createTaskStorage().load()).toEqual({ ok: false, reason: 'blocked' });
  });

  it('never changes or removes saved data', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage');
    createTaskStorage().load();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('garbage');
    expect(backupKeys()).toEqual([]);
  });
});

describe('TaskStorage.save', () => {
  it('saves a valid list that load reads back', () => {
    const storage = createTaskStorage();
    const tasks = makeTasks(3);
    expect(storage.save(tasks)).toEqual({ ok: true });
    expect(storage.load()).toEqual({ ok: true, tasks });
  });

  it('writes the whole list once, under one name, with version 1', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const tasks = makeTasks(2);
    createTaskStorage().save(tasks);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify({ version: 1, tasks }));
  });

  it('refuses an invalid task and writes nothing', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const result = createTaskStorage().save([makeTask(), makeTask({ title: '   ' })]);
    expect(result).toEqual({ ok: false, reason: 'invalid-task' });
    expect(setItem).not.toHaveBeenCalled();
  });

  it('refuses a value that is not a list', () => {
    expect(createTaskStorage().save('nope')).toEqual({ ok: false, reason: 'invalid-task' });
  });

  it('maps a quota error to full', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw quotaError();
    });
    expect(createTaskStorage().save(makeTasks(1))).toEqual({ ok: false, reason: 'full' });
  });

  it('maps a refused-access error to blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw securityError();
    });
    expect(createTaskStorage().save(makeTasks(1))).toEqual({ ok: false, reason: 'blocked' });
  });

  it('maps any other error to failed', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('boom');
    });
    expect(createTaskStorage().save(makeTasks(1))).toEqual({ ok: false, reason: 'failed' });
  });

  it('returns blocked when storage cannot be reached at all', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw securityError();
    });
    expect(createTaskStorage().save(makeTasks(1))).toEqual({ ok: false, reason: 'blocked' });
  });

  it('leaves the previous list readable when a write fails (NFR8.1)', () => {
    const storage = createTaskStorage();
    const first = makeTasks(1);
    storage.save(first);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw quotaError();
    });
    expect(storage.save(makeTasks(2)).ok).toBe(false);
    vi.restoreAllMocks();
    expect(storage.load()).toEqual({ ok: true, tasks: first });
  });

  it('makes no backup after a good load', () => {
    const storage = createTaskStorage();
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(1)));
    storage.load();
    storage.save(makeTasks(2));
    expect(backupKeys()).toEqual([]);
  });
});

describe('TaskStorage backup of unreadable data (NFR8.2)', () => {
  it('copies the exact original text to a backup before writing the new list', () => {
    const storage = createTaskStorage();
    localStorage.setItem(STORAGE_KEY, '{"damaged": tru');
    expect(storage.load()).toEqual({ ok: false, reason: 'unreadable' });
    const tasks = makeTasks(1);
    expect(storage.save(tasks)).toEqual({ ok: true });
    const keys = backupKeys();
    expect(keys).toHaveLength(1);
    expect(localStorage.getItem(keys[0])).toBe('{"damaged": tru');
    expect(storage.load()).toEqual({ ok: true, tasks });
  });

  it('writes nothing else and keeps the original when the copy fails', () => {
    const storage = createTaskStorage();
    localStorage.setItem(STORAGE_KEY, 'damaged');
    storage.load();
    const realSetItem = Storage.prototype.setItem;
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(function (key, value) {
        if (key.startsWith(BACKUP_PREFIX)) {
          throw quotaError();
        }
        return realSetItem.call(this, key, value);
      });
    expect(storage.save(makeTasks(1))).toEqual({ ok: false, reason: 'full' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('damaged');
    expect(setItem.mock.calls.every(([key]) => key.startsWith(BACKUP_PREFIX))).toBe(true);
  });

  it('does not copy again after a copy that succeeded followed by a failed main write', () => {
    const storage = createTaskStorage();
    localStorage.setItem(STORAGE_KEY, 'damaged');
    storage.load();
    const realSetItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === STORAGE_KEY) {
        throw quotaError();
      }
      return realSetItem.call(this, key, value);
    });
    expect(storage.save(makeTasks(1))).toEqual({ ok: false, reason: 'full' });
    expect(backupKeys()).toHaveLength(1);
    vi.restoreAllMocks();
    expect(storage.save(makeTasks(1))).toEqual({ ok: true });
    expect(backupKeys()).toHaveLength(1);
  });

  it('keeps two backups made in the same millisecond', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
    const storage = createTaskStorage();
    localStorage.setItem(STORAGE_KEY, 'first damage');
    storage.load();
    storage.save(makeTasks(1));
    localStorage.setItem(STORAGE_KEY, 'second damage');
    storage.load();
    storage.save(makeTasks(1));
    const keys = backupKeys();
    expect(keys).toEqual([`${BACKUP_PREFIX}1700000000000`, `${BACKUP_PREFIX}1700000000000-1`]);
    expect(localStorage.getItem(keys[0])).toBe('first damage');
    expect(localStorage.getItem(keys[1])).toBe('second damage');
  });

  it('makes no backup after a blocked load, and tries the save normally', () => {
    const storage = createTaskStorage();
    localStorage.setItem(STORAGE_KEY, 'damaged');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw securityError();
    });
    expect(storage.load()).toEqual({ ok: false, reason: 'blocked' });
    expect(storage.save(makeTasks(1))).toEqual({ ok: true });
    expect(backupKeys()).toEqual([]);
  });

  it('forgets the unreadable text after a good write', () => {
    const storage = createTaskStorage();
    localStorage.setItem(STORAGE_KEY, 'damaged');
    storage.load();
    storage.save(makeTasks(1));
    storage.save(makeTasks(2));
    expect(backupKeys()).toHaveLength(1);
  });
});

// A second tab: change the stored text, then tell this tab with a storage event.
function otherTab(text, { key = STORAGE_KEY, area = localStorage } = {}) {
  if (key === STORAGE_KEY) {
    if (text === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, text);
    }
  }
  window.dispatchEvent(new StorageEvent('storage', { key, storageArea: area }));
}

describe('TaskStorage.subscribe', () => {
  it('passes a good list from another tab to the listener', () => {
    const listener = vi.fn();
    const stop = createTaskStorage().subscribe(listener);
    const tasks = makeTasks(2);
    otherTab(savedText(tasks));
    expect(listener).toHaveBeenCalledWith({ ok: true, tasks });
    stop();
  });

  it('gives an empty list when the saved list is removed or everything is cleared', () => {
    const listener = vi.fn();
    const stop = createTaskStorage().subscribe(listener);
    otherTab(null);
    expect(listener).toHaveBeenLastCalledWith({ ok: true, tasks: [] });
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(1)));
    otherTab(null, { key: null });
    expect(listener).toHaveBeenCalledTimes(2);
    stop();
  });

  it('ignores another key and another storage area', () => {
    const listener = vi.fn();
    const stop = createTaskStorage().subscribe(listener);
    otherTab(savedText(makeTasks(1)), { key: 'other.key' });
    otherTab(savedText(makeTasks(1)), { area: window.sessionStorage });
    expect(listener).not.toHaveBeenCalled();
    stop();
  });

  it('gives unreadable for damaged text and backs it up at the next save', () => {
    const storage = createTaskStorage();
    const listener = vi.fn();
    const stop = storage.subscribe(listener);
    otherTab('{damaged');
    expect(listener).toHaveBeenCalledWith({ ok: false, reason: 'unreadable' });
    expect(storage.save(makeTasks(1))).toEqual({ ok: true });
    const keys = backupKeys();
    expect(keys).toHaveLength(1);
    expect(localStorage.getItem(keys[0])).toBe('{damaged');
    stop();
  });

  it('clears the kept text on a later good read so the next save makes no backup', () => {
    const storage = createTaskStorage();
    const stop = storage.subscribe(() => {});
    otherTab('{damaged');
    otherTab(savedText(makeTasks(1)));
    storage.save(makeTasks(2));
    expect(backupKeys()).toHaveLength(0);
    stop();
  });

  it('backs up new damaged text again even after an earlier backup', () => {
    const storage = createTaskStorage();
    const stop = storage.subscribe(() => {});
    otherTab('{first');
    storage.save(makeTasks(1));
    otherTab('{second');
    storage.save(makeTasks(1));
    const texts = backupKeys().map((key) => localStorage.getItem(key));
    expect(texts.sort()).toEqual(['{first', '{second']);
    stop();
  });

  it('ignores a signal when the read is blocked', () => {
    const listener = vi.fn();
    const stop = createTaskStorage().subscribe(listener);
    const original = Storage.prototype.getItem;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (key) {
      if (key === STORAGE_KEY) {
        throw securityError();
      }
      return original.call(this, key);
    });
    window.dispatchEvent(
      new StorageEvent('storage', { key: STORAGE_KEY, storageArea: localStorage }),
    );
    expect(listener).not.toHaveBeenCalled();
    stop();
  });

  it('stops calling the listener after unsubscribing', () => {
    const listener = vi.fn();
    const stop = createTaskStorage().subscribe(listener);
    stop();
    otherTab(savedText(makeTasks(1)));
    expect(listener).not.toHaveBeenCalled();
  });

  it('gives unreadable for a task with an extra field and for an unknown version', () => {
    const listener = vi.fn();
    const stop = createTaskStorage().subscribe(listener);
    otherTab(savedText([makeTask({ note: 'x' })]));
    otherTab(JSON.stringify({ version: 2, tasks: [] }));
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(1, { ok: false, reason: 'unreadable' });
    expect(listener).toHaveBeenNthCalledWith(2, { ok: false, reason: 'unreadable' });
    stop();
  });
});

describe('TaskStorage shape and exports', () => {
  it('exposes load, save and checkTitle on the shared instance (contract C3)', () => {
    expect(typeof TaskStorage.load).toBe('function');
    expect(typeof TaskStorage.save).toBe('function');
    expect(TaskStorage.checkTitle('  hi ')).toEqual({ ok: true, title: 'hi' });
  });

  it('isValidTask rejects values that are not plain objects', () => {
    expect(isValidTask(null)).toBe(false);
    expect(isValidTask([])).toBe(false);
    expect(isValidTask('task')).toBe(false);
    expect(isValidTask(makeTask())).toBe(true);
  });
});
