// Stand-in for the dialog element's open and close calls, added only where the simulated
// browser lacks them. Open sets `open`; close clears it and fires `close`. It does not
// move focus and does not trap it, so tests assert the code's own focus calls.

export function installDialogStandIn() {
  const proto = globalThis.HTMLDialogElement?.prototype;
  if (!proto) {
    return;
  }
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal() {
      this.setAttribute('open', '');
    };
  }
  if (typeof proto.close !== 'function') {
    proto.close = function close() {
      if (this.hasAttribute('open')) {
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
      }
    };
  }
}
