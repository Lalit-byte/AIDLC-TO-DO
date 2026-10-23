// Accessibility check helper (NFR3.4): runs axe on a rendered container.
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);

export async function expectNoAxeViolations(container) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}
