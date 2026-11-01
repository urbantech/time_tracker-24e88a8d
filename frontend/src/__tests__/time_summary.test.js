import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('axios');

import TimeSummary from '../components/TimeSummary';

describe('TimeSummary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders correctly with initial data', async () => {
    const mockData = [
      { taskName: 'Task 1', duration: 3600 },
      { taskName: 'Task 2', duration: 7200 }
    ];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData)
    });

    render(<TimeSummary />);

    await waitFor(() => {
      expect(screen.getByTestId('time_summary-container')).toBeInTheDocument();
      expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Time:/i)).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching data', () => {
    render(<TimeSummary />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('API error'));

    render(<TimeSummary />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load time summary/i)).toBeInTheDocument();
    });
  });

  test('displays total time correctly', async () => {
    const mockData = [
      { taskName: 'Task 1', duration: 3600 },
      { taskName: 'Task 2', duration: 7200 }
    ];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData)
    });

    render(<TimeSummary />);

    await waitFor(() => {
      expect(screen.getByText(/Total Time: 2 hours/i)).toBeInTheDocument();
    });
  });

  test('is accessible', async () => {
    const mockData = [
      { taskName: 'Task 1', duration: 3600 },
      { taskName: 'Task 2', duration: 7200 }
    ];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData)
    });

    render(<TimeSummary />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Time Summary/i })).toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBe(2);
    });
  });
});