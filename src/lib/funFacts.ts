/**
 * Generates a human-readable fun fact based on the match position in pi.
 * Returns different messages for early matches vs. deep positions.
 * @param position - The 1-indexed position in the pi digit string where the match was found.
 * @returns A fun fact string describing how far into pi the position is.
 */
export function generateFunFact(position: number): string {
  const percentage = ((position / 5_000_000) * 100).toFixed(4);

  if (position <= 100) {
    return `That's incredibly early — within the first 100 digits! Most people never memorize that far.`;
  }
  if (position <= 1000) {
    return `That's within the first 1,000 digits — only serious π enthusiasts memorize this deep!`;
  }
  if (position <= 10000) {
    return `That's ${percentage}% of the way through the first five million digits of π.`;
  }
  if (position <= 100000) {
    return `Position ${position.toLocaleString()} — that's ${percentage}% into the first five million digits!`;
  }
  return `Way out at position ${position.toLocaleString()} — ${percentage}% through the first five million digits of π!`;
}
