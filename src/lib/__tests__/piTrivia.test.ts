import { describe, it, expect } from 'vitest';
import { PI_TRIVIA, shuffleTrivia } from '../piTrivia';

describe('PI_TRIVIA', () => {
  it('has at least 20 facts', () => {
    expect(PI_TRIVIA.length).toBeGreaterThanOrEqual(20);
  });

  it('contains no empty strings', () => {
    PI_TRIVIA.forEach((fact) => {
      expect(fact.trim().length).toBeGreaterThan(0);
    });
  });

  it('contains no duplicates', () => {
    const unique = new Set(PI_TRIVIA);
    expect(unique.size).toBe(PI_TRIVIA.length);
  });

  it('contains known facts', () => {
    const hasEinstein = PI_TRIVIA.some((f) => f.includes('Einstein'));
    const hasFeynman = PI_TRIVIA.some((f) => f.includes('Feynman'));
    expect(hasEinstein).toBe(true);
    expect(hasFeynman).toBe(true);
  });
});

describe('shuffleTrivia', () => {
  it('returns same length as PI_TRIVIA', () => {
    expect(shuffleTrivia()).toHaveLength(PI_TRIVIA.length);
  });

  it('contains all original facts', () => {
    const shuffled = shuffleTrivia();
    expect([...shuffled].sort()).toEqual([...PI_TRIVIA].sort());
  });

  it('produces different orders on multiple calls', () => {
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      results.add(JSON.stringify(shuffleTrivia()));
    }
    expect(results.size).toBeGreaterThan(1);
  });
});
