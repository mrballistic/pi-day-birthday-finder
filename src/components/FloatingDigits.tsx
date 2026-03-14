'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

/** A single floating digit particle rendered on the canvas. */
interface Particle {
  x: number;
  y: number;
  digit: string;
  speed: number;
  opacity: number;
  size: number;
}

/**
 * Ambient background effect that renders semi-transparent digits (0–9)
 * floating upward on a full-screen canvas. Uses raw canvas API for performance.
 * Reduces particle count when `prefers-reduced-motion` is active.
 */
export default function FloatingDigits() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize particles
    const count = prefersReduced ? 10 : 40;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      digit: Math.floor(Math.random() * 10).toString(),
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.03 + Math.random() * 0.08,
      size: 14 + Math.random() * 24,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        ctx.font = `${p.size}px var(--font-mono), monospace`;
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fillText(p.digit, p.x, p.y);

        if (!prefersReduced) {
          p.y -= p.speed;
          if (p.y < -30) {
            p.y = canvas.height + 30;
            p.x = Math.random() * canvas.width;
            p.digit = Math.floor(Math.random() * 10).toString();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}
