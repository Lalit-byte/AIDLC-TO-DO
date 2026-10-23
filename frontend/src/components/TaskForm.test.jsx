import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.js';
import TaskForm from './TaskForm.jsx';
import { MESSAGES, messageFor } from './titleMessages.js';

describe('TaskForm', () => {
  it('has focus in the labeled input when it opens', () => {
    render(<TaskForm onAdd={vi.fn()} />);
    const input = screen.getByLabelText('Task title');
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('placeholder', 'What needs to be done?');
  });

  it('adds with Enter, passes the text unchanged, clears the input and keeps focus', async () => {
    const onAdd = vi.fn(() => ({ ok: true }));
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);
    await user.type(screen.getByTestId('task-input'), '  Buy milk {Enter}');
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('  Buy milk ');
    expect(screen.getByTestId('task-input')).toHaveValue('');
    expect(screen.getByTestId('task-input')).toHaveFocus();
    expect(screen.queryByTestId('task-form-message')).not.toBeInTheDocument();
  });

  it('adds with the Add button', async () => {
    const onAdd = vi.fn(() => ({ ok: true }));
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);
    await user.type(screen.getByTestId('task-input'), 'Walk dog');
    await user.click(screen.getByTestId('add-button'));
    expect(onAdd).toHaveBeenCalledWith('Walk dog');
    expect(screen.getByTestId('task-input')).toHaveValue('');
    expect(screen.getByTestId('task-input')).toHaveFocus();
  });

  it('shows the empty-title message, keeps the text and the focus', async () => {
    const onAdd = vi.fn(() => ({ ok: false, reason: 'empty' }));
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);
    await user.type(screen.getByTestId('task-input'), '   {Enter}');
    const message = screen.getByTestId('task-form-message');
    expect(message).toHaveTextContent('(!) Please enter a task title.');
    expect(message).toHaveAttribute('role', 'alert');
    expect(screen.getByTestId('task-input')).toHaveValue('   ');
    expect(screen.getByTestId('task-input')).toHaveFocus();
  });

  it('shows the too-long message and links it to the input', async () => {
    const onAdd = vi.fn(() => ({ ok: false, reason: 'too-long' }));
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);
    await user.type(screen.getByTestId('task-input'), 'x{Enter}');
    const input = screen.getByTestId('task-input');
    const message = screen.getByRole('alert');
    expect(message).toHaveTextContent('Title must be 200 characters or fewer.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', message.id);
    expect(input).toHaveAccessibleDescription(/Title must be 200 characters or fewer\./);
  });

  it('clears the message when the person types again', async () => {
    const onAdd = vi.fn(() => ({ ok: false, reason: 'empty' }));
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);
    await user.type(screen.getByTestId('task-input'), '{Enter}');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.type(screen.getByTestId('task-input'), 'a');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('task-input')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByTestId('task-input')).not.toHaveAttribute('aria-describedby');
  });

  it('clears an earlier message after a later successful add', async () => {
    const onAdd = vi
      .fn()
      .mockReturnValueOnce({ ok: false, reason: 'empty' })
      .mockReturnValue({ ok: true });
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);
    await user.type(screen.getByTestId('task-input'), '{Enter}');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.type(screen.getByTestId('task-input'), 'ok{Enter}');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows a general message for a reason it does not know', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAdd={() => ({ ok: false, reason: 'something-new' })} />);
    await user.type(screen.getByTestId('task-input'), 'x{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('The task could not be added.');
  });

  it('takes both refusal messages from the shared file', () => {
    expect(MESSAGES).toEqual({
      empty: 'Please enter a task title.',
      'too-long': 'Title must be 200 characters or fewer.',
    });
    expect(messageFor('empty')).toBe('Please enter a task title.');
    expect(messageFor('too-long')).toBe('Title must be 200 characters or fewer.');
    expect(messageFor('other')).toBe('The task could not be added.');
  });

  it('passes the accessibility check, also in the refused state', async () => {
    const user = userEvent.setup();
    const { container } = render(<TaskForm onAdd={() => ({ ok: false, reason: 'empty' })} />);
    await expectNoAxeViolations(container);
    await user.type(screen.getByTestId('task-input'), '{Enter}');
    await expectNoAxeViolations(container);
  });
});
