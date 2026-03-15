'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SCAN_DURATION_MS, DISPLAY_WINDOW, CONTEXT_MARGIN } from '@/lib/constants';
import { scanEase } from '@/lib/utils';

/** Internal state of the scan animation. */
interface ScanState {
  /** Whether the rAF animation loop is currently running. */
  isScanning: boolean;
  /** The current 1-indexed digit position being "scanned" visually. */
  currentPosition: number;
  /** A sliding window of ~60 digits to render in the digit stream. */
  displayDigits: string;
  /** True once the animation has reached the match position. */
  scanComplete: boolean;
  /** Current speed phase of the animation easing curve. */
  phase: 'idle' | 'slow-start' | 'fast' | 'slowdown' | 'complete';
}

/** Return value of the {@link useScanAnimation} hook. */
interface UseScanAnimationReturn extends ScanState {
  /** Begins the scan animation targeting the given match position. */
  startScan: (piDigits: string, matchPosition: number) => void;
  /** Resets the animation back to idle state. */
  reset: () => void;
}

const INITIAL_STATE: ScanState = {
  isScanning: false,
  currentPosition: 0,
  displayDigits: '',
  scanComplete: false,
  phase: 'idle',
};

/** Returns a display-ready slice of pi digits centered on the given position. */
function getDisplaySlice(piDigits: string, centerPos: number): string {
  const start = Math.max(0, centerPos - CONTEXT_MARGIN);
  return piDigits.slice(start, start + DISPLAY_WINDOW);
}

/** Maps linear progress (0–1) to a speed phase label. */
function getPhase(progress: number): ScanState['phase'] {
  if (progress >= 0.7) return 'slowdown';
  if (progress >= 0.15) return 'fast';
  return 'slow-start';
}

/**
 * Hook that drives the cosmetic digit-scanning animation.
 *
 * Uses `requestAnimationFrame` with a three-phase easing curve:
 * - **Slow start** (0–15%): Quadratic ease-in for a readable opening.
 * - **Fast middle** (15–70%): Linear ramp at blur speed.
 * - **Dramatic slowdown** (70–100%): Quadratic ease-out as it "hones in" on the match.
 *
 * The animation always runs for {@link SCAN_DURATION_MS} regardless of actual match position.
 * Respects `prefers-reduced-motion` by skipping directly to the result.
 */
export function useScanAnimation(): UseScanAnimationReturn {
  const [state, setState] = useState<ScanState>(INITIAL_STATE);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const piDigitsRef = useRef<string>('');
  const matchPosRef = useRef<number>(0);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setState(INITIAL_STATE);
  }, []);

  const startScan = useCallback((piDigits: string, matchPosition: number) => {
    piDigitsRef.current = piDigits;
    matchPosRef.current = matchPosition - 1; // convert to 0-indexed
    startTimeRef.current = performance.now();

    // Skip animation for reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const pos = matchPosition - 1;
      setState({
        isScanning: false,
        currentPosition: matchPosition,
        displayDigits: getDisplaySlice(piDigits, pos),
        scanComplete: true,
        phase: 'complete',
      });
      return;
    }

    setState({
      isScanning: true,
      currentPosition: 0,
      displayDigits: piDigits.slice(0, DISPLAY_WINDOW),
      scanComplete: false,
      phase: 'slow-start',
    });

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / SCAN_DURATION_MS, 1);
      const matchPos = matchPosRef.current;
      const currentPos = Math.floor(scanEase(progress) * matchPos);

      if (progress >= 1) {
        setState({
          isScanning: false,
          currentPosition: matchPos + 1,
          displayDigits: getDisplaySlice(piDigits, matchPos),
          scanComplete: true,
          phase: 'complete',
        });
        return;
      }

      setState({
        isScanning: true,
        currentPosition: currentPos + 1,
        displayDigits: getDisplaySlice(piDigits, currentPos),
        scanComplete: false,
        phase: getPhase(progress),
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { ...state, startScan, reset };
}
