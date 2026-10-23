import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MessageBar from './MessageBar.jsx';

describe('MessageBar', () => {
  it('renders nothing for no notice', () => {
    const { container } = render(<MessageBar notice={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ['load-failed', 'Your tasks could not be loaded.'],
    ['save-failed', 'Your change could not be saved.'],
  ])('shows the %s text with the (!) mark', (kind, text) => {
    render(<MessageBar notice={{ kind, text }} />);
    const notice = screen.getByTestId('notice');
    expect(notice).toHaveTextContent(`(!) ${text}`);
    expect(notice).toHaveClass('notice', `notice--${kind}`);
  });

  it('is an alert', () => {
    render(<MessageBar notice={{ kind: 'load-failed', text: 'x' }} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
