// Message block above the add row (BR6.13). Shows the one current notice, or nothing.
// Input: `notice` is null or { kind, text }. The "(!)" mark means the message is not colour-only.
export default function MessageBar({ notice }) {
  if (!notice) {
    return null;
  }
  return (
    <p className={`notice notice--${notice.kind}`} role="alert" data-testid="notice">
      <span className="notice__mark" aria-hidden="true">
        (!)
      </span>{' '}
      {notice.text}
    </p>
  );
}
