import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FilterBar from './FilterBar.jsx';

describe('FilterBar', () => {
  it('shows All, Active and Completed in order inside a group labeled "Filter tasks"', () => {
    render(<FilterBar filter="all" onChange={() => {}} />);
    const group = screen.getByRole('group', { name: 'Filter tasks' });
    const buttons = Array.from(group.querySelectorAll('button'));
    expect(buttons.map((button) => button.textContent)).toEqual(['All', 'Active', 'Completed']);
  });

  it('marks only the chosen button as pressed', () => {
    render(<FilterBar filter="active" onChange={() => {}} />);
    expect(screen.getByTestId('filter-active')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('filter-completed')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the value on a click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterBar filter="all" onChange={onChange} />);
    await user.click(screen.getByTestId('filter-completed'));
    screen.getByTestId('filter-active').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onChange.mock.calls.map((call) => call[0])).toEqual(['completed', 'active', 'active']);
  });
});
