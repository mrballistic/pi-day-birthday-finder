'use client';

import { useMemo } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

/** Props for the {@link DigitStream} component. */
interface DigitStreamProps {
  /** The sliding window of digits to display. */
  digits: string;
  /** The current 1-indexed scan position (highlighted in green). */
  currentPosition: number;
  /** 1-indexed position of the match start (highlighted in gold when complete). */
  matchPosition?: number;
  /** Number of characters in the matched string. */
  matchLength?: number;
  /** When true, stops the scan cursor animation. */
  frozen?: boolean;
  /** Current display phase — controls highlighting and cursor visibility. */
  phase: 'scanning' | 'complete';
}

/**
 * Renders a multi-row monospaced grid of pi digits with visual effects.
 * During scanning: current position glows green, a cyan cursor sweeps across.
 * On completion: matched digits scale up with a gold glow, others fade out.
 * Adapts row count for mobile (3 rows) vs. desktop (6 rows).
 */
export default function DigitStream({
  digits,
  currentPosition,
  matchPosition,
  matchLength = 0,
  frozen,
  phase,
}: DigitStreamProps) {
  const isMobile = useMediaQuery('(max-width:599px)');
  const rowCount = isMobile ? 3 : 6;
  const charWidth = isMobile ? 12 : 16;
  const fontSize = isMobile ? 14 : 18;

  const rows = useMemo(() => {
    const charsPerRow = Math.ceil(digits.length / rowCount);
    const result: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      result.push(digits.slice(i * charsPerRow, (i + 1) * charsPerRow));
    }
    return result;
  }, [digits, rowCount]);

  const matchStart = matchPosition ? matchPosition - 1 : -1;
  const matchEnd = matchStart + matchLength;
  const charsPerRow = Math.ceil(digits.length / rowCount);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono), monospace',
        py: 2,
      }}
    >
      {rows.map((row, rowIdx) => (
        <Box
          key={rowIdx}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 0.5,
            height: { xs: 28, md: 36 },
            overflow: 'hidden',
          }}
        >
          {row.split('').map((digit, charIdx) => {
            const absoluteIdx = rowIdx * charsPerRow + charIdx;
            const isMatch =
              phase === 'complete' &&
              matchStart >= 0 &&
              absoluteIdx >= matchStart &&
              absoluteIdx < matchEnd;
            const isCurrent = !frozen && absoluteIdx === currentPosition - 1;
            const isFaded = phase === 'complete' && !isMatch;

            return (
              <motion.span
                key={charIdx}
                animate={
                  isMatch
                    ? {
                        scale: [1, 1.5, 1.5],
                        color: ['#ffffff', '#ffd700', '#ffd700'],
                      }
                    : {}
                }
                transition={isMatch ? { duration: 0.8, times: [0, 0.3, 1] } : undefined}
                style={{
                  display: 'inline-block',
                  width: charWidth,
                  textAlign: 'center',
                  fontSize,
                  color: isMatch
                    ? '#ffd700'
                    : isCurrent
                      ? '#39ff14'
                      : isFaded
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.5)',
                  textShadow: isMatch
                    ? '0 0 15px #ffd700'
                    : isCurrent
                      ? '0 0 10px #39ff14'
                      : 'none',
                  transition: 'color 0.15s, opacity 0.3s',
                }}
              >
                {digit}
              </motion.span>
            );
          })}
        </Box>
      ))}

      {/* Scan cursor */}
      {!frozen && phase === 'scanning' && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 2,
            left: `${((currentPosition % 60) / 60) * 100}%`,
            backgroundColor: 'var(--neon-blue)',
            boxShadow: '0 0 20px cyan, 0 0 40px cyan',
            transition: 'left 0.05s linear',
            zIndex: 2,
          }}
        />
      )}
    </Box>
  );
}
