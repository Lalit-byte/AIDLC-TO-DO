import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TaskEditField from './TaskEditField.jsx';

function renderField(onSave = vi.fn(() => ({ ok: true })), onCancel = vi.fn()) {
  render(<TaskEditField taskId="id-1" title="Buy milk" onSave={onSave} onCancel={onCancel} />);
  return { onSave, onCancel };
}

describe('TaskEditField', () => {
  it('opens with the saved title selected and focused, named and with the hint linked', () => {
    renderField();
    const input = screen.getByTestId('task-edit-input');
    expect(input).toHaveValue('Buy milk');
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('Buy milk'.length);
    expect(screen.getByRole('textbox', { name: 'Edit title of Buy milk' })).toBe(input);
    expect(input).toHaveAccessibleDescription('Enter to save, Esc to cancel');
  });

  it('calls onSave with the typed text unchanged on Enter and on Save', async () => {
    const user = userEvent.setup();
    const { onSave } = renderField();
    await user.keyboard('  New words {Enter}');
    expect(onSave).toHaveBeenLastCalledWith('  New words ');
    await user.click(screen.getByTestId('task-edit-save'));
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it('calls onCancel when Cancel is pressed', async () => {
    const user = userEvent.setup();
    const { onCancel, onSave } = renderField();
    await user.click(screen.getByTestId('task-edit-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows a refusal as an alert, marks the field invalid, keeps the text and focus, and clears on typing', async () => {
    const user = userEvent.setup();
    renderField(vi.fn(() => ({ ok: false, reason: 'empty' })));
    await user.clear(screen.getByTestId('task-edit-input'));
    await user.keyboard('{Enter}');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('(!) Please enter a task title.');
    const input = screen.getByTestId('task-edit-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(alert.id));
    expect(input).toHaveFocus();
    await user.keyboard('x');
    expect(screen.queryByTestId('task-edit-message')).not.toBeInTheDocument();
    expect(input).toHaveValue('x');
  });
});
