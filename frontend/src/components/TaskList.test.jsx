import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeTask, makeTasks } from '../test/tasks.js';
import TaskList from './TaskList.jsx';

describe('TaskList', () => {
  it('shows the tasks in the order given', () => {
    const tasks = [
      makeTask({ id: 'c', title: 'Third added' }),
      makeTask({ id: 'b', title: 'Second added' }),
      makeTask({ id: 'a', title: 'First added' }),
    ];
    render(<TaskList tasks={tasks} hasTasks />);
    const rows = within(screen.getByTestId('task-list')).getAllByTestId('task-item');
    expect(rows.map((row) => row.querySelector('.task-item__title').textContent)).toEqual([
      'Third added',
      'Second added',
      'First added',
    ]);
  });

  it('renders no list element for an empty list', () => {
    render(<TaskList tasks={[]} hasTasks={false} />);
    expect(screen.queryByTestId('task-list')).not.toBeInTheDocument();
  });

  it('shows the hint with the exact text when there are no tasks at all', () => {
    render(<TaskList tasks={[]} hasTasks={false} />);
    const hint = screen.getByTestId('empty-hint');
    expect(hint).toHaveTextContent(/^No tasks yet\. Add one above\.$/);
    expect(hint.tagName).toBe('P');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows no hint when tasks exist', () => {
    render(<TaskList tasks={makeTasks(2)} hasTasks />);
    expect(screen.queryByTestId('empty-hint')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('task-item')).toHaveLength(2);
  });

  it('keeps existing rows when a task is added at the front', () => {
    const tasks = makeTasks(3);
    const { rerender } = render(<TaskList tasks={tasks} hasTasks />);
    const before = screen.getAllByTestId('task-item');
    rerender(<TaskList tasks={[makeTask({ id: 'new', title: 'New' }), ...tasks]} hasTasks />);
    const after = screen.getAllByTestId('task-item');
    expect(after).toHaveLength(4);
    // Rows are keyed by id, so the old row elements are reused, not redrawn.
    expect(after.slice(1)).toEqual(before);
  });

  it('shows duplicate titles as separate rows', () => {
    const tasks = [makeTask({ id: '1', title: 'Same' }), makeTask({ id: '2', title: 'Same' })];
    render(<TaskList tasks={tasks} hasTasks />);
    expect(screen.getAllByText('Same')).toHaveLength(2);
  });

  it('passes onToggle to every row, each with its own id', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<TaskList tasks={makeTasks(3)} hasTasks onToggle={onToggle} />);
    const boxes = screen.getAllByTestId('task-checkbox');
    expect(boxes).toHaveLength(3);
    await user.click(boxes[2]);
    await user.click(boxes[0]);
    expect(onToggle.mock.calls).toEqual([['id-3'], ['id-1']]);
  });

  it('passes onAskDelete to every row, each with its own id', async () => {
    const onAskDelete = vi.fn();
    const user = userEvent.setup();
    render(<TaskList tasks={makeTasks(3)} hasTasks onAskDelete={onAskDelete} />);
    const buttons = screen.getAllByTestId('delete-button');
    expect(buttons).toHaveLength(3);
    await user.click(buttons[1]);
    await user.click(buttons[2]);
    expect(onAskDelete.mock.calls).toEqual([['id-2'], ['id-3']]);
  });

  it('passes the edit inputs to every row', async () => {
    const onStartEdit = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <TaskList tasks={makeTasks(3)} hasTasks editingId={null} onStartEdit={onStartEdit} />,
    );
    const buttons = screen.getAllByTestId('edit-button');
    expect(buttons).toHaveLength(3);
    await user.click(buttons[1]);
    expect(onStartEdit).toHaveBeenCalledWith('id-2');
    rerender(<TaskList tasks={makeTasks(3)} hasTasks editingId="id-3" onEdit={() => {}} />);
    expect(screen.getAllByTestId('task-edit-form')).toHaveLength(1);
    expect(screen.getAllByTestId('edit-button')).toHaveLength(2);
  });

  it('shows complete and incomplete rows side by side in the order given', () => {
    const tasks = [
      makeTask({ id: 'a', title: 'A', completed: false }),
      makeTask({ id: 'b', title: 'B', completed: true }),
    ];
    render(<TaskList tasks={tasks} hasTasks onToggle={() => {}} />);
    const rows = screen.getAllByTestId('task-item');
    expect(rows[0]).not.toHaveClass('task-item--completed');
    expect(rows[1]).toHaveClass('task-item--completed');
  });

  it('keeps the row element when a task is toggled (same key, same position)', () => {
    const tasks = makeTasks(3);
    const { rerender } = render(<TaskList tasks={tasks} hasTasks onToggle={() => {}} />);
    const before = screen.getAllByTestId('task-item');
    const toggled = tasks.map((t) => (t.id === 'id-2' ? { ...t, completed: true } : t));
    rerender(<TaskList tasks={toggled} hasTasks onToggle={() => {}} />);
    expect(screen.getAllByTestId('task-item')).toEqual(before);
    expect(screen.getAllByTestId('task-checkbox')[1]).toBeChecked();
  });
});

describe('TaskList: filter message', () => {
  it('shows the filter message, not the hint, when tasks exist but none is shown (BR5.3)', () => {
    render(<TaskList tasks={[]} hasTasks />);
    expect(screen.getByTestId('filter-empty')).toHaveTextContent(/^No tasks match this filter\.$/);
    expect(screen.queryByTestId('empty-hint')).not.toBeInTheDocument();
  });

  it('shows the hint, not the filter message, when there are no tasks at all', () => {
    render(<TaskList tasks={[]} hasTasks={false} />);
    expect(screen.getByTestId('empty-hint')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-empty')).not.toBeInTheDocument();
  });
});
