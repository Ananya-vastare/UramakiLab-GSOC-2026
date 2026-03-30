import { renderHook, act } from '@testing-library/react';
import { useOutput } from './useOutput';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Using globalThis instead of global to satisfy TypeScript
globalThis.fetch = vi.fn();

describe('useOutput hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useOutput());
    expect(result.current.output).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update output on successful API call', async () => {
    const mockResponse = { content: 'Test prompt content', id: '123' };
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useOutput());

    await act(async () => {
      await result.current.generatePrompt('My design challenge');
    });

    expect(result.current.output?.content).toBe('Test prompt content');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set error state when API fails', async () => {
    (globalThis.fetch as any).mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useOutput());

    await act(async () => {
      await result.current.generatePrompt('Broken call');
    });

    expect(result.current.error).toBe('Failed to generate prompt. Please try again.');
    expect(result.current.isLoading).toBe(false);
  });
});