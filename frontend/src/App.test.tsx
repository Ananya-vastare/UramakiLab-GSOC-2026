import { render, screen } from '@testing-library/react'; // Removed unused fireEvent/waitFor
import App from './App';
import * as hooks from './hooks/useOutput';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('./hooks/useOutput');

describe('App Component', () => {
  it('shows loading state on button click', () => {
    // Force the hook to return isLoading: true
    (hooks.useOutput as any).mockReturnValue({
      output: null,
      isLoading: true,
      error: null,
      generatePrompt: vi.fn(),
    });

    render(<App />);
    const button = screen.getByRole('button', { name: /generating/i });
    
    // Now recognized because of the @testing-library/jest-dom import
    expect(button).toBeDisabled();
  });

  it('displays the output and copy button when generated', () => {
    const mockOutput = {
      id: '123456',
      methodology: 'Usability Evaluation',
      content: 'Analyze the navigation menu.',
      timestamp: '12:00:00 PM'
    };

    (hooks.useOutput as any).mockReturnValue({
      output: mockOutput,
      isLoading: false,
      error: null,
      generatePrompt: vi.fn(),
    });

    render(<App />);
    
    // Checks for output text
    expect(screen.getByText('Analyze the navigation menu.')).toBeInTheDocument();
    
    // Checks for copy button
    expect(screen.getByText(/Click to copy prompt/i)).toBeInTheDocument();
  });
});