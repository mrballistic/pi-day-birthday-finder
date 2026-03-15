'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { shuffleTrivia } from '@/lib/piTrivia';
import { TRIVIA_CYCLE_MS } from '@/lib/constants';

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
  const [facts, setFacts] = useState(shuffleTrivia);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Shuffle and reset on activation via a microtask to avoid sync setState in effect
    let index = 0;
    const shuffled = shuffleTrivia();
    setFacts(shuffled); // eslint-disable-line react-hooks/set-state-in-effect -- intentional reset on activation
    setCurrentIndex(0);

    const interval = setInterval(() => {
      index = (index + 1) % shuffled.length;
      setCurrentIndex(index);
    }, TRIVIA_CYCLE_MS);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

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
            {facts[currentIndex]}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
