'use client';

import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { GRADIENT_PRIMARY, GRADIENT_PRIMARY_HOVER } from '@/lib/constants';

/** Props for the {@link BirthdayInput} component. */
interface BirthdayInputProps {
  /** Called with the selected date when the user clicks "Search π". */
  onSearch: (date: Date) => void;
  /** Disables the search button (e.g. while pi digits are loading). */
  disabled?: boolean;
  /** Shows a loading label on the button while pi digits fetch. */
  loading?: boolean;
}

/**
 * Phase 1 landing screen: animated π hero, headline, MUI DatePicker, and CTA button.
 * Prevents selection of future dates. Renders with a fade-in/slide-up entrance animation.
 */
export default function BirthdayInput({ onSearch, disabled, loading }: BirthdayInputProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSearch = () => {
    if (selectedDate) {
      onSearch(selectedDate);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          px: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero π Symbol */}
        <Typography
          sx={{
            fontSize: { xs: '120px', md: '200px' },
            fontWeight: 700,
            lineHeight: 1,
            animation: 'pulseGlow 4s ease-in-out infinite',
            mb: 2,
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          π
        </Typography>

        {/* Headline */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            mb: 2,
            textShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
          }}
        >
          Find Your Birthday in π
        </Typography>

        {/* Subheadline */}
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.15rem' },
            maxWidth: 500,
            mb: 5,
            lineHeight: 1.6,
          }}
        >
          Every birthday is hiding somewhere in the infinite digits of pi. Let&apos;s find yours.
        </Typography>

        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Your Birthday"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            maxDate={new Date()}
            slotProps={{
              textField: {
                sx: {
                  mb: 3,
                  width: { xs: 280, sm: 320 },
                  '& .MuiInputBase-root': {
                    fontFamily: 'var(--font-mono), monospace',
                  },
                },
              },
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                  },
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* CTA Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleSearch}
          disabled={!selectedDate || disabled || loading}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: '1.1rem',
            background: GRADIENT_PRIMARY,
            '&:hover': {
              background: GRADIENT_PRIMARY_HOVER,
              transform: 'scale(1.05)',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
            },
            '&:disabled': {
              background: 'rgba(255,255,255,0.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'Loading π digits...' : 'Search π'}
        </Button>
      </Box>
    </motion.div>
  );
}
