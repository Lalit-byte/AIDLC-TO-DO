import { useEffect, useRef, useState } from 'react';
import { messageFor } from './titleMessages.js';

// The editing field of one row. It is mounted only while that row is being edited, so the
// typed text and any message are fresh each time editing starts and gone when it ends
// (BR4.1, BR4.7). The text is an input value, never markup (NFR4.1).
// `onSave(text)` returns `{ ok: true }` or `{ ok: false, reason }`; a refusal shows the
// message and keeps the text and the focus (BR4.4). `onCancel()` ends the edit.
export default function TaskEditField({ taskId, title, onSave, onCancel }) {
  const inputRef = useRef(null);
  const [reason, setReason] = useState(null);
  const inputId = `task-edit-input-${taskId}`;
  const hintId = `task-edit-hint-${taskId}`;
  const messageId = `task-edit-message-${taskId}`;

  // Focus in the field with all text selected when editing starts (AC4.1.1).
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const input = inputRef.current;
    const result = onSave(input.value);
    if (!result.ok) {
      setReason(result.reason);
      input.focus();
    }
  }

  const message = reason === null ? null : messageFor(reason);

  return (
    <form className="task-edit" onSubmit={handleSubmit} noValidate data-testid="task-edit-form">
      <div className="task-edit__row">
        <input
          ref={inputRef}
          id={inputId}
          className="task-edit__input"
          type="text"
          autoComplete="off"
          defaultValue={title}
          aria-label={`Edit title of ${title}`}
          aria-invalid={message ? 'true' : undefined}
          aria-describedby={message ? `${hintId} ${messageId}` : hintId}
          onChange={() => setReason(null)}
          data-testid="task-edit-input"
        />
        <button type="submit" className="task-edit__save" data-testid="task-edit-save">
          Save
        </button>
        <button
          type="button"
          className="task-edit__cancel"
          data-testid="task-edit-cancel"
          onClick={() => onCancel()}
        >
          Cancel
        </button>
      </div>
      <p id={hintId} className="task-edit__hint">
        Enter to save, Esc to cancel
      </p>
      {message ? (
        <p
          id={messageId}
          className="task-edit__message"
          role="alert"
          data-testid="task-edit-message"
        >
          (!) {message}
        </p>
      ) : null}
    </form>
  );
}
