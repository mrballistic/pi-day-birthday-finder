/** Total number of pi digits loaded from the static JSON file. */
export const PI_DIGIT_COUNT = 5_000_000;

/** Number of digits shown in the sliding display window during scan. */
export const DISPLAY_WINDOW = 60;

/** Number of digits shown on each side of the match in the context strip. */
export const CONTEXT_MARGIN = 20;

/** Total duration of the scan animation in milliseconds. */
export const SCAN_DURATION_MS = 6000;

/** Interval between trivia fact rotations in milliseconds. */
export const TRIVIA_CYCLE_MS = 3000;

/** Delay before the result card appears after scan completes. */
export const RESULT_CARD_DELAY_MS = 1500;

/** Delay between scan completion and phase transition to result. */
export const SCAN_TO_RESULT_DELAY_MS = 500;

/** Duration of the animated position counter on the result card. */
export const COUNTER_ANIMATION_MS = 1500;

/** Primary action button gradient. */
export const GRADIENT_PRIMARY = 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))';

/** Primary action button hover gradient. */
export const GRADIENT_PRIMARY_HOVER = 'linear-gradient(135deg, #00b8e6, #9a3de6)';

/** Confetti color palettes. */
export const CONFETTI_COLORS_CENTER = ['#ffd700', '#00d4ff', '#ff2d95', '#ffffff'];
export const CONFETTI_COLORS_SIDE = ['#ffd700', '#00d4ff', '#b24bff'];
