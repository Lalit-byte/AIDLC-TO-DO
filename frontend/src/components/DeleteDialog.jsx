import { useEffect, useRef } from 'react';

const HEADING_ID = 'delete-dialog-heading';
const TITLE_ID = 'delete-dialog-title';

// The "Delete this task?" confirmation, built on the browser's own modal dialog (BR3.11).
// `task` is the task being confirmed, or null when the dialog is closed; `task` becoming
// null is the only way the dialog closes (BR3.3, BR3.5). The title is a plain text child,
// never markup (NFR4.1).
export default function DeleteDialog({ task, onConfirm, onCancel }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const taskId = task === null ? null : task.id;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }
    if (taskId !== null) {
      if (!dialog.open) {
        dialog.showModal();
      }
      // An explicit focus call: Cancel is the first thing focused (BR3.1).
      cancelRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [taskId]);

  // Esc: stop the browser closing the dialog itself and ask the page to close it (BR3.3).
  function handleCancelEvent(event) {
    event.preventDefault();
    onCancel();
  }

  // A click on the dimmed area has no handler on purpose: it does nothing (BR3.4).
  return (
    <dialog
      ref={dialogRef}
      className="delete-dialog"
      aria-labelledby={HEADING_ID}
      aria-describedby={TITLE_ID}
      onCancel={handleCancelEvent}
      data-testid="delete-dialog"
    >
      {task === null ? null : (
        <>
          <h2 id={HEADING_ID} className="delete-dialog__heading">
            Delete this task?
          </h2>
          <p id={TITLE_ID} className="delete-dialog__title" data-testid="delete-dialog-title">
            {`“${task.title}”`}
          </p>
          <div className="delete-dialog__actions">
            <button
              ref={cancelRef}
              type="button"
              className="delete-dialog__cancel"
              data-testid="delete-dialog-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="delete-dialog__confirm"
              data-testid="delete-dialog-confirm"
              onClick={() => onConfirm(task.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
