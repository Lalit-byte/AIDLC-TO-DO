import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Counter from './Counter.jsx';

describe('Counter', () => {
  it.each([
    [2, '2 items left'],
    [1, '1 item left'],
    [0, '0 items left'],
    [100, '100 items left'],
  ])('shows %i as "%s"', (remaining, text) => {
    render(<Counter remaining={remaining} />);
    expect(screen.getByTestId('counter')).toHaveTextContent(new RegExp(`^${text}$`));
  });

  it('is one text element with the status role, no child elements and no alert role', () => {
    render(<Counter remaining={3} />);
    const line = screen.getByRole('status');
    expect(line).toBe(screen.getByTestId('counter'));
    expect(line.children).toHaveLength(0);
    expect(line).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
