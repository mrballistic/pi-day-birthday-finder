'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

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
  startScan: (piDigits: string, matchPosition: number, matchLength: number) => void;
  /** Resets the animation back to idle state. */
  reset: () => void;
}

/** Total duration of the scan animation in milliseconds. */
const SCAN_DURATION_MS = 6000;
/** Number of digits shown in the sliding display window. */
const DISPLAY_WINDOW = 60;

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
  const [state, setState] = useState<ScanState>({
    isScanning: false,
    currentPosition: 0,
    displayDigits: '',
    scanComplete: false,
    phase: 'idle',
  });

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const piDigitsRef = useRef<string>('');
  const matchPosRef = useRef<number>(0);
  const matchLenRef = useRef<number>(0);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setState({
      isScanning: false,
      currentPosition: 0,
      displayDigits: '',
      scanComplete: false,
      phase: 'idle',
    });
  }, []);

  const startScan = useCallback((piDigits: string, matchPosition: number, matchLength: number) => {
    piDigitsRef.current = piDigits;
    matchPosRef.current = matchPosition - 1; // convert to 0-indexed
    matchLenRef.current = matchLength;
    startTimeRef.current = performance.now();

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const pos = matchPosition - 1;
      const start = Math.max(0, pos - 20);
      setState({
        isScanning: false,
        currentPosition: matchPosition,
        displayDigits: piDigits.slice(start, start + DISPLAY_WINDOW),
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

      // Easing: slow start, fast middle, slow end
      let easedProgress: number;
      if (progress < 0.15) {
        // Slow start
        easedProgress = progress * progress * (1 / 0.15);
      } else if (progress < 0.7) {
        // Fast middle
        const t = (progress - 0.15) / 0.55;
        easedProgress = 0.15 + t * 0.7;
      } else {
        // Dramatic slowdown near end
        const t = (progress - 0.7) / 0.3;
        easedProgress = 0.85 + t * t * 0.15;
      }

      const currentPos = Math.floor(easedProgress * matchPos);
      const start = Math.max(0, currentPos - 20);

      let phase: ScanState['phase'] = 'slow-start';
      if (progress >= 0.7) phase = 'slowdown';
      else if (progress >= 0.15) phase = 'fast';

      if (progress >= 1) {
        setState({
          isScanning: false,
          currentPosition: matchPos + 1,
          displayDigits: piDigits.slice(Math.max(0, matchPos - 20), Math.max(0, matchPos - 20) + DISPLAY_WINDOW),
          scanComplete: true,
          phase: 'complete',
        });
        return;
      }

      setState({
        isScanning: true,
        currentPosition: currentPos + 1,
        displayDigits: piDigits.slice(start, start + DISPLAY_WINDOW),
        scanComplete: false,
        phase,
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
