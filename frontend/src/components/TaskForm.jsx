import { useEffect, useRef, useState } from 'react';
import { MESSAGES, messageFor } from './titleMessages.js';

// The refusal texts live in titleMessages.js and are shared with the edit field.
export { MESSAGES };

const MESSAGE_ID = 'task-form-message';
const INPUT_ID = 'task-title';

export default function TaskForm({ onAdd }) {
  const inputRef = useRef(null);
  const [reason, setReason] = useState(null);

  // Focus in the input when the page opens (M1).
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const input = inputRef.current;
    // Read the text and, on success, clear the input in the same step (BR1.16):
    // a second submit straight after sees an empty input.
    const result = onAdd(input.value);
    if (result.ok) {
      input.value = '';
      setReason(null);
    } else {
      setReason(result.reason);
    }
    // Focus stays in the input after an add and after a refusal (BR1.6).
    input.focus();
  }

  const message = reason === null ? null : messageFor(reason);

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate data-testid="task-form">
      <div className="task-form__row">
        <label className="visually-hidden" htmlFor={INPUT_ID}>
          Task title
        </label>
        <input
          ref={inputRef}
          id={INPUT_ID}
          className="task-form__input"
          type="text"
          autoComplete="off"
          placeholder="What needs to be done?"
          aria-invalid={message ? 'true' : undefined}
          aria-describedby={message ? MESSAGE_ID : undefined}
          onChange={() => setReason(null)}
          data-testid="task-input"
        />
        <button className="task-form__button" type="submit" data-testid="add-button">
          Add
        </button>
      </div>
      {message ? (
        <p
          id={MESSAGE_ID}
          className="task-form__message"
          role="alert"
          data-testid="task-form-message"
        >
          (!) {message}
        </p>
      ) : null}
    </form>
  );
}
