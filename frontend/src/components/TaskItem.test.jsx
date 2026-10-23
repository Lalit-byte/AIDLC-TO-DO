import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeTask } from '../test/tasks.js';
import TaskItem from './TaskItem.jsx';

function renderItem(task, onToggle = () => {}, onAskDelete = () => {}) {
  // A list item must sit in a list to be valid markup.
  return render(
    <ul>
      <TaskItem task={task} onToggle={onToggle} onAskDelete={onAskDelete} />
    </ul>,
  );
}

describe('TaskItem: edit', () => {
  function renderEditable(props = {}) {
    const handlers = {
      onToggle: vi.fn(),
      onAskDelete: vi.fn(),
      onStartEdit: vi.fn(),
      onEndEdit: vi.fn(),
      onEdit: vi.fn(() => ({ ok: true })),
    };
    render(
      <ul>
        <TaskItem task={makeTask({ title: 'Buy milk' })} {...handlers} {...props} />
      </ul>,
    );
    return handlers;
  }

  it('has an Edit button named Edit plus the title that starts the edit', async () => {
    const user = userEvent.setup();
    const { onStartEdit } = renderEditable();
    await user.click(screen.getByRole('button', { name: 'Edit Buy milk' }));
    expect(onStartEdit).toHaveBeenCalledWith('id-1');
  });

  it('replaces Edit and Delete with the field, Save and Cancel while editing, and the checkbox keeps its name', () => {
    renderEditable({ editingId: 'id-1' });
    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('task-edit-input')).toBeInTheDocument();
    expect(screen.getByTestId('task-edit-save')).toBeInTheDocument();
    expect(screen.getByTestId('task-edit-cancel')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeInTheDocument();
  });

  it('cancels on Esc from the field and from the checkbox', async () => {
    const user = userEvent.setup();
    const { onEndEdit } = renderEditable({ editingId: 'id-1' });
    await user.keyboard('{Escape}');
    screen.getByTestId('task-checkbox').focus();
    await user.keyboard('{Escape}');
    expect(onEndEdit).toHaveBeenCalledTimes(2);
    expect(onEndEdit).toHaveBeenCalledWith(true);
  });

  it('ends the edit after an accepted save and stays after a refused one', async () => {
    const user = userEvent.setup();
    const onEdit = vi
      .fn()
      .mockReturnValueOnce({ ok: false, reason: 'empty' })
      .mockReturnValueOnce({ ok: true });
    const { onEndEdit } = renderEditable({ editingId: 'id-1', onEdit });
    await user.click(screen.getByTestId('task-edit-save'));
    expect(onEdit).toHaveBeenCalledWith('id-1', 'Buy milk');
    expect(onEndEdit).not.toHaveBeenCalled();
    expect(screen.getByTestId('task-edit-message')).toBeInTheDocument();
    await user.click(screen.getByTestId('task-edit-save'));
    expect(onEndEdit).toHaveBeenCalledWith(true);
  });
});

describe('TaskItem', () => {
  it('shows the title', () => {
    renderItem(makeTask({ title: 'Buy milk' }));
    expect(screen.getByTestId('task-item')).toHaveTextContent('Buy milk');
  });

  it('shows markup as literal text, never as an element (NFR4.1)', () => {
    const { container } = renderItem(makeTask({ title: '<b>x</b>' }));
    expect(screen.getByTestId('task-item')).toHaveTextContent('<b>x</b>');
    expect(container.querySelector('b')).toBeNull();
  });

  it('does not run a script-like title', () => {
    const { container } = renderItem(makeTask({ title: '<img src=x onerror=alert(1)>' }));
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByTestId('task-item')).toHaveTextContent('<img src=x onerror=alert(1)>');
  });

  it('keeps a very long unbroken title in the row', () => {
    const title = 'w'.repeat(200);
    renderItem(makeTask({ title }));
    expect(screen.getByTestId('task-item')).toHaveTextContent(title);
  });
});

describe('TaskItem: delete button', () => {
  it('is present and named "Delete" plus the title (BR3.10)', () => {
    renderItem(makeTask({ title: 'Buy milk' }));
    expect(screen.getByRole('button', { name: 'Delete Buy milk' })).toBeInTheDocument();
  });

  it('names the button by the title even when it looks like markup', () => {
    renderItem(makeTask({ title: '<b>x</b>' }));
    expect(screen.getByRole('button', { name: 'Delete <b>x</b>' })).toBeInTheDocument();
  });

  it('calls onAskDelete with the id when clicked', async () => {
    const onAskDelete = vi.fn();
    renderItem(makeTask({ id: 'abc' }), () => {}, onAskDelete);
    await userEvent.setup().click(screen.getByTestId('delete-button'));
    expect(onAskDelete).toHaveBeenCalledTimes(1);
    expect(onAskDelete).toHaveBeenCalledWith('abc');
  });

  it('does the same with Enter and with Space when it has focus', async () => {
    const onAskDelete = vi.fn();
    const user = userEvent.setup();
    renderItem(makeTask({ id: 'k1' }), () => {}, onAskDelete);
    screen.getByTestId('delete-button').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onAskDelete.mock.calls).toEqual([['k1'], ['k1']]);
  });

  it('does not toggle the task', async () => {
    const onToggle = vi.fn();
    renderItem(makeTask(), onToggle);
    await userEvent.setup().click(screen.getByTestId('delete-button'));
    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.getByTestId('task-checkbox')).not.toBeChecked();
  });

  it('marks the row with the task id', () => {
    renderItem(makeTask({ id: 'row-9' }));
    expect(screen.getByTestId('task-item')).toHaveAttribute('data-task-id', 'row-9');
  });
});

describe('TaskItem: complete checkbox', () => {
  it('is unticked for an incomplete task and ticked for a complete one', () => {
    const first = renderItem(makeTask({ completed: false }));
    expect(screen.getByTestId('task-checkbox')).not.toBeChecked();
    first.unmount();
    renderItem(makeTask({ completed: true }));
    expect(screen.getByTestId('task-checkbox')).toBeChecked();
  });

  it('calls onToggle with the task id when the checkbox is clicked (and only once)', async () => {
    const onToggle = vi.fn();
    renderItem(makeTask({ id: 'abc' }), onToggle);
    await userEvent.setup().click(screen.getByTestId('task-checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('abc');
  });

  it('shows the muted line-through look only for a complete task (BR2.3)', () => {
    const first = renderItem(makeTask({ completed: true }));
    expect(screen.getByTestId('task-item')).toHaveClass('task-item--completed');
    first.unmount();
    renderItem(makeTask({ completed: false }));
    expect(screen.getByTestId('task-item')).not.toHaveClass('task-item--completed');
  });

  it('does nothing when the title text is clicked (BR2.6)', async () => {
    const onToggle = vi.fn();
    renderItem(makeTask({ title: 'Buy milk' }), onToggle);
    await userEvent.setup().click(screen.getByText('Buy milk'));
    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.getByTestId('task-checkbox')).not.toBeChecked();
  });

  it('names the checkbox by the task title, including markup-like text (BR2.7)', () => {
    renderItem(makeTask({ title: '<b>x</b>' }));
    expect(screen.getByRole('checkbox', { name: '<b>x</b>' })).toBeInTheDocument();
  });

  it('toggles with the Space key when the checkbox has focus (BR2.5)', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    renderItem(makeTask({ id: 'k1' }), onToggle);
    await user.tab();
    expect(screen.getByTestId('task-checkbox')).toHaveFocus();
    await user.keyboard(' ');
    expect(onToggle).toHaveBeenCalledWith('k1');
  });
});
