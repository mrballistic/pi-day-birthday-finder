'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Chip, Snackbar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SearchResult } from '@/lib/searchStrategies';
import { generateFunFact } from '@/lib/funFacts';
import { RESULT_CARD_DELAY_MS, COUNTER_ANIMATION_MS, CONTEXT_MARGIN, GRADIENT_PRIMARY, GRADIENT_PRIMARY_HOVER } from '@/lib/constants';
import ConfettiExplosion from './ConfettiExplosion';

/** Props for the {@link ResultCard} component. */
interface ResultCardProps {
  /** The search result containing position, match string, and badge metadata. */
  result: SearchResult;
  /** The full pi digit string, used to build the context strip around the match. */
  piDigits: string;
  /** Called when the user clicks "Try Another Birthday" to return to Phase 1. */
  onReset: () => void;
}

/**
 * Phase 3 celebration card: glassmorphism card with animated position counter,
 * digit context strip (match highlighted in gold), fun fact, match type badge,
 * share-to-clipboard button, and reset button. Appears 1.5s after mount with
 * a confetti explosion firing immediately.
 */
export default function ResultCard({ result, piDigits, onReset }: ResultCardProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('Copied to clipboard!');
  const animatedRef = useRef(false);

  // Delay card appearance
  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), RESULT_CARD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Animate counter
  useEffect(() => {
    if (!showCard || animatedRef.current) return;
    animatedRef.current = true;

    const target = result.position;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNTER_ANIMATION_MS, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [showCard, result.position]);

  // Build context strip
  const pos0 = result.position - 1; // 0-indexed
  const contextStart = Math.max(0, pos0 - CONTEXT_MARGIN);
  const contextEnd = Math.min(piDigits.length, pos0 + CONTEXT_MARGIN);
  const contextDigits = piDigits.slice(contextStart, contextEnd);
  const highlightStart = pos0 - contextStart;
  const highlightEnd = highlightStart + result.matchString.length;

  const handleShare = async () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : '';
    const text = `My birthday is hiding at position ${result.position.toLocaleString()} in π! Find yours at ${url} #PiDay`;
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(text);
      setToastMessage('Copied to clipboard!');
    } catch {
      setToastMessage('Could not copy — try manually!');
    }
    setToastOpen(true);
  };

  const badgeColor =
    result.matchType === 'full' || result.matchType === 'full-intl'
      ? '#ffd700'
      : result.matchType === 'month-day' || result.matchType === 'short-year'
        ? '#00d4ff'
        : '#c0c0c0';

  return (
    <>
      <ConfettiExplosion />

      {showCard && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 20,
              mx: 'auto',
              mt: 4,
              p: { xs: 3, md: 5 },
              maxWidth: 600,
              width: { xs: '95%', sm: '80%' },
              borderRadius: 4,
              background: 'rgba(26, 26, 46, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              boxShadow: '0 0 40px rgba(0, 212, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            {/* Badge */}
            <Chip
              label={result.badge}
              sx={{
                mb: 3,
                backgroundColor: `${badgeColor}22`,
                color: badgeColor,
                border: `1px solid ${badgeColor}55`,
                fontWeight: 600,
                fontSize: { xs: '0.8rem', md: '0.9rem' },
              }}
            />

            {/* Primary message */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
              }}
            >
              Your birthday appears at position{' '}
              <Box
                component="span"
                sx={{
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-mono), monospace',
                }}
              >
                {displayCount.toLocaleString()}
              </Box>{' '}
              in π!
            </Typography>

            {/* Digit context strip */}
            <Box
              sx={{
                my: 3,
                py: 1.5,
                px: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.3)',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: { xs: 14, md: 18 },
                letterSpacing: 2,
              }}
            >
              {contextDigits.split('').map((d, i) => {
                const isHighlight = i >= highlightStart && i < highlightEnd;
                return (
                  <span
                    key={i}
                    style={{
                      color: isHighlight ? '#ffd700' : 'rgba(255,255,255,0.4)',
                      textShadow: isHighlight ? '0 0 10px #ffd700' : 'none',
                      fontWeight: isHighlight ? 700 : 400,
                    }}
                  >
                    {d}
                  </span>
                );
              })}
            </Box>

            {/* Fun fact */}
            <Typography sx={{ color: 'var(--text-muted)', mb: 4, fontSize: { xs: '0.85rem', md: '1rem' } }}>
              {generateFunFact(result.position)}
            </Typography>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={handleShare}
                sx={{
                  px: 4,
                  background: GRADIENT_PRIMARY,
                  '&:hover': {
                    background: GRADIENT_PRIMARY_HOVER,
                  },
                }}
              >
                Share Your Pi Position
              </Button>
              <Button
                variant="outlined"
                onClick={onReset}
                sx={{
                  px: 4,
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                  color: 'var(--neon-blue)',
                  '&:hover': {
                    borderColor: 'var(--neon-blue)',
                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                  },
                }}
              >
                Try Another Birthday
              </Button>
            </Box>
          </Box>
        </motion.div>
      )}

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
