import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const MOCK_DIGITS = '00000001141500000000264338327950288419716939937510';

// Mock piLoader at module level
vi.mock('@/lib/piLoader', () => ({
  loadPiDigits: vi.fn(),
}));

import { usePiSearch } from '../usePiSearch';
import { loadPiDigits } from '@/lib/piLoader';

const mockLoadPiDigits = vi.mocked(loadPiDigits);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('usePiSearch', () => {
  describe('initial load', () => {
    it('starts with loading=true and piDigits=null', () => {
      mockLoadPiDigits.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => usePiSearch());
      expect(result.current.loading).toBe(true);
      expect(result.current.piDigits).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('loads pi digits on mount', async () => {
      mockLoadPiDigits.mockResolvedValue(MOCK_DIGITS);

      const { result } = renderHook(() => usePiSearch());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.piDigits).toBe(MOCK_DIGITS);
      expect(result.current.error).toBeNull();
    });

    it('sets error on fetch failure', async () => {
      mockLoadPiDigits.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePiSearch());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.error).toBeTruthy();
      expect(result.current.piDigits).toBeNull();
    });
  });

  describe('search', () => {
    it('returns a result when digits are loaded', async () => {
      mockLoadPiDigits.mockResolvedValue(MOCK_DIGITS);

      const { result } = renderHook(() => usePiSearch());
      await waitFor(() => {
        expect(result.current.piDigits).not.toBeNull();
      });

      act(() => {
        result.current.search(new Date(1990, 0, 14)); // Jan 14 → "0114" or partial "114"
      });

      expect(result.current.result).not.toBeNull();
    });

    it('does nothing when digits not loaded', () => {
      mockLoadPiDigits.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => usePiSearch());

      act(() => {
        result.current.search(new Date(1990, 6, 4));
      });

      expect(result.current.result).toBeNull();
    });
  });

  describe('reset', () => {
    it('clears the result', async () => {
      mockLoadPiDigits.mockResolvedValue(MOCK_DIGITS);

      const { result } = renderHook(() => usePiSearch());
      await waitFor(() => {
        expect(result.current.piDigits).not.toBeNull();
      });

      act(() => result.current.search(new Date(1990, 0, 14)));
      expect(result.current.result).not.toBeNull();

      act(() => result.current.reset());
      expect(result.current.result).toBeNull();
    });
  });
});
