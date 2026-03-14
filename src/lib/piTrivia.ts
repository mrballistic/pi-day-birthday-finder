/** Collection of 23 verified pi trivia facts displayed during the scan animation. */
export const PI_TRIVIA: string[] = [
  "π has been calculated to over 105 trillion digits — and counting.",
  "The first 144 digits of π add up to 666.",
  "Albert Einstein was born on Pi Day — March 14, 1879.",
  "π is irrational — its decimal representation never ends and never repeats.",
  "If you write π to 39 digits, you can calculate the circumference of the observable universe to within the width of a hydrogen atom.",
  "The probability that two random integers are coprime is 6/π².",
  "In 1897, an Indiana bill nearly legislated π to be 3.2. It failed.",
  "π appears in the equation for the normal distribution — the bell curve.",
  "The Feynman point — six consecutive 9s — begins at position 762 in π.",
  "Archimedes was the first to rigorously approximate π using 96-sided polygons.",
  "William Shanks calculated π to 707 places by hand in 1873. He was wrong after digit 527.",
  "March 14 at 1:59:26 is the most precise Pi Day moment — 3.1415926.",
  "π is transcendental — it cannot be the root of any polynomial with rational coefficients.",
  "The Greek letter π was first used for the ratio by William Jones in 1706.",
  "Buffon's needle problem: dropping needles on lined paper approximates π.",
  "There's a language called Pilish where each word length matches a digit of π.",
  "The ancient Egyptians approximated π as 3.1605 — remarkably close for 1650 BCE.",
  "In Star Trek's 'Wolf in the Fold,' Spock defeats a computer by asking it to compute π to the last digit.",
  "The record for memorizing π is 70,030 digits, held by Suresh Kumar Sharma.",
  "If you search long enough in π, you can find any finite sequence of digits — including your phone number.",
  "π day was officially recognized by the U.S. House of Representatives in 2009.",
  "The circumference of a circle with diameter 1 is exactly π.",
  "Leonhard Euler popularized the use of π in mathematics in the 1730s.",
];

/**
 * Returns a new shuffled copy of the trivia array using the Fisher-Yates algorithm.
 * Called on each scan start so users see different facts on repeat visits.
 * @returns A randomly ordered copy of {@link PI_TRIVIA}.
 */
export function shuffleTrivia(): string[] {
  const arr = [...PI_TRIVIA];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
