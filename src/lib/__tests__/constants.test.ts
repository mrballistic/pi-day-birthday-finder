import { describe, it, expect } from 'vitest';
import {
  PI_DIGIT_COUNT,
  DISPLAY_WINDOW,
  CONTEXT_MARGIN,
  SCAN_DURATION_MS,
  TRIVIA_CYCLE_MS,
  RESULT_CARD_DELAY_MS,
  SCAN_TO_RESULT_DELAY_MS,
  COUNTER_ANIMATION_MS,
} from '../constants';

describe('constants', () => {
  it('PI_DIGIT_COUNT is 5 million', () => {
    expect(PI_DIGIT_COUNT).toBe(5_000_000);
  });

  it('DISPLAY_WINDOW is reasonable for screen display', () => {
    expect(DISPLAY_WINDOW).toBeGreaterThan(20);
    expect(DISPLAY_WINDOW).toBeLessThan(200);
  });

  it('CONTEXT_MARGIN is less than half of DISPLAY_WINDOW', () => {
    expect(CONTEXT_MARGIN).toBeLessThan(DISPLAY_WINDOW / 2);
  });

  it('scan duration is between 4-8 seconds as per spec', () => {
    expect(SCAN_DURATION_MS).toBeGreaterThanOrEqual(4000);
    expect(SCAN_DURATION_MS).toBeLessThanOrEqual(8000);
  });

  it('trivia cycles every 3 seconds', () => {
    expect(TRIVIA_CYCLE_MS).toBe(3000);
  });

  it('timing constants are positive numbers', () => {
    expect(RESULT_CARD_DELAY_MS).toBeGreaterThan(0);
    expect(SCAN_TO_RESULT_DELAY_MS).toBeGreaterThan(0);
    expect(COUNTER_ANIMATION_MS).toBeGreaterThan(0);
  });
});
