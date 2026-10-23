// "N items left" line (BR7.2, BR7.6). Input: `remaining`, a number.
// One plain text element with no child elements and a polite live setting. It is rendered
// on every render of the page, so a later change of its text is announced.
export default function Counter({ remaining }) {
  const text = remaining === 1 ? '1 item left' : `${remaining} items left`;
  return (
    <p className="counter" role="status" aria-live="polite" data-testid="counter">
      {text}
    </p>
  );
}
