import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeTask } from '../test/tasks.js';
import DeleteDialog from './DeleteDialog.jsx';

function renderDialog(task, handlers = {}) {
  const onConfirm = handlers.onConfirm ?? vi.fn();
  const onCancel = handlers.onCancel ?? vi.fn();
  const view = render(<DeleteDialog task={task} onConfirm={onConfirm} onCancel={onCancel} />);
  return { ...view, onConfirm, onCancel };
}

describe('DeleteDialog', () => {
  it('is closed when there is no task', () => {
    renderDialog(null);
    expect(screen.getByTestId('delete-dialog')).not.toHaveAttribute('open');
    expect(screen.queryByText('Delete this task?')).not.toBeInTheDocument();
  });

  it('opens with the heading, the quoted title and both buttons for a task', () => {
    renderDialog(makeTask({ title: 'Buy milk' }));
    expect(screen.getByTestId('delete-dialog')).toHaveAttribute('open');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Delete this task?' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('delete-dialog-title')).toHaveTextContent('“Buy milk”');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('puts the focus on Cancel when it opens (BR3.1)', () => {
    renderDialog(makeTask());
    expect(screen.getByTestId('delete-dialog-cancel')).toHaveFocus();
  });

  it('calls onCancel when Cancel is clicked and does not confirm', async () => {
    const { onCancel, onConfirm } = renderDialog(makeTask());
    await userEvent.setup().click(screen.getByTestId('delete-dialog-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('turns the cancel event (Esc) into onCancel, prevents the native close and stays open (BR3.3)', () => {
    const { onCancel } = renderDialog(makeTask());
    const dialog = screen.getByTestId('delete-dialog');
    const event = createEvent('cancel', dialog, { cancelable: true });
    fireEvent(dialog, event);
    expect(event.defaultPrevented).toBe(true);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute('open');
  });

  it('calls onConfirm with the task id when Delete is clicked', async () => {
    const { onConfirm, onCancel } = renderDialog(makeTask({ id: 'abc' }));
    await userEvent.setup().click(screen.getByTestId('delete-dialog-confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith('abc');
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('does nothing when the dialog area itself (the dimmed backdrop) is clicked (BR3.4)', async () => {
    const { onConfirm, onCancel } = renderDialog(makeTask());
    await userEvent.setup().click(screen.getByTestId('delete-dialog'));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
    expect(screen.getByTestId('delete-dialog')).toHaveAttribute('open');
  });

  it('shows a title with markup as plain text (BR3.10)', () => {
    const { container } = renderDialog(makeTask({ title: '<b>x</b>' }));
    expect(screen.getByTestId('delete-dialog-title')).toHaveTextContent('“<b>x</b>”');
    expect(container.querySelector('b')).toBeNull();
  });

  it('shows a very long title in full', () => {
    const title = 'w'.repeat(200);
    renderDialog(makeTask({ title }));
    expect(screen.getByTestId('delete-dialog-title')).toHaveTextContent(title);
  });

  it('closes when the task goes back to null', () => {
    const task = makeTask();
    const { rerender, onConfirm, onCancel } = renderDialog(task);
    expect(screen.getByTestId('delete-dialog')).toHaveAttribute('open');
    rerender(<DeleteDialog task={null} onConfirm={onConfirm} onCancel={onCancel} />);
    expect(screen.getByTestId('delete-dialog')).not.toHaveAttribute('open');
  });
});
