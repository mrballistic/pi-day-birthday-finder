/**
 * Returns a new shuffled copy of the array using the Fisher-Yates algorithm.
 * @param arr - The source array to shuffle.
 * @returns A randomly ordered shallow copy of the input.
 */
export function shuffleArray<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a random single-digit string ("0"–"9").
 */
export function randomDigit(): string {
  return Math.floor(Math.random() * 10).toString();
}

/**
 * Three-phase easing function for the scan animation.
 * - 0–15%: Quadratic ease-in (slow start)
 * - 15–70%: Linear ramp (blur speed)
 * - 70–100%: Quadratic ease-out (dramatic slowdown)
 *
 * @param progress - Linear progress from 0 to 1.
 * @returns Eased progress from 0 to 1.
 */
export function scanEase(progress: number): number {
  if (progress < 0.15) {
    return progress * progress * (1 / 0.15);
  } else if (progress < 0.7) {
    const t = (progress - 0.15) / 0.55;
    return 0.15 + t * 0.7;
  } else {
    const t = (progress - 0.7) / 0.3;
    return 0.85 + t * t * 0.15;
  }
}
