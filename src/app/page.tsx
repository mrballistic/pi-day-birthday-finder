'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import BirthdayInput from '@/components/BirthdayInput';
import ScanAnimation from '@/components/ScanAnimation';
import ResultCard from '@/components/ResultCard';
import FloatingDigits from '@/components/FloatingDigits';
import { usePiSearch } from '@/hooks/usePiSearch';
import { useScanAnimation } from '@/hooks/useScanAnimation';
import { searchPiDigits } from '@/lib/searchStrategies';

/** The three phases of the app's state machine. */
type Phase = 'input' | 'scanning' | 'result';

/**
 * Main page component that orchestrates the three-phase state machine:
 * 1. **Input** — user picks a birthday via {@link BirthdayInput}.
 * 2. **Scanning** — cosmetic digit scan via {@link ScanAnimation}.
 * 3. **Result** — celebration and result display via {@link ResultCard}.
 *
 * Phase transitions are animated with Framer Motion's AnimatePresence.
 * The scan-to-result transition fires 500ms after the scan animation completes.
 */
export default function Home() {
  const [phase, setPhase] = useState<Phase>('input');
  const { piDigits, loading, error, result, search, reset: resetSearch } = usePiSearch();
  const scan = useScanAnimation();
  const transitionedRef = useRef(false);

  const handleSearchComplete = useCallback(
    (birthday: Date) => {
      if (!piDigits) return;
      search(birthday);

      const searchResult = searchPiDigits(piDigits, birthday);
      if (searchResult) {
        transitionedRef.current = false;
        setPhase('scanning');
        scan.startScan(piDigits, searchResult.position, searchResult.matchString.length);
      }
    },
    [piDigits, search, scan]
  );

  // Watch for scan completion and transition to result phase
  useEffect(() => {
    if (scan.scanComplete && phase === 'scanning' && !transitionedRef.current) {
      transitionedRef.current = true;
      const timer = setTimeout(() => setPhase('result'), 500);
      return () => clearTimeout(timer);
    }
  }, [scan.scanComplete, phase]);

  const handleReset = () => {
    setPhase('input');
    resetSearch();
    scan.reset();
  };

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          π
        </Typography>
        <Typography sx={{ color: 'var(--text-muted)', mb: 3 }}>{error}</Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <FloatingDigits />

      <AnimatePresence mode="wait">
        {phase === 'input' && (
          <BirthdayInput
            key="input"
            onSearch={handleSearchComplete}
            disabled={!piDigits}
            loading={loading}
          />
        )}

        {phase === 'scanning' && (
          <ScanAnimation
            key="scanning"
            displayDigits={scan.displayDigits}
            currentPosition={scan.currentPosition}
            isScanning={scan.isScanning}
            scanComplete={scan.scanComplete}
            matchPosition={result?.position}
            matchLength={result?.matchString.length}
          />
        )}

        {phase === 'result' && result && piDigits && (
          <Box key="result" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <ResultCard result={result} piDigits={piDigits} onReset={handleReset} />
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
