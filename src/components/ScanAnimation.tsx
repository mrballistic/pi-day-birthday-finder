'use client';

import { Box, LinearProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import DigitStream from './DigitStream';
import PiTriviaTicker from './PiTriviaTicker';

/** Props for the {@link ScanAnimation} component. */
interface ScanAnimationProps {
  /** Sliding window of digits from the scan animation hook. */
  displayDigits: string;
  /** Current 1-indexed position in the scan animation. */
  currentPosition: number;
  /** Whether the rAF scan loop is actively running. */
  isScanning: boolean;
  /** True once the animation has reached the match position. */
  scanComplete: boolean;
  /** 1-indexed position of the match start in pi digits. */
  matchPosition?: number;
  /** Length of the matched date string. */
  matchLength?: number;
}

/**
 * Phase 2 screen: composes DigitStream, progress counter, and PiTriviaTicker.
 * Includes a visually-hidden `aria-live="assertive"` region for screen reader
 * announcements of scan progress and match detection.
 */
export default function ScanAnimation({
  displayDigits,
  currentPosition,
  isScanning,
  scanComplete,
  matchPosition,
  matchLength,
}: ScanAnimationProps) {
  const progress = (currentPosition / 1_000_000) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          px: 2,
        }}
      >
        {/* Screen reader announcement */}
        <Box
          aria-live="assertive"
          sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
        >
          {isScanning && 'Scanning digits of pi...'}
          {scanComplete && matchPosition && `Match found at position ${matchPosition}`}
        </Box>

        {/* Digit Stream */}
        <Box sx={{ width: '100%', maxWidth: 900, mb: 4, mt: { xs: 8, md: 0 } }}>
          <DigitStream
            digits={displayDigits}
            currentPosition={currentPosition}
            matchPosition={matchPosition}
            matchLength={matchLength}
            frozen={scanComplete}
            phase={scanComplete ? 'complete' : 'scanning'}
          />
        </Box>

        {/* Progress */}
        <Box sx={{ position: 'fixed', bottom: { xs: 108, md: 116 }, left: 24, right: 24, zIndex: 10 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: { xs: 12, md: 14 },
              mb: 1,
            }}
          >
            Scanning digit {currentPosition.toLocaleString()} of 1,000,000
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))',
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Trivia Ticker */}
        <PiTriviaTicker active={isScanning} />
      </Box>
    </motion.div>
  );
}
