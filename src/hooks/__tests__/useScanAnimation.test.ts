import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScanAnimation } from '../useScanAnimation';
import { SCAN_DURATION_MS } from '@/lib/constants';

// Generate a longer digit string for testing
const PI_DIGITS = '14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196';

// Manual rAF simulation
let rafCallbacks: Map<number, FrameRequestCallback>;
let rafId: number;

beforeEach(() => {
  vi.restoreAllMocks();
  rafCallbacks = new Map();
  rafId = 0;

  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    const id = ++rafId;
    rafCallbacks.set(id, cb);
    return id;
  });

  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    rafCallbacks.delete(id);
  });

  vi.spyOn(performance, 'now').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function flushRAF(timestamp: number) {
  vi.spyOn(performance, 'now').mockReturnValue(timestamp);
  const cbs = [...rafCallbacks.values()];
  rafCallbacks.clear();
  cbs.forEach((cb) => cb(timestamp));
}

describe('useScanAnimation', () => {
  describe('initial state', () => {
    it('starts idle', () => {
      const { result } = renderHook(() => useScanAnimation());
      expect(result.current.isScanning).toBe(false);
      expect(result.current.currentPosition).toBe(0);
      expect(result.current.displayDigits).toBe('');
      expect(result.current.scanComplete).toBe(false);
      expect(result.current.phase).toBe('idle');
    });
  });

  describe('startScan', () => {
    it('sets isScanning=true and phase to slow-start', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 50);
      });

      expect(result.current.isScanning).toBe(true);
      expect(result.current.phase).toBe('slow-start');
    });

    it('sets initial displayDigits', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 50);
      });

      expect(result.current.displayDigits.length).toBeGreaterThan(0);
    });

    it('registers a requestAnimationFrame callback', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 50);
      });

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('animation progress', () => {
    it('transitions to fast phase mid-animation', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 100);
      });

      // Advance to ~30% (in "fast" phase: 0.15–0.7)
      act(() => {
        flushRAF(SCAN_DURATION_MS * 0.3);
      });

      expect(result.current.isScanning).toBe(true);
      expect(result.current.phase).toBe('fast');
      expect(result.current.currentPosition).toBeGreaterThan(0);
    });

    it('transitions to slowdown phase near end', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 100);
      });

      // Advance to 80% (in "slowdown" phase: 0.7–1.0)
      act(() => {
        flushRAF(SCAN_DURATION_MS * 0.8);
      });

      expect(result.current.isScanning).toBe(true);
      expect(result.current.phase).toBe('slowdown');
    });

    it('completes after SCAN_DURATION_MS', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 50);
      });

      // Advance past the full duration
      act(() => {
        flushRAF(SCAN_DURATION_MS + 100);
      });

      expect(result.current.isScanning).toBe(false);
      expect(result.current.scanComplete).toBe(true);
      expect(result.current.phase).toBe('complete');
      expect(result.current.currentPosition).toBe(50);
    });

    it('updates displayDigits during animation', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 100);
      });

      const initialDigits = result.current.displayDigits;

      act(() => {
        flushRAF(SCAN_DURATION_MS * 0.5);
      });

      expect(result.current.displayDigits).not.toBe(initialDigits);
    });
  });

  describe('reduced motion', () => {
    it('skips animation when prefers-reduced-motion is active', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
      } as MediaQueryList);

      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 30);
      });

      expect(result.current.isScanning).toBe(false);
      expect(result.current.scanComplete).toBe(true);
      expect(result.current.phase).toBe('complete');
      expect(result.current.currentPosition).toBe(30);
      expect(result.current.displayDigits.length).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('returns to idle state', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 50);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.isScanning).toBe(false);
      expect(result.current.phase).toBe('idle');
      expect(result.current.currentPosition).toBe(0);
      expect(result.current.scanComplete).toBe(false);
    });

    it('cancels active animation', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 50);
      });

      // Advance one frame so rafRef gets a real ID
      act(() => {
        flushRAF(100);
      });

      act(() => {
        result.current.reset();
      });

      // After reset, flushing more frames should not change state
      act(() => {
        flushRAF(SCAN_DURATION_MS + 100);
      });

      expect(result.current.phase).toBe('idle');
    });

    it('is safe to call when already idle', () => {
      const { result } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.reset();
      });

      expect(result.current.phase).toBe('idle');
    });
  });

  describe('cleanup', () => {
    it('cleans up on unmount without errors', () => {
      const { result, unmount } = renderHook(() => useScanAnimation());

      act(() => {
        result.current.startScan(PI_DIGITS, 50);
      });

      // Should not throw
      expect(() => unmount()).not.toThrow();
    });
  });
});
