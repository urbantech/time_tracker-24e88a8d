import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetModules();
});

describe('Authentication Component', () => {
  test('renders correctly', () => {
    render(<Authentication />);
    expect(screen.getByTestId('authentication-container')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles user interactions', async () => {
    const mockFetch = require('node-fetch');
    mockFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue({ token: 'abc123' }) });

    render(<Authentication />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('https://api.ainative.studio/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
    });
  });

  test('shows loading state during login', async () => {
    const mockFetch = require('node-fetch');
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));

    render(<Authentication />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('handles API errors', async () => {
    const mockFetch = require('node-fetch');
    mockFetch.mockRejectedValue(new Error('API error'));

    render(<Authentication />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to log in/i)).toBeInTheDocument();
    });
  });

  test('is accessible', () => {
    const { container } = render(<Authentication />);
    expect(container).toHaveAccessibleName('Authentication Form');
    expect(screen.getByLabelText(/email/i)).toHaveAccessibleDescription('Enter your email address');
    expect(screen.getByLabelText(/password/i)).toHaveAccessibleDescription('Enter your password');
    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
  });
});