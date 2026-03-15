'use client';

import { useEffect } from 'react';
import { CONFETTI_COLORS_CENTER, CONFETTI_COLORS_SIDE } from '@/lib/constants';

/**
 * Fires a multi-burst confetti explosion on mount using dynamically imported `canvas-confetti`.
 * Renders a center burst followed by two angled side bursts after 300ms.
 * Renders no DOM elements — effects are drawn directly to a canvas overlay by the library.
 */
export default function ConfettiExplosion() {
  useEffect(() => {
    let cancelled = false;

    const fire = async () => {
      const confettiModule = await import('canvas-confetti');
      const confetti = confettiModule.default;
      if (cancelled) return;

      // Big burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: CONFETTI_COLORS_CENTER,
      });

      // Side bursts
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: CONFETTI_COLORS_SIDE,
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: CONFETTI_COLORS_SIDE,
        });
      }, 300);
    };

    fire();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
