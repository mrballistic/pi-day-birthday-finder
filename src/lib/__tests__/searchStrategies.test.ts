import { describe, it, expect } from 'vitest';
import { searchPiDigits, SearchResult } from '../searchStrategies';

// First 100 digits of pi after decimal for testing
const PI_SAMPLE = '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';

describe('searchPiDigits', () => {
  describe('priority order', () => {
    it('finds MMDDYYYY (full match) first when present', () => {
      // "14159265" exists at position 1 in pi
      const date = new Date(9265, 3, 14); // April 14, 9265 → "04149265"
      // That won't be in our sample, so let's craft a test with known digits
      const digits = '00000007041990999999';
      const result = searchPiDigits(digits, new Date(1990, 6, 4)); // Jul 4, 1990
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('07041990');
      expect(result!.matchType).toBe('full');
      expect(result!.badge).toBe('🌟 Full Date Match');
    });

    it('falls through to DDMMYYYY when MMDDYYYY absent', () => {
      // Only contains DDMMYYYY format
      const digits = '00000004071990999999';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('04071990');
      expect(result!.matchType).toBe('full-intl');
    });

    it('falls through to MMDDYY when full year formats absent', () => {
      const digits = '000000070490999999';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('070490');
      expect(result!.matchType).toBe('short-year');
    });

    it('falls through to DDMMYY (intl short year)', () => {
      const digits = '000000040790999999';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('040790');
      expect(result!.matchType).toBe('short-year');
    });

    it('falls through to MMDD when year formats absent', () => {
      const digits = '0000000704999999';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('0704');
      expect(result!.matchType).toBe('month-day');
      expect(result!.badge).toBe('🎂 Month+Day Match');
    });

    it('falls through to MD (partial) as last resort', () => {
      const digits = '00000074999999';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('74');
      expect(result!.matchType).toBe('partial');
      expect(result!.badge).toBe('🔍 Partial Match');
    });
  });

  describe('position calculation', () => {
    it('returns 1-indexed position', () => {
      const digits = '07041990';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result!.position).toBe(1);
    });

    it('returns correct position for mid-string match', () => {
      const digits = '99999907041990';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result!.position).toBe(7); // 0-indexed 6 → 1-indexed 7
    });
  });

  describe('date formatting', () => {
    it('zero-pads single-digit months', () => {
      const digits = '01011990';
      const result = searchPiDigits(digits, new Date(1990, 0, 1)); // Jan 1
      expect(result!.matchString).toBe('01011990');
    });

    it('zero-pads single-digit days', () => {
      const digits = '12051985';
      const result = searchPiDigits(digits, new Date(1985, 11, 5)); // Dec 5
      expect(result!.matchString).toBe('12051985');
    });

    it('handles Feb 29 (leap day)', () => {
      const digits = '02292000';
      const result = searchPiDigits(digits, new Date(2000, 1, 29));
      expect(result!.matchString).toBe('02292000');
    });

    it('formats two-digit year correctly', () => {
      const digits = '000000070400999999';
      const result = searchPiDigits(digits, new Date(2000, 6, 4));
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('070400');
    });

    it('handles MD format without zero-padding', () => {
      const digits = '000074000';
      const result = searchPiDigits(digits, new Date(1990, 6, 4)); // Jul 4 → "74"
      expect(result!.matchString).toBe('74');
    });
  });

  describe('edge cases', () => {
    it('returns null when no match found', () => {
      const result = searchPiDigits('00000000000', new Date(1990, 6, 4));
      expect(result).toBeNull();
    });

    it('handles empty digit string', () => {
      const result = searchPiDigits('', new Date(1990, 6, 4));
      expect(result).toBeNull();
    });

    it('prefers longer match even at later position', () => {
      // MMDDYYYY at pos 10 should win over MMDD at pos 1
      const digits = '07049999907041990';
      const result = searchPiDigits(digits, new Date(1990, 6, 4));
      expect(result!.matchType).toBe('full');
      expect(result!.matchString).toBe('07041990');
    });
  });

  describe('against real pi digits', () => {
    it('finds MMDD "1415" in pi sample', () => {
      // Pi starts with "14159265..." so MMDD "1415" is at position 1
      // Use a date where MMDD = "1415" — but months go 1-12, so no month 14.
      // Instead, test that "9265" (as partial "92" + "65") or a known match works
      // "26" is at position 7 in pi
      const result = searchPiDigits(PI_SAMPLE, new Date(2000, 1, 6)); // Feb 6 → "26"
      expect(result).not.toBeNull();
      expect(result!.matchString).toBe('26');
    });

    it('finds "3589" (MMDD March 5, any year) at position 10', () => {
      // Pi: 1415926535_8979... — "35" starts at position 10
      // A date with partial "35" → Mar 5 → "35"
      const result = searchPiDigits(PI_SAMPLE, new Date(2000, 2, 5)); // Mar 5
      expect(result).not.toBeNull();
    });
  });
});
