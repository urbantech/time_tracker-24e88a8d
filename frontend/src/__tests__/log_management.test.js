import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      query: {},
    };
  },
}));

jest.mock('../hooks/useAuth', () => () => ({
  user: { email: 'test@example.com' },
  isAuthenticated: true,
}));

const mockLogs = [
  { id: 1, task: 'Task 1', duration: 120 },
  { id: 2, task: 'Task 2', duration: 300 },
];

describe('LogManagement Component', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('renders correctly', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockLogs),
    });

    render(<LogManagement />);

    await waitFor(() => {
      expect(screen.getByTestId('log_management-container')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('handles user interactions to delete a log entry', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockLogs),
    }).mockResolvedValueOnce({
      ok: true,
    });

    render(<LogManagement />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    });
  });

  test('shows loading state while fetching logs', () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    render(<LogManagement />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('handles API errors when fetching logs', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'));

    render(<LogManagement />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load logs/i)).toBeInTheDocument();
    });
  });

  test('is accessible', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockLogs),
    });

    render(<LogManagement />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'Log Entries');
      expect(screen.getAllByRole('row')).toHaveLength(mockLogs.length + 1); // +1 for header row
    });

    expect(screen.getByText('Task 1')).toHaveAccessibleName('Task 1');
    expect(screen.getByText('Task 2')).toHaveAccessibleName('Task 2');
  });
});