import { describe, it, expect } from 'vitest';
import { generateFunFact } from '../funFacts';

describe('generateFunFact', () => {
  it('returns early message for position ≤ 100', () => {
    expect(generateFunFact(50)).toContain('incredibly early');
    expect(generateFunFact(100)).toContain('incredibly early');
  });

  it('returns enthusiast message for position ≤ 1000', () => {
    expect(generateFunFact(500)).toContain('serious π enthusiasts');
    expect(generateFunFact(1000)).toContain('serious π enthusiasts');
  });

  it('returns percentage message for position ≤ 10000', () => {
    const fact = generateFunFact(5000);
    expect(fact).toContain('%');
    expect(fact).toContain('five million');
  });

  it('returns formatted position for position ≤ 100000', () => {
    const fact = generateFunFact(50000);
    expect(fact).toContain('50,000');
    expect(fact).toContain('%');
  });

  it('returns "way out" message for position > 100000', () => {
    const fact = generateFunFact(500000);
    expect(fact).toContain('Way out');
    expect(fact).toContain('500,000');
  });

  it('calculates percentage correctly', () => {
    const fact = generateFunFact(2500000); // 50% of 5M
    expect(fact).toContain('50.0000%');
  });

  it('handles position 1', () => {
    const fact = generateFunFact(1);
    expect(fact).toContain('incredibly early');
  });

  it('handles boundary at 101 (transitions to next tier)', () => {
    expect(generateFunFact(101)).toContain('serious π enthusiasts');
  });
});
