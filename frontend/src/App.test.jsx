import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import * as hookModule from './hooks/useTasks.js';
import { BACKUP_PREFIX, STORAGE_KEY } from './services/taskStorage.js';
import { expectNoAxeViolations } from './test/axe.js';
import { makeTasks, savedText } from './test/tasks.js';

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

afterEach(async () => {
  // Let any post-paint save of this test finish before the next test begins.
  await pause(60);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'sendBeacon');
});

// The title text of each row (the row also holds the Delete button's own text).
function rowTexts() {
  return screen
    .queryAllByTestId('task-item')
    .map((row) => row.querySelector('.task-item__title').textContent);
}

function savedTitles() {
  const text = localStorage.getItem(STORAGE_KEY);
  return text === null ? [] : JSON.parse(text).tasks.map((task) => task.title);
}

describe('App: add a task', () => {
  it('opens with the title, the focus in the input and no rows', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Todo List' })).toBeInTheDocument();
    expect(screen.getByTestId('task-input')).toHaveFocus();
    expect(rowTexts()).toEqual([]);
  });

  it('adds by keyboard only (type, Enter), newest first, input cleared and focused', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('First{Enter}');
    await user.keyboard('Second{Enter}');
    expect(rowTexts()).toEqual(['Second', 'First']);
    expect(screen.getByTestId('task-input')).toHaveValue('');
    expect(screen.getByTestId('task-input')).toHaveFocus();
  });

  it('adds with the Add button after tabbing to it by keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('By button');
    await user.tab();
    expect(screen.getByTestId('add-button')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(rowTexts()).toEqual(['By button']);
  });

  it('refuses an empty title with the message, keeping the text and focus', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('   {Enter}');
    expect(screen.getByTestId('task-form-message')).toHaveTextContent('Please enter a task title.');
    expect(screen.getByTestId('task-input')).toHaveValue('   ');
    expect(screen.getByTestId('task-input')).toHaveFocus();
    expect(rowTexts()).toEqual([]);
  });

  it('refuses a 201-character title and accepts exactly 200', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.paste('a'.repeat(201));
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('task-form-message')).toHaveTextContent(
      'Title must be 200 characters or fewer.',
    );
    expect(screen.getByTestId('task-input')).toHaveValue('a'.repeat(201));
    expect(rowTexts()).toEqual([]);

    await user.clear(screen.getByTestId('task-input'));
    await user.paste('b'.repeat(200));
    await user.keyboard('{Enter}');
    expect(rowTexts()).toEqual(['b'.repeat(200)]);
    expect(screen.queryByTestId('task-form-message')).not.toBeInTheDocument();
  });

  it('allows duplicate titles as two rows', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('Same{Enter}Same{Enter}');
    expect(rowTexts()).toEqual(['Same', 'Same']);
  });

  it('shows markup as typed, with no bold element', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.paste('<b>x</b>');
    await user.keyboard('{Enter}');
    expect(rowTexts()).toEqual(['<b>x</b>']);
    expect(container.querySelector('b')).toBeNull();
  });

  it('adds one task for a second submit straight after the first (BR1.16)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('Once{Enter}{Enter}');
    expect(rowTexts()).toEqual(['Once']);
    expect(screen.getByTestId('task-form-message')).toHaveTextContent('Please enter a task title.');
  });
});

describe('App: reload and storage', () => {
  it('shows the saved tasks in the same order after a reload', async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await user.keyboard('One{Enter}Two{Enter}Three{Enter}');
    await waitFor(() => expect(savedTitles()).toEqual(['Three', 'Two', 'One']));
    first.unmount();
    render(<App />);
    expect(rowTexts()).toEqual(['Three', 'Two', 'One']);
    expect(screen.getByTestId('task-input')).toHaveFocus();
  });

  it('shows the load-failed notice and an empty list for unreadable saved data, then backs it up on the first add', async () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByTestId('notice')).toHaveTextContent('Your tasks could not be loaded.');
    expect(rowTexts()).toEqual([]);
    await user.keyboard('Fresh{Enter}');
    await waitFor(() => expect(savedTitles()).toEqual(['Fresh']));
    const backups = Object.keys(localStorage).filter((key) => key.startsWith(BACKUP_PREFIX));
    expect(backups).toHaveLength(1);
    expect(localStorage.getItem(backups[0])).toBe('{broken');
    // The load-failed message stays until the page is reloaded.
    expect(screen.getByTestId('notice')).toHaveTextContent('Your tasks could not be loaded.');
  });

  it('shows the save-failed notice, keeps the task on screen, and clears it after a good save', async () => {
    const user = userEvent.setup();
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    render(<App />);
    await user.keyboard('Lost?{Enter}');
    await waitFor(() =>
      expect(screen.getByTestId('notice')).toHaveTextContent('Your change could not be saved.'),
    );
    expect(rowTexts()).toEqual(['Lost?']);
    await user.keyboard('Next{Enter}');
    await waitFor(() => expect(screen.queryByTestId('notice')).not.toBeInTheDocument());
    expect(savedTitles()).toEqual(['Next', 'Lost?']);
    expect(setItem).toHaveBeenCalledTimes(2);
  });
});

function savedCompleted() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)).tasks.map((task) => task.completed);
}

describe('App: complete a task', () => {
  it('ticks the second of three tasks by keyboard only, keeping its position', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const user = userEvent.setup();
    render(<App />);
    // The input has focus on open; Tab goes to the Add button, the first checkbox, the first
    // row's Edit and Delete buttons, then the second checkbox.
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    const boxes = screen.getAllByTestId('task-checkbox');
    expect(boxes[1]).toHaveFocus();
    await user.keyboard(' ');
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 2', 'Task number 3']);
    expect(screen.getAllByTestId('task-checkbox').map((box) => box.checked)).toEqual([
      false,
      true,
      false,
    ]);
    expect(screen.getAllByTestId('task-item')[1]).toHaveClass('task-item--completed');
    expect(screen.getAllByTestId('task-checkbox')[1]).toHaveFocus();
  });

  it('unticks again with a second click', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    const box = screen.getAllByTestId('task-checkbox')[0];
    await user.click(box);
    expect(box).toBeChecked();
    await user.click(box);
    expect(box).not.toBeChecked();
  });

  it('shows the saved complete state after a reload', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const user = userEvent.setup();
    const first = render(<App />);
    await user.click(screen.getAllByTestId('task-checkbox')[1]);
    await waitFor(() => expect(savedCompleted()).toEqual([false, true, false]));
    first.unmount();
    render(<App />);
    expect(screen.getAllByTestId('task-checkbox').map((box) => box.checked)).toEqual([
      false,
      true,
      false,
    ]);
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 2', 'Task number 3']);
  });

  it('does not toggle when the title text is clicked (BR2.6)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(1)));
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Task number 1'));
    expect(screen.getByTestId('task-checkbox')).not.toBeChecked();
    await pause(80);
    expect(savedCompleted()).toEqual([false]);
  });

  it('keeps the change on screen and shows the notice when the save fails (BR2.8)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByTestId('task-checkbox')[0]);
    await waitFor(() =>
      expect(screen.getByTestId('notice')).toHaveTextContent('Your change could not be saved.'),
    );
    expect(screen.getAllByTestId('task-checkbox')[0]).toBeChecked();
    await user.click(screen.getAllByTestId('task-checkbox')[1]);
    await waitFor(() => expect(screen.queryByTestId('notice')).not.toBeInTheDocument());
    expect(savedCompleted()).toEqual([true, true]);
  });

  it('has no axe violations with a complete task shown', async () => {
    const tasks = makeTasks(3);
    tasks[1] = { ...tasks[1], completed: true };
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    const { container } = render(<App />);
    expect(screen.getByRole('checkbox', { name: 'Task number 2' })).toBeChecked();
    await expectNoAxeViolations(container);
  });

  it('toggles in a list of 100 saved tasks in under 100 ms of code time (NFR1, regression guard only)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(100)));
    render(<App />);
    const box = screen.getAllByTestId('task-checkbox')[50];
    const started = performance.now();
    fireEvent.click(box);
    const elapsed = performance.now() - started;
    expect(screen.getAllByTestId('task-checkbox')[50]).toBeChecked();
    expect(screen.getAllByTestId('task-item')).toHaveLength(100);
    expect(elapsed).toBeLessThan(100);
  });
});

function savedIds() {
  const text = localStorage.getItem(STORAGE_KEY);
  return text === null ? [] : JSON.parse(text).tasks.map((task) => task.id);
}

function dialog() {
  return screen.getByTestId('delete-dialog');
}

function openDialogFor(index) {
  fireEvent.click(screen.getAllByTestId('delete-button')[index]);
}

function pressEsc() {
  const event = createEvent('cancel', dialog(), { cancelable: true });
  fireEvent(dialog(), event);
  return event;
}

describe('App: delete a task', () => {
  it('opens the dialog for that task with Cancel focused and the task still listed (AC3.1.1)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByTestId('delete-button')[1]);
    expect(dialog()).toHaveAttribute('open');
    expect(screen.getByRole('heading', { name: 'Delete this task?' })).toBeInTheDocument();
    expect(screen.getByTestId('delete-dialog-title')).toHaveTextContent('“Task number 2”');
    expect(screen.getByTestId('delete-dialog-cancel')).toHaveFocus();
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 2', 'Task number 3']);
  });

  it('removes the task on Delete and a reload keeps it gone (AC3.1.2)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const user = userEvent.setup();
    const first = render(<App />);
    await user.click(screen.getAllByTestId('delete-button')[1]);
    await user.click(screen.getByTestId('delete-dialog-confirm'));
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 3']);
    expect(dialog()).not.toHaveAttribute('open');
    await waitFor(() => expect(savedIds()).toEqual(['id-1', 'id-3']));
    first.unmount();
    render(<App />);
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 3']);
  });

  it('keeps the task on Cancel and returns focus to that row’s Delete button (AC3.1.3)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByTestId('delete-button')[1]);
    await user.click(screen.getByTestId('delete-dialog-cancel'));
    expect(dialog()).not.toHaveAttribute('open');
    expect(rowTexts()).toHaveLength(3);
    expect(screen.getAllByTestId('delete-button')[1]).toHaveFocus();
    await pause(80);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(savedText(makeTasks(3)));
  });

  it('keeps the task on Esc and returns focus to that row’s Delete button (AC3.1.3)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    render(<App />);
    openDialogFor(2);
    const event = pressEsc();
    expect(event.defaultPrevented).toBe(true);
    expect(dialog()).not.toHaveAttribute('open');
    expect(rowTexts()).toHaveLength(3);
    expect(screen.getAllByTestId('delete-button')[2]).toHaveFocus();
  });

  it('does nothing when the backdrop (the dialog area itself) is clicked', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByTestId('delete-button')[0]);
    await user.click(dialog());
    expect(dialog()).toHaveAttribute('open');
    expect(rowTexts()).toHaveLength(2);
  });

  it('deletes by keyboard only: Tab to Delete, Enter, Tab, Enter (AC3.1.4)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    // Input, then Add, then the first row's checkbox, Edit button, then its Delete button.
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(screen.getAllByTestId('delete-button')[0]).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('delete-dialog-cancel')).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId('delete-dialog-confirm')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(rowTexts()).toEqual(['Task number 2']);
  });

  it('deletes in a list of 100 saved tasks in under 100 ms of code time (NFR1, regression guard only)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(100)));
    render(<App />);
    openDialogFor(50);
    const confirm = screen.getByTestId('delete-dialog-confirm');
    const started = performance.now();
    fireEvent.click(confirm);
    const elapsed = performance.now() - started;
    expect(screen.queryByText('Task number 51')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('task-item')).toHaveLength(99);
    expect(elapsed).toBeLessThan(100);
  });

  it('moves focus to the next row’s checkbox after a delete (BR3.6)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    render(<App />);
    openDialogFor(1);
    fireEvent.click(screen.getByTestId('delete-dialog-confirm'));
    expect(screen.getAllByTestId('task-checkbox')[1]).toHaveFocus();
    expect(screen.getAllByTestId('task-item')[1]).toHaveTextContent('Task number 3');
  });

  it('moves focus to the row above when the last row is deleted (BR3.6)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    render(<App />);
    openDialogFor(2);
    fireEvent.click(screen.getByTestId('delete-dialog-confirm'));
    expect(screen.getAllByTestId('task-checkbox')[1]).toHaveFocus();
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 2']);
  });

  it('moves focus to the add input when the only task is deleted (BR3.6)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(1)));
    render(<App />);
    openDialogFor(0);
    fireEvent.click(screen.getByTestId('delete-dialog-confirm'));
    expect(rowTexts()).toEqual([]);
    expect(screen.getByTestId('task-input')).toHaveFocus();
  });

  it('keeps the order of the remaining tasks', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(5)));
    render(<App />);
    openDialogFor(0);
    fireEvent.click(screen.getByTestId('delete-dialog-confirm'));
    openDialogFor(2);
    fireEvent.click(screen.getByTestId('delete-dialog-confirm'));
    expect(rowTexts()).toEqual(['Task number 2', 'Task number 3', 'Task number 5']);
  });

  it('keeps the removal on screen and shows the notice when the save fails (BR3.9)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByTestId('delete-button')[0]);
    await user.click(screen.getByTestId('delete-dialog-confirm'));
    await waitFor(() =>
      expect(screen.getByTestId('notice')).toHaveTextContent('Your change could not be saved.'),
    );
    expect(rowTexts()).toEqual(['Task number 2']);
  });

  it('has no axe violations with the dialog closed and open', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const { container } = render(<App />);
    await expectNoAxeViolations(container);
    openDialogFor(0);
    expect(dialog()).toHaveAttribute('open');
    await expectNoAxeViolations(container);
  });

  it('closes the dialog with nothing removed when its task has left the list (BR3.8)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const original = hookModule.useTasks;
    let hidden = null;
    vi.spyOn(hookModule, 'useTasks').mockImplementation(() => {
      const state = original();
      return hidden === null
        ? state
        : { ...state, visibleTasks: state.visibleTasks.filter((task) => task.id !== hidden) };
    });
    const { rerender } = render(<App />);
    openDialogFor(1);
    expect(dialog()).toHaveAttribute('open');
    hidden = 'id-2';
    rerender(<App />);
    expect(dialog()).not.toHaveAttribute('open');
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 3']);
    expect(screen.getByTestId('task-input')).toHaveFocus();
  });
});

// The title of each row, also while one row is being edited (the title stays in the page).
function titles() {
  return screen
    .queryAllByTestId('task-item')
    .map((row) => row.querySelector('[id^="task-title-"]').textContent);
}

function editInput() {
  return screen.getByTestId('task-edit-input');
}

function openEditFor(index) {
  fireEvent.click(screen.getAllByTestId('edit-button')[index]);
}

function savedTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)).tasks;
}

describe('App: edit a task', () => {
  it('opens the field with the saved title selected and focused (AC4.1.1)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    render(<App />);
    openEditFor(1);
    expect(editInput()).toHaveValue('Task number 2');
    expect(editInput()).toHaveFocus();
    expect(editInput().selectionStart).toBe(0);
    expect(editInput().selectionEnd).toBe('Task number 2'.length);
    expect(screen.getAllByTestId('task-edit-form')).toHaveLength(1);
  });

  it('saves with Enter, keeps position and complete state, and a reload keeps it (AC4.1.2, AC4.1.5)', async () => {
    const tasks = makeTasks(3);
    tasks[1] = { ...tasks[1], completed: true };
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    const user = userEvent.setup();
    const first = render(<App />);
    openEditFor(1);
    await user.clear(editInput());
    await user.keyboard('  Renamed  {Enter}');
    expect(titles()).toEqual(['Task number 1', 'Renamed', 'Task number 3']);
    expect(screen.queryByTestId('task-edit-form')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('task-checkbox')[1]).toBeChecked();
    expect(screen.getAllByTestId('edit-button')[1]).toHaveFocus();
    await waitFor(() => expect(savedTasks()[1].title).toBe('Renamed'));
    first.unmount();
    render(<App />);
    expect(titles()).toEqual(['Task number 1', 'Renamed', 'Task number 3']);
  });

  it('saves with the Save button', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    openEditFor(0);
    await user.clear(editInput());
    await user.type(editInput(), 'By button');
    await user.click(screen.getByTestId('task-edit-save'));
    expect(titles()).toEqual(['By button', 'Task number 2']);
    await waitFor(() => expect(savedTasks()[0].title).toBe('By button'));
  });

  it('keeps the old title on Esc and on Cancel and returns focus to the Edit button (AC4.1.3)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    openEditFor(1);
    await user.keyboard('typed{Escape}');
    expect(titles()).toEqual(['Task number 1', 'Task number 2']);
    expect(screen.getAllByTestId('edit-button')[1]).toHaveFocus();
    openEditFor(1);
    await user.keyboard('typed');
    await user.click(screen.getByTestId('task-edit-cancel'));
    expect(titles()).toEqual(['Task number 1', 'Task number 2']);
    expect(screen.getAllByTestId('edit-button')[1]).toHaveFocus();
    await pause(80);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(savedText(makeTasks(2)));
  });

  it('refuses empty, spaces-only and 201 characters with the add messages, and accepts 200 (AC4.1.4)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    openEditFor(0);
    await user.clear(editInput());
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('task-edit-message')).toHaveTextContent(
      '(!) Please enter a task title.',
    );
    await user.keyboard('   {Enter}');
    expect(screen.getByTestId('task-edit-message')).toHaveTextContent('Please enter a task title.');
    await user.clear(editInput());
    await user.paste('a'.repeat(201));
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('task-edit-message')).toHaveTextContent(
      'Title must be 200 characters or fewer.',
    );
    expect(editInput()).toHaveFocus();
    expect(titles()).toEqual(['Task number 1', 'Task number 2']);
    await user.clear(editInput());
    await user.paste('b'.repeat(200));
    await user.keyboard('{Enter}');
    expect(titles()[0]).toBe('b'.repeat(200));
    expect(screen.queryByTestId('task-edit-message')).not.toBeInTheDocument();
  });

  it('closes like Cancel for an unchanged title, with nothing saved (Q1)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    openEditFor(0);
    await user.keyboard('{Enter}');
    expect(screen.queryByTestId('task-edit-form')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('edit-button')[0]).toHaveFocus();
    await pause(80);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(savedText(makeTasks(2)));
  });

  it('leaves the field open with its text when the person clicks elsewhere (Q2)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    openEditFor(0);
    await user.keyboard('half typed');
    await user.click(screen.getByRole('heading', { name: 'Todo List' }));
    expect(editInput()).toHaveValue('half typed');
  });

  it('drops the first edit when Edit is pressed on a second row, and starts fresh on return (Q3, BR4.1)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const user = userEvent.setup();
    render(<App />);
    openEditFor(0);
    await user.keyboard('lost words');
    // The edited row has no Edit button, so index 0 is now the second row.
    openEditFor(0);
    expect(screen.getAllByTestId('task-edit-form')).toHaveLength(1);
    expect(editInput()).toHaveValue('Task number 2');
    expect(editInput()).toHaveFocus();
    expect(titles()).toEqual(['Task number 1', 'Task number 2', 'Task number 3']);
    openEditFor(0);
    expect(editInput()).toHaveValue('Task number 1');
    expect(editInput().selectionEnd).toBe('Task number 1'.length);
    expect(screen.queryByTestId('task-edit-message')).not.toBeInTheDocument();
  });

  it('edits by keyboard only, and tabs checkbox, field, Save, Cancel while editing', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    render(<App />);
    // Input, Add, checkbox 1, Edit 1.
    await user.tab();
    await user.tab();
    await user.tab();
    expect(screen.getAllByTestId('edit-button')[0]).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(editInput()).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId('task-edit-save')).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId('task-edit-cancel')).toHaveFocus();
    await user.tab({ shift: true });
    await user.tab({ shift: true });
    await user.tab({ shift: true });
    expect(screen.getAllByTestId('task-checkbox')[0]).toHaveFocus();
    await user.tab();
    await user.clear(editInput());
    await user.keyboard('Keys only{Enter}');
    expect(titles()[0]).toBe('Keys only');
  });

  it('keeps the edit and its text while Delete is used on another row (BR4.13)', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const user = userEvent.setup();
    render(<App />);
    openEditFor(0);
    await user.keyboard('Draft');
    // The edited row has no Delete button, so index 0 is the second row.
    await user.click(screen.getAllByTestId('delete-button')[0]);
    expect(dialog()).toHaveAttribute('open');
    await user.click(screen.getByTestId('delete-dialog-cancel'));
    expect(editInput()).toHaveValue('Draft');
    await user.click(screen.getAllByTestId('delete-button')[0]);
    await user.click(screen.getByTestId('delete-dialog-confirm'));
    expect(titles()).toEqual(['Task number 1', 'Task number 3']);
    expect(editInput()).toHaveValue('Draft');
  });

  it('does not reopen a task in editing when it is hidden and shown again (BR4.12)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const original = hookModule.useTasks;
    let hidden = null;
    vi.spyOn(hookModule, 'useTasks').mockImplementation(() => {
      const state = original();
      return hidden === null
        ? state
        : { ...state, visibleTasks: state.visibleTasks.filter((task) => task.id !== hidden) };
    });
    const { rerender } = render(<App />);
    openEditFor(1);
    hidden = 'id-2';
    rerender(<App />);
    expect(titles()).toEqual(['Task number 1', 'Task number 3']);
    hidden = null;
    rerender(<App />);
    expect(titles()).toEqual(['Task number 1', 'Task number 2', 'Task number 3']);
    expect(screen.queryByTestId('task-edit-form')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('edit-button')[1]).not.toHaveFocus();
  });

  it('keeps the change on screen and shows the notice when the save fails', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const user = userEvent.setup();
    render(<App />);
    openEditFor(0);
    await user.clear(editInput());
    await user.keyboard('Unsaved{Enter}');
    await waitFor(() =>
      expect(screen.getByTestId('notice')).toHaveTextContent('Your change could not be saved.'),
    );
    expect(titles()).toEqual(['Unsaved', 'Task number 2']);
  });

  it('has no axe violations while a row is edited, with and without a message', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    const user = userEvent.setup();
    const { container } = render(<App />);
    openEditFor(0);
    await expectNoAxeViolations(container);
    await user.clear(editInput());
    await user.keyboard('{Enter}');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

describe('App: empty guidance', () => {
  it('shows the hint on a first visit (AC9.1.1)', () => {
    render(<App />);
    expect(screen.getByTestId('empty-hint')).toHaveTextContent('No tasks yet. Add one above.');
  });

  it('removes the hint when the first task is added and brings it back after the last is deleted (AC9.1.2, BR9.3)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('Only{Enter}');
    expect(screen.queryByTestId('empty-hint')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('delete-button'));
    await user.click(screen.getByTestId('delete-dialog-confirm'));
    expect(screen.getByTestId('empty-hint')).toBeInTheDocument();
  });

  it('shows the hint beside the load-failed notice for unreadable saved data (Q1, BR9.4)', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    render(<App />);
    expect(screen.getByTestId('notice')).toHaveTextContent('Your tasks could not be loaded.');
    expect(screen.getByTestId('empty-hint')).toBeInTheDocument();
  });
});

describe('App: storage note', () => {
  const NOTE = 'Your tasks are saved in this browser only.';

  it('shows the line on a first visit with an empty list (AC8.1.1)', () => {
    render(<App />);
    expect(screen.getByTestId('storage-note')).toHaveTextContent(NOTE);
  });

  it('shows the same line when tasks are saved (AC8.1.2)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    render(<App />);
    expect(screen.getByTestId('storage-note')).toHaveTextContent(NOTE);
  });

  it('shows the line after the title and before the message line while a message shows (BR8.3, BR8.4)', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    render(<App />);
    const note = screen.getByTestId('storage-note');
    const title = screen.getByRole('heading', { name: 'Todo List' });
    expect(note).toHaveTextContent(NOTE);
    expect(title.compareDocumentPosition(note)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(note.compareDocumentPosition(screen.getByTestId('notice'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});

describe('App: no network (NFR5.1)', () => {
  it('makes no network call while adding and reloading', async () => {
    const fetchSpy = vi.fn();
    const xhrSpy = vi.fn();
    const beaconSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    vi.stubGlobal('XMLHttpRequest', xhrSpy);
    Object.defineProperty(navigator, 'sendBeacon', { value: beaconSpy, configurable: true });
    const user = userEvent.setup();
    const first = render(<App />);
    await user.keyboard('Private{Enter}');
    await waitFor(() => expect(savedTitles()).toEqual(['Private']));
    first.unmount();
    render(<App />);
    expect(rowTexts()).toEqual(['Private']);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
    expect(beaconSpy).not.toHaveBeenCalled();
  });
});

describe('App: speed guard (NFR1.3, regression guard only)', () => {
  it('adds to a list of 100 saved tasks in under 100 ms of code time', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(100)));
    render(<App />);
    expect(screen.getAllByTestId('task-item')).toHaveLength(100);
    const input = screen.getByTestId('task-input');
    fireEvent.change(input, { target: { value: 'The hundred and first' } });
    const started = performance.now();
    fireEvent.submit(screen.getByTestId('task-form'));
    const elapsed = performance.now() - started;
    expect(screen.getAllByTestId('task-item')).toHaveLength(101);
    expect(
      within(screen.getByTestId('task-list')).getAllByTestId('task-item')[0],
    ).toHaveTextContent('The hundred and first');
    expect(elapsed).toBeLessThan(100);
  });
});

describe('App: accessibility (NFR3.4)', () => {
  it('has no axe violations on the empty page', async () => {
    const { container } = render(<App />);
    await expectNoAxeViolations(container);
  });

  it('has no axe violations on the page with tasks', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const { container } = render(<App />);
    await expectNoAxeViolations(container);
  });

  it('has no axe violations in the refused state, and the message is an alert linked to the input', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.keyboard('{Enter}');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('(!) Please enter a task title.');
    expect(screen.getByTestId('task-input')).toHaveAttribute('aria-describedby', alert.id);
    expect(screen.getByTestId('task-input')).toHaveAttribute('aria-invalid', 'true');
    await expectNoAxeViolations(container);
  });

  it('has no axe violations with a storage notice shown', async () => {
    localStorage.setItem(STORAGE_KEY, 'broken');
    const { container } = render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('Your tasks could not be loaded.');
    await expectNoAxeViolations(container);
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

describe('App: a second tab stays in step', () => {
  it('shows a task added in the other tab with no message and focus unchanged (AC6.1.4)', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(1)));
    render(<App />);
    expect(screen.getByTestId('task-input')).toHaveFocus();
    otherTab(savedText(makeTasks(2)));
    expect(rowTexts()).toEqual(['Task number 1', 'Task number 2']);
    expect(screen.queryByTestId('notice')).not.toBeInTheDocument();
    expect(screen.getByTestId('task-input')).toHaveFocus();
  });

  it('empties the list with no message when the other tab clears everything', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    render(<App />);
    otherTab(null);
    expect(rowTexts()).toEqual([]);
    expect(screen.queryByTestId('notice')).not.toBeInTheDocument();
  });

  it('keeps the list for damage from the other tab, shows the message above the add row, and backs up at the next change', async () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(1)));
    const user = userEvent.setup();
    render(<App />);
    otherTab('{damaged');
    expect(rowTexts()).toEqual(['Task number 1']);
    const notice = screen.getByTestId('notice');
    expect(notice).toHaveTextContent('Your tasks could not be loaded.');
    expect(notice.compareDocumentPosition(screen.getByTestId('task-input'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    await user.keyboard('Mine{Enter}');
    await waitFor(() => expect(savedTitles()).toEqual(['Mine', 'Task number 1']));
    const backups = Object.keys(localStorage).filter((key) => key.startsWith(BACKUP_PREFIX));
    expect(backups).toHaveLength(1);
    expect(localStorage.getItem(backups[0])).toBe('{damaged');
  });

  it('ends an edit when its task is removed in the other tab, and closes its delete dialog', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    render(<App />);
    openEditFor(0);
    expect(screen.getByTestId('task-edit-form')).toBeInTheDocument();
    otherTab(savedText(makeTasks(2).slice(1)));
    expect(screen.queryByTestId('task-edit-form')).not.toBeInTheDocument();

    openDialogFor(0);
    expect(dialog()).toHaveAttribute('open');
    otherTab(savedText([]));
    expect(dialog()).not.toHaveAttribute('open');
    expect(rowTexts()).toEqual([]);
  });
});

describe('App: count remaining', () => {
  const counter = () => screen.getByRole('status');

  it('shows the status line on the first render, "0 items left" on a first visit', () => {
    render(<App />);
    expect(counter()).toHaveTextContent('0 items left');
    expect(counter()).toBe(screen.getByTestId('counter'));
    expect(screen.queryAllByRole('status')).toHaveLength(1);
  });

  it('reads "2 items left" for three tasks of which one is complete (AC7.1.1)', () => {
    const tasks = makeTasks(3).map((task, index) => ({ ...task, completed: index === 0 }));
    localStorage.setItem(STORAGE_KEY, savedText(tasks));
    render(<App />);
    expect(counter()).toHaveTextContent('2 items left');
  });

  it('changes its text after tick, untick, add and delete (AC7.1.3)', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(2)));
    render(<App />);
    expect(counter()).toHaveTextContent('2 items left');
    await user.click(screen.getAllByTestId('task-checkbox')[0]);
    expect(counter()).toHaveTextContent('1 item left');
    await user.click(screen.getAllByTestId('task-checkbox')[0]);
    expect(counter()).toHaveTextContent('2 items left');
    await user.type(screen.getByTestId('task-input'), 'Third{Enter}');
    expect(counter()).toHaveTextContent('3 items left');
    openDialogFor(0);
    fireEvent.click(screen.getByTestId('delete-dialog-confirm'));
    expect(counter()).toHaveTextContent('2 items left');
  });

  it('shows the count after a reload with saved tasks and beside the load-failed message', () => {
    localStorage.setItem(STORAGE_KEY, savedText(makeTasks(3)));
    const first = render(<App />);
    first.unmount();
    render(<App />);
    expect(counter()).toHaveTextContent('3 items left');
    localStorage.setItem(STORAGE_KEY, '{broken');
    cleanup();
    render(<App />);
    expect(screen.getByTestId('notice')).toBeInTheDocument();
    expect(counter()).toHaveTextContent('0 items left');
  });
});
