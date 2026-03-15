/** The result of searching for a birthday in the pi digit string. */
export interface SearchResult {
  /** 1-indexed position where the match begins in the pi digit string. */
  position: number;
  /** The formatted date string that was found (e.g. "07041990", "0704"). */
  matchString: string;
  /** Category of match based on which search strategy succeeded. */
  matchType: 'full' | 'full-intl' | 'month-day' | 'short-year' | 'partial';
  /** Human-readable label for the match type (e.g. "Full Date Match"). */
  label: string;
  /** Emoji-prefixed badge text for display (e.g. "🌟 Full Date Match"). */
  badge: string;
}

/** Defines how to convert a Date into a search string and label a match. */
interface SearchStrategy {
  /** Converts a Date into the digit string to search for. */
  format: (date: Date) => string;
  /** The match category this strategy produces. */
  matchType: SearchResult['matchType'];
  /** Human-readable label for the match type. */
  label: string;
  /** Emoji-prefixed badge text for UI display. */
  badge: string;
}

/**
 * Zero-pads a number to the specified length.
 * @param n - The number to pad.
 * @param len - Target string length (defaults to 2).
 */
function pad(n: number, len: number = 2): string {
  return n.toString().padStart(len, '0');
}

/**
 * Ordered list of search strategies, tried from longest to shortest match:
 * MMDDYYYY → DDMMYYYY → MMDDYY → DDMMYY → MMDD → MD.
 */
const strategies: SearchStrategy[] = [
  {
    format: (d) => `${pad(d.getMonth() + 1)}${pad(d.getDate())}${d.getFullYear()}`,
    matchType: 'full',
    label: 'Full Date Match',
    badge: '🌟 Full Date Match',
  },
  {
    format: (d) => `${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()}`,
    matchType: 'full-intl',
    label: 'Full Date Match (Intl)',
    badge: '🌟 Full Date Match',
  },
  {
    format: (d) => `${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getFullYear() % 100)}`,
    matchType: 'short-year',
    label: 'Date Match (Short Year)',
    badge: '🎂 Date Match (Short Year)',
  },
  {
    format: (d) => `${pad(d.getDate())}${pad(d.getMonth() + 1)}${pad(d.getFullYear() % 100)}`,
    matchType: 'short-year',
    label: 'Date Match (Intl Short Year)',
    badge: '🎂 Date Match (Short Year)',
  },
  {
    format: (d) => `${pad(d.getMonth() + 1)}${pad(d.getDate())}`,
    matchType: 'month-day',
    label: 'Month+Day Match',
    badge: '🎂 Month+Day Match',
  },
  {
    format: (d) => `${d.getMonth() + 1}${d.getDate()}`,
    matchType: 'partial',
    label: 'Partial Match',
    badge: '🔍 Partial Match',
  },
];

/**
 * Searches the pi digit string for a birthday using multiple format strategies.
 * Tries each strategy in priority order and returns the first match found.
 * Uses `String.prototype.indexOf()` for instant search on 5M characters.
 *
 * @param piDigits - The full pi digit string (digits after the decimal).
 * @param birthday - The birthday Date to search for.
 * @returns The search result with position and match metadata, or null if no match.
 */
export function searchPiDigits(piDigits: string, birthday: Date): SearchResult | null {
  for (const strategy of strategies) {
    const searchString = strategy.format(birthday);
    const position = piDigits.indexOf(searchString);
    if (position !== -1) {
      return {
        position: position + 1, // 1-indexed for display
        matchString: searchString,
        matchType: strategy.matchType,
        label: strategy.label,
        badge: strategy.badge,
      };
    }
  }
  return null;
}
