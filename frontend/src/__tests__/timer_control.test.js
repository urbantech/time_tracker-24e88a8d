import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

describe('TimerControl Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    render(<TimerControl />);
    expect(screen.getByTestId('timer_control-container')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
  });

  it('handles start button click', async () => {
    const mockFetch = require('node-fetch');
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ message: 'Timer started' }) });

    render(<TimerControl />);
    const startButton = screen.getByRole('button', { name: /start/i });
    await userEvent.click(startButton);

    expect(mockFetch).toHaveBeenCalledWith('https://api.ainative.studio/some-timer-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key'
      },
      body: JSON.stringify({ action: 'start' })
    });
  });

  it('handles stop button click', async () => {
    const mockFetch = require('node-fetch');
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ message: 'Timer stopped' }) });

    render(<TimerControl />);
    const stopButton = screen.getByRole('button', { name: /stop/i });
    await userEvent.click(stopButton);

    expect(mockFetch).toHaveBeenCalledWith('https://api.ainative.studio/some-timer-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key'
      },
      body: JSON.stringify({ action: 'stop' })
    });
  });

  it('shows loading state when starting a timer', async () => {
    const mockFetch = require('node-fetch');
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));

    render(<TimerControl />);
    const startButton = screen.getByRole('button', { name: /start/i });
    await userEvent.click(startButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    const mockFetch = require('node-fetch');
    mockFetch.mockResolvedValue({ ok: false, statusText: 'Failed to start timer' });

    render(<TimerControl />);
    const startButton = screen.getByRole('button', { name: /start/i });
    await userEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to start timer/i)).toBeInTheDocument();
    });
  });

  it('is accessible', () => {
    const { container } = render(<TimerControl />);
    expect(container).toHaveAccessibleName('Timer Control');
    expect(screen.getByRole('button', { name: /start/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /stop/i })).toBeDisabled();
  });
});