// Messages for the reasons the title rules return (BR1.2, BR1.3), shared by the add form
// and the edit field so the texts exist once. This maps a reason to text; it does not
// decide the rule.
export const MESSAGES = {
  empty: 'Please enter a task title.',
  'too-long': 'Title must be 200 characters or fewer.',
};
export const FALLBACK_MESSAGE = 'The task could not be added.';

export function messageFor(reason) {
  return MESSAGES[reason] ?? FALLBACK_MESSAGE;
}
