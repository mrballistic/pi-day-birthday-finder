import { describe, it, expect } from 'vitest';
import { shuffleArray, randomDigit, scanEase } from '../utils';

describe('shuffleArray', () => {
  it('returns array of same length', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffleArray(input)).toHaveLength(5);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });

  it('handles empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('handles single-element array', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });

  it('works with string arrays', () => {
    const input = ['a', 'b', 'c'];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(['a', 'b', 'c']);
  });

  it('produces different orders (statistical)', () => {
    const input = Array.from({ length: 20 }, (_, i) => i);
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      results.add(JSON.stringify(shuffleArray(input)));
    }
    // Extremely unlikely all 10 shuffles produce same order
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('randomDigit', () => {
  it('returns a single character string', () => {
    expect(randomDigit()).toHaveLength(1);
  });

  it('returns a digit 0-9', () => {
    for (let i = 0; i < 100; i++) {
      const d = randomDigit();
      expect(d).toMatch(/^[0-9]$/);
    }
  });

  it('produces varied results', () => {
    const digits = new Set<string>();
    for (let i = 0; i < 100; i++) {
      digits.add(randomDigit());
    }
    // Should see at least a few different digits in 100 calls
    expect(digits.size).toBeGreaterThan(3);
  });
});

describe('scanEase', () => {
  it('returns 0 at progress 0', () => {
    expect(scanEase(0)).toBe(0);
  });

  it('returns 1 at progress 1', () => {
    expect(scanEase(1)).toBe(1);
  });

  it('is monotonically increasing', () => {
    let prev = 0;
    for (let p = 0; p <= 1; p += 0.01) {
      const val = scanEase(p);
      expect(val).toBeGreaterThanOrEqual(prev - 0.0001); // small epsilon for float
      prev = val;
    }
  });

  it('is slow in the first 15%', () => {
    // At 15% progress, eased progress should be relatively low
    const at15 = scanEase(0.15);
    expect(at15).toBeLessThan(0.2);
  });

  it('is fast in the middle phase', () => {
    // From 15% to 70% should cover a large range
    const at15 = scanEase(0.15);
    const at70 = scanEase(0.7);
    expect(at70 - at15).toBeGreaterThan(0.5);
  });

  it('slows down near the end', () => {
    // Last 30% of time should only cover ~15% of distance
    const at70 = scanEase(0.7);
    const at100 = scanEase(1);
    expect(at100 - at70).toBeLessThan(0.2);
  });

  it('handles phase boundaries correctly', () => {
    // These shouldn't throw or produce NaN
    expect(scanEase(0.15)).toBeCloseTo(0.15, 5);
    expect(scanEase(0.7)).toBeCloseTo(0.85, 5);
  });
});
