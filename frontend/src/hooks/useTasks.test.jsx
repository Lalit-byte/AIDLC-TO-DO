import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BACKUP_PREFIX, STORAGE_KEY, TaskStorage } from '../services/taskStorage.js';
import { makeTasks, savedText } from '../test/tasks.js';
import { LOAD_FAILED_TEXT, newId, SAVE_FAILED_TEXT, useTasks } from './useTasks.js';

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

afterEach(async () => {
  // Let any post-paint save started by this test finish before the next test begins.
  await pause(60);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function savedList() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)).tasks;
}

describe('useTasks: open', () => {
  it('starts empty with no notice when nothing is saved', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.visibleTasks).toEqual([]);
    expect(result.current.hasTasks).toBe(false);
    expect(result.current.notice).toBeNull();
  });

  it('shows saved tasks in saved order', () => {
    const tasks = makeTasks(3);
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    const { result } = renderHook(() => useTasks());
    expect(result.current.visibleTasks).toEqual(tasks);
    expect(result.current.hasTasks).toBe(true);
  });

  it('reads the saved list once, not again on an add (NFR1.5)', async () => {
    const load = vi.spyOn(TaskStorage, 'load');
    const { result, rerender } = renderHook(() => useTasks());
    act(() => {
      result.current.add('One');
    });
    rerender();
    await waitFor(() => expect(savedList()).toHaveLength(1));
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('sets load-failed and an empty list when the saved data is unreadable', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage');
    const { result } = renderHook(() => useTasks());
    expect(result.current.visibleTasks).toEqual([]);
    expect(result.current.notice).toEqual({ kind: 'load-failed', text: LOAD_FAILED_TEXT });
  });

  it('sets load-failed when the browser refuses storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    const { result } = renderHook(() => useTasks());
    expect(result.current.notice?.kind).toBe('load-failed');
  });
});

describe('useTasks: add', () => {
  it('puts a new task first with an id, completed false and equal times (BR1.9)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const { result } = renderHook(() => useTasks());
    let outcome;
    act(() => {
      outcome = result.current.add('  Buy milk  ');
    });
    expect(outcome).toEqual({ ok: true });
    const [first, ...rest] = result.current.visibleTasks;
    expect(rest).toHaveLength(2);
    expect(first.title).toBe('Buy milk');
    expect(first.completed).toBe(false);
    expect(first.id).toEqual(expect.any(String));
    expect(first.id.length).toBeGreaterThan(0);
    expect(first.createdAt).toBe(first.updatedAt);
    expect(Number.isNaN(Date.parse(first.createdAt))).toBe(false);
    expect(Object.keys(first).sort()).toEqual([
      'completed',
      'createdAt',
      'id',
      'title',
      'updatedAt',
    ]);
  });

  it('refuses empty and too-long titles, changes nothing and saves nothing', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result } = renderHook(() => useTasks());
    let empty;
    let tooLong;
    act(() => {
      empty = result.current.add('   ');
      tooLong = result.current.add('a'.repeat(201));
    });
    expect(empty).toEqual({ ok: false, reason: 'empty' });
    expect(tooLong).toEqual({ ok: false, reason: 'too-long' });
    expect(result.current.visibleTasks).toEqual([]);
    await pause(80);
    expect(save).not.toHaveBeenCalled();
  });

  it('allows duplicate titles as separate tasks with their own ids (BR1.4)', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('Same');
      result.current.add('Same');
    });
    const [a, b] = result.current.visibleTasks;
    expect(a.title).toBe('Same');
    expect(b.title).toBe('Same');
    expect(a.id).not.toBe(b.id);
  });

  it('saves the new task after the page has painted', async () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('Persist me');
    });
    await waitFor(() => expect(savedList()).toHaveLength(1));
    expect(savedList()[0].title).toBe('Persist me');
  });

  it('shows the new row before the save runs (NFR1.2)', async () => {
    let rowsWhenSaveRan = -1;
    const { result } = renderHook(() => useTasks());
    const save = vi.spyOn(TaskStorage, 'save').mockImplementation(() => {
      rowsWhenSaveRan = result.current.visibleTasks.length;
      return { ok: true };
    });
    act(() => {
      result.current.add('Fast row');
    });
    // The row is on screen and the save has not been asked yet.
    expect(result.current.visibleTasks).toHaveLength(1);
    expect(save).not.toHaveBeenCalled();
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(rowsWhenSaveRan).toBe(1);
  });

  it('writes one save of the latest list for two adds before the post-paint step', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('First');
      result.current.add('Second');
    });
    await waitFor(() => expect(save).toHaveBeenCalled());
    await pause(80);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].map((task) => task.title)).toEqual(['Second', 'First']);
  });
});

describe('useTasks: toggle', () => {
  function openWith(count) {
    const tasks = makeTasks(count);
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    return { tasks, ...renderHook(() => useTasks()) };
  }

  it('flips an incomplete task to complete and back (BR2.1)', () => {
    const { result } = openWith(2);
    act(() => {
      result.current.toggle('id-1');
    });
    expect(result.current.visibleTasks[0].completed).toBe(true);
    act(() => {
      result.current.toggle('id-1');
    });
    expect(result.current.visibleTasks[0].completed).toBe(false);
  });

  it('changes updatedAt but not id, title or createdAt (BR2.2)', () => {
    const { result, tasks } = openWith(1);
    act(() => {
      result.current.toggle('id-1');
    });
    const [after] = result.current.visibleTasks;
    expect(after.updatedAt).not.toBe(tasks[0].updatedAt);
    expect(Number.isNaN(Date.parse(after.updatedAt))).toBe(false);
    expect(after.id).toBe(tasks[0].id);
    expect(after.title).toBe(tasks[0].title);
    expect(after.createdAt).toBe(tasks[0].createdAt);
  });

  it('keeps the task in its position and leaves other tasks untouched (BR2.2, BR2.4)', () => {
    const { result, tasks } = openWith(3);
    act(() => {
      result.current.toggle('id-2');
    });
    const after = result.current.visibleTasks;
    expect(after.map((task) => task.id)).toEqual(['id-1', 'id-2', 'id-3']);
    expect(after[0]).toEqual(tasks[0]);
    expect(after[2]).toEqual(tasks[2]);
    expect(after[1].completed).toBe(true);
  });

  it('changes nothing and starts no save for an unknown id (BR2.9)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result, tasks } = openWith(2);
    act(() => {
      result.current.toggle('missing');
    });
    expect(result.current.visibleTasks).toEqual(tasks);
    await pause(80);
    expect(save).not.toHaveBeenCalled();
  });

  it('ends where it started after two quick toggles, with one save of the latest list', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result } = openWith(2);
    act(() => {
      result.current.toggle('id-1');
      result.current.toggle('id-1');
    });
    expect(result.current.visibleTasks[0].completed).toBe(false);
    await waitFor(() => expect(save).toHaveBeenCalled());
    await pause(80);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0][0].completed).toBe(false);
  });

  it('saves the new value after the page has painted, not in the toggle step (BR2.8)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result } = openWith(2);
    act(() => {
      result.current.toggle('id-2');
    });
    expect(save).not.toHaveBeenCalled();
    await waitFor(() => expect(savedList()[1].completed).toBe(true));
    expect(savedList()[0].completed).toBe(false);
  });

  it('keeps the change after a failed save, shows save-failed, and the next good save writes it (BR2.8)', async () => {
    vi.spyOn(TaskStorage, 'save').mockReturnValueOnce({ ok: false, reason: 'full' });
    const { result } = openWith(2);
    act(() => {
      result.current.toggle('id-1');
    });
    await waitFor(() => expect(result.current.notice?.kind).toBe('save-failed'));
    expect(result.current.visibleTasks[0].completed).toBe(true);
    act(() => {
      result.current.toggle('id-2');
    });
    await waitFor(() => expect(result.current.notice).toBeNull());
    expect(savedList().map((task) => task.completed)).toEqual([true, true]);
  });
});

describe('useTasks: remove', () => {
  function openWith(count) {
    const tasks = makeTasks(count);
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    return { tasks, ...renderHook(() => useTasks()) };
  }

  it('drops only the named task and keeps the order of the rest (BR3.2)', () => {
    const { result } = openWith(3);
    act(() => {
      result.current.remove('id-2');
    });
    expect(result.current.visibleTasks.map((task) => task.id)).toEqual(['id-1', 'id-3']);
  });

  it('leaves the other tasks untouched', () => {
    const { result, tasks } = openWith(3);
    act(() => {
      result.current.remove('id-1');
    });
    expect(result.current.visibleTasks).toEqual([tasks[1], tasks[2]]);
  });

  it('gives an empty list when the last remaining task is removed', () => {
    const { result } = openWith(1);
    act(() => {
      result.current.remove('id-1');
    });
    expect(result.current.visibleTasks).toEqual([]);
    expect(result.current.hasTasks).toBe(false);
  });

  it('changes nothing and starts no save for an unknown id (BR3.8)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result, tasks } = openWith(2);
    act(() => {
      result.current.remove('missing');
    });
    expect(result.current.visibleTasks).toEqual(tasks);
    await pause(80);
    expect(save).not.toHaveBeenCalled();
  });

  it('removes once and saves once for two quick removes of one id', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result } = openWith(3);
    act(() => {
      result.current.remove('id-2');
      result.current.remove('id-2');
    });
    expect(result.current.visibleTasks.map((task) => task.id)).toEqual(['id-1', 'id-3']);
    await waitFor(() => expect(save).toHaveBeenCalled());
    await pause(80);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('saves the shorter list after the page has painted, not in the remove step (BR3.9)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result } = openWith(2);
    act(() => {
      result.current.remove('id-1');
    });
    expect(save).not.toHaveBeenCalled();
    await waitFor(() => expect(savedList()).toHaveLength(1));
    expect(savedList().some((task) => task.id === 'id-1')).toBe(false);
  });

  it('keeps the removal after a failed save, shows save-failed, and the next good save writes it (BR3.9)', async () => {
    vi.spyOn(TaskStorage, 'save').mockReturnValueOnce({ ok: false, reason: 'full' });
    const { result } = openWith(3);
    act(() => {
      result.current.remove('id-1');
    });
    await waitFor(() => expect(result.current.notice?.kind).toBe('save-failed'));
    expect(result.current.visibleTasks.map((task) => task.id)).toEqual(['id-2', 'id-3']);
    act(() => {
      result.current.remove('id-2');
    });
    await waitFor(() => expect(result.current.notice).toBeNull());
    expect(savedList().map((task) => task.id)).toEqual(['id-3']);
  });
});

describe('useTasks: edit', () => {
  function openWith(count) {
    const tasks = makeTasks(count);
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    return { tasks, ...renderHook(() => useTasks()) };
  }

  function editNow(result, id, title) {
    let outcome;
    act(() => {
      outcome = result.current.edit(id, title);
    });
    return outcome;
  }

  it('replaces only the named title with the trimmed text and sets updatedAt (BR4.2)', () => {
    const { result, tasks } = openWith(3);
    const outcome = editNow(result, 'id-2', '  New words  ');
    expect(outcome).toEqual({ ok: true });
    const after = result.current.visibleTasks;
    expect(after.map((task) => task.id)).toEqual(['id-1', 'id-2', 'id-3']);
    expect(after[0]).toEqual(tasks[0]);
    expect(after[2]).toEqual(tasks[2]);
    expect(after[1].title).toBe('New words');
    expect(after[1].updatedAt).not.toBe(tasks[1].updatedAt);
    expect(after[1].createdAt).toBe(tasks[1].createdAt);
    expect(after[1].completed).toBe(tasks[1].completed);
  });

  it('keeps a complete task complete', () => {
    const tasks = makeTasks(1).map((task) => ({ ...task, completed: true }));
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    const { result } = renderHook(() => useTasks());
    editNow(result, 'id-1', 'Changed');
    expect(result.current.visibleTasks[0].completed).toBe(true);
    expect(result.current.visibleTasks[0].title).toBe('Changed');
  });

  it('refuses empty and too-long titles, changes nothing and starts no save (BR4.4)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result, tasks } = openWith(2);
    expect(editNow(result, 'id-1', '   ')).toEqual({ ok: false, reason: 'empty' });
    expect(editNow(result, 'id-1', 'a'.repeat(201))).toEqual({ ok: false, reason: 'too-long' });
    expect(result.current.visibleTasks).toEqual(tasks);
    await pause(80);
    expect(save).not.toHaveBeenCalled();
  });

  it('accepts exactly 200 visible characters', () => {
    const { result } = openWith(1);
    expect(editNow(result, 'id-1', 'a'.repeat(200))).toEqual({ ok: true });
    expect(result.current.visibleTasks[0].title).toHaveLength(200);
  });

  it('treats the same title (also with spaces around it) as ok, with no change and no save (BR4.5)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result, tasks } = openWith(1);
    expect(editNow(result, 'id-1', `  ${tasks[0].title}  `)).toEqual({ ok: true });
    expect(result.current.visibleTasks).toEqual(tasks);
    await pause(80);
    expect(save).not.toHaveBeenCalled();
  });

  it('is a no-op that returns ok for an unknown id, even with an empty title (BR4.8)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result, tasks } = openWith(2);
    expect(editNow(result, 'missing', '')).toEqual({ ok: true });
    expect(editNow(result, 'missing', 'Words')).toEqual({ ok: true });
    expect(result.current.visibleTasks).toEqual(tasks);
    await pause(80);
    expect(save).not.toHaveBeenCalled();
  });

  it('allows two tasks to have the same title', () => {
    const { result } = openWith(2);
    editNow(result, 'id-2', result.current.visibleTasks[0].title);
    const [a, b] = result.current.visibleTasks;
    expect(a.title).toBe(b.title);
  });

  it('saves the new title after the page has painted (BR4.9)', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    const { result } = openWith(2);
    editNow(result, 'id-1', 'Saved words');
    expect(save).not.toHaveBeenCalled();
    await waitFor(() => expect(savedList()[0].title).toBe('Saved words'));
  });

  it('keeps the change after a failed save, shows save-failed, and the next good save writes it (BR4.9)', async () => {
    vi.spyOn(TaskStorage, 'save').mockReturnValueOnce({ ok: false, reason: 'full' });
    const { result } = openWith(2);
    editNow(result, 'id-1', 'Kept');
    await waitFor(() => expect(result.current.notice?.kind).toBe('save-failed'));
    expect(result.current.visibleTasks[0].title).toBe('Kept');
    act(() => {
      result.current.toggle('id-2');
    });
    await waitFor(() => expect(result.current.notice).toBeNull());
    expect(savedList()[0].title).toBe('Kept');
  });
});

describe('useTasks: remaining', () => {
  function openWithDone(flags) {
    const tasks = makeTasks(flags.length).map((task, index) => ({
      ...task,
      completed: flags[index],
    }));
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    return renderHook(() => useTasks());
  }

  it('counts the incomplete tasks: 2 for three tasks of which one is complete (BR7.1)', () => {
    const { result } = openWithDone([true, false, false]);
    expect(result.current.remaining).toBe(2);
  });

  it('is 0 with no tasks and with all tasks complete', () => {
    expect(renderHook(() => useTasks()).result.current.remaining).toBe(0);
    localStorage.clear();
    const { result } = openWithDone([true, true]);
    expect(result.current.remaining).toBe(0);
  });

  it('goes down on tick and on deleting an incomplete task, up on untick and on add (BR7.3)', () => {
    const { result } = openWithDone([false, false, false]);
    act(() => {
      result.current.toggle('id-1');
    });
    expect(result.current.remaining).toBe(2);
    act(() => {
      result.current.remove('id-2');
    });
    expect(result.current.remaining).toBe(1);
    act(() => {
      result.current.toggle('id-1');
    });
    expect(result.current.remaining).toBe(2);
    act(() => {
      result.current.add('Another');
    });
    expect(result.current.remaining).toBe(3);
  });

  it('does not change on deleting a complete task or on editing a title', () => {
    const { result } = openWithDone([true, false]);
    act(() => {
      result.current.edit('id-2', 'New words');
    });
    expect(result.current.remaining).toBe(1);
    act(() => {
      result.current.remove('id-1');
    });
    expect(result.current.remaining).toBe(1);
  });

  it('follows a list replaced by another tab', () => {
    const { result } = openWithDone([false]);
    otherTab(savedText(makeTasks(3).map((task) => ({ ...task, completed: true }))));
    expect(result.current.remaining).toBe(0);
  });
});

describe('useTasks: notices', () => {
  it('keeps the task on screen after a failed save and shows save-failed (BR1.12)', async () => {
    vi.spyOn(TaskStorage, 'save').mockReturnValueOnce({ ok: false, reason: 'full' });
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('Not saved yet');
    });
    await waitFor(() =>
      expect(result.current.notice).toEqual({ kind: 'save-failed', text: SAVE_FAILED_TEXT }),
    );
    expect(result.current.visibleTasks).toHaveLength(1);
  });

  it('writes the whole list including the failed task on the next add, and clears the notice', async () => {
    const save = vi.spyOn(TaskStorage, 'save');
    save.mockReturnValueOnce({ ok: false, reason: 'full' });
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('First');
    });
    await waitFor(() => expect(result.current.notice?.kind).toBe('save-failed'));
    act(() => {
      result.current.add('Second');
    });
    await waitFor(() => expect(result.current.notice).toBeNull());
    expect(savedList().map((task) => task.title)).toEqual(['Second', 'First']);
  });

  it('returns to load-failed after a good save when the load had failed, and save-failed outranks it', async () => {
    localStorage.setItem(STORAGE_KEY, 'garbage');
    const save = vi.spyOn(TaskStorage, 'save');
    save.mockReturnValueOnce({ ok: false, reason: 'blocked' });
    const { result } = renderHook(() => useTasks());
    expect(result.current.notice?.kind).toBe('load-failed');
    act(() => {
      result.current.add('First');
    });
    await waitFor(() => expect(result.current.notice?.kind).toBe('save-failed'));
    act(() => {
      result.current.add('Second');
    });
    await waitFor(() => expect(result.current.notice?.kind).toBe('load-failed'));
    expect(savedList()).toHaveLength(2);
  });

  it('keeps the notice null after a good save with no earlier failure', async () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('Fine');
    });
    await waitFor(() => expect(savedList()).toHaveLength(1));
    expect(result.current.notice).toBeNull();
  });
});

// A second tab: change the stored text, then tell this tab with a storage event.
function otherTab(text) {
  if (text === null) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, text);
  }
  act(() => {
    window.dispatchEvent(
      new StorageEvent('storage', { key: STORAGE_KEY, storageArea: localStorage }),
    );
  });
}

describe('useTasks: another tab', () => {
  it("replaces the list, and the next save writes the other tab's list plus the new task", async () => {
    const { result } = renderHook(() => useTasks());
    const theirs = makeTasks(2);
    otherTab(savedText(theirs));
    expect(result.current.visibleTasks).toEqual(theirs);
    act(() => {
      result.current.add('Mine');
    });
    await waitFor(() => expect(savedList()).toHaveLength(3));
    expect(savedList().map((task) => task.title)).toEqual([
      'Mine',
      'Task number 1',
      'Task number 2',
    ]);
  });

  it('drops a save that was due but has not run, and starts none', async () => {
    const { result } = renderHook(() => useTasks());
    const theirs = makeTasks(1);
    act(() => {
      result.current.add('Mine');
      localStorage.setItem(STORAGE_KEY, savedText(theirs));
      window.dispatchEvent(
        new StorageEvent('storage', { key: STORAGE_KEY, storageArea: localStorage }),
      );
    });
    await pause(60);
    expect(result.current.visibleTasks).toEqual(theirs);
    expect(savedList()).toEqual(theirs);
  });

  it('clears the save-failed notice when the other tab list arrives', async () => {
    vi.spyOn(TaskStorage, 'save').mockReturnValueOnce({ ok: false, reason: 'full' });
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('Lost');
    });
    await waitFor(() => expect(result.current.notice?.kind).toBe('save-failed'));
    otherTab(savedText(makeTasks(1)));
    expect(result.current.notice).toBeNull();
  });

  it('keeps the list and shows load-failed for damage from another tab, until reload', async () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('Mine');
    });
    await waitFor(() => expect(savedList()).toHaveLength(1));
    otherTab('{damaged');
    expect(result.current.visibleTasks).toHaveLength(1);
    expect(result.current.notice).toEqual({ kind: 'load-failed', text: LOAD_FAILED_TEXT });
    // A later good list from the other tab does not clear it.
    otherTab(savedText(makeTasks(2)));
    expect(result.current.visibleTasks).toHaveLength(2);
    expect(result.current.notice?.kind).toBe('load-failed');
  });

  it('saves this tab list after a backup on the next change after damage', async () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.add('Mine');
    });
    await waitFor(() => expect(savedList()).toHaveLength(1));
    otherTab('{damaged');
    act(() => {
      result.current.add('Next');
    });
    await waitFor(() => expect(savedList()).toHaveLength(2));
    const backups = Object.keys(localStorage).filter((key) => key.startsWith(BACKUP_PREFIX));
    expect(backups).toHaveLength(1);
    expect(localStorage.getItem(backups[0])).toBe('{damaged');
  });

  it('stops following the other tab when the hook is removed', () => {
    const stop = vi.fn();
    vi.spyOn(TaskStorage, 'subscribe').mockReturnValue(stop);
    const { unmount } = renderHook(() => useTasks());
    unmount();
    expect(stop).toHaveBeenCalledTimes(1);
  });
});

describe('newId', () => {
  it('uses the built-in unique id maker when present', () => {
    expect(newId()).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('falls back to a time-plus-random-text id where the maker is missing', () => {
    vi.stubGlobal('crypto', {});
    const first = newId();
    const second = newId();
    expect(first).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
    expect(first).not.toBe(second);
  });
});
