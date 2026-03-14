'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { shuffleTrivia } from '@/lib/piTrivia';

/** Props for the {@link PiTriviaTicker} component. */
interface PiTriviaTickerProps {
  /** When true, the ticker is visible and cycling through facts. */
  active: boolean;
}

/**
 * Fixed bottom bar that cycles through shuffled pi trivia facts every 3 seconds
 * during the Phase 2 scan animation. Uses Framer Motion AnimatePresence for
 * vertical slide + fade cross-transitions. Includes `aria-live="polite"` for
 * screen reader announcements.
 */
export default function PiTriviaTicker({ active }: PiTriviaTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const factsRef = useRef<string[]>(shuffleTrivia());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (active) {
      factsRef.current = shuffleTrivia();
      setCurrentIndex(0);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % factsRef.current.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  if (!active) return null;

  const currentFact = factsRef.current[currentIndex];

  return (
    <Box
      aria-live="polite"
      sx={{
        position: 'fixed',
        bottom: 60,
        left: 0,
        right: 0,
        zIndex: 10,
        height: { xs: 40, md: 48 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        backgroundColor: 'rgba(10, 10, 26, 0.85)',
        borderTop: '1px solid rgba(0, 212, 255, 0.3)',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Typography
            sx={{
              color: 'var(--neon-blue)',
              mr: 1,
              fontSize: { xs: '14px', md: '16px' },
              flexShrink: 0,
            }}
          >
            π
          </Typography>
          <Typography
            sx={{
              color: 'var(--text-muted)',
              fontSize: { xs: '14px', md: '16px' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentFact}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
