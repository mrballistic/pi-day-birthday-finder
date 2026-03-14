'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { loadPiDigits } from '@/lib/piLoader';
import { searchPiDigits, SearchResult } from '@/lib/searchStrategies';

/** Return value of the {@link usePiSearch} hook. */
interface UsePiSearchReturn {
  /** The loaded pi digit string, or null while loading. */
  piDigits: string | null;
  /** True while the pi digits JSON is being fetched. */
  loading: boolean;
  /** Error message if the pi digits failed to load. */
  error: string | null;
  /** The most recent search result, or null if no search has been performed. */
  result: SearchResult | null;
  /** Searches the pi digits for the given birthday. */
  search: (birthday: Date) => void;
  /** Clears the current search result. */
  reset: () => void;
}

/**
 * Hook that loads the pi digit data on mount and provides a search function.
 * Fetches `/pi-digits.json` asynchronously and caches it. The search itself
 * uses `String.prototype.indexOf()` and is effectively instant.
 */
export function usePiSearch(): UsePiSearchReturn {
  const [piDigits, setPiDigits] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const digitsRef = useRef<string | null>(null);

  useEffect(() => {
    loadPiDigits()
      .then((digits) => {
        digitsRef.current = digits;
        setPiDigits(digits);
        setLoading(false);
      })
      .catch(() => {
        setError('Looks like π is being irrational today. Please refresh and try again.');
        setLoading(false);
      });
  }, []);

  const search = useCallback((birthday: Date) => {
    if (!digitsRef.current) return;
    const searchResult = searchPiDigits(digitsRef.current, birthday);
    setResult(searchResult);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { piDigits, loading, error, result, search, reset };
}
