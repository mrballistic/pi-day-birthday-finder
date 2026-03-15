/** In-memory cache for the pi digit string to avoid re-fetching. */
let cachedDigits: string | null = null;

/**
 * Loads the first 5,000,000 digits of π from the static JSON file.
 * Results are cached in memory so subsequent calls return instantly.
 * @returns The pi digit string (digits after the decimal point).
 * @throws If the fetch request to `/pi-digits.json` fails.
 */
export async function loadPiDigits(): Promise<string> {
  if (cachedDigits) return cachedDigits;

  const response = await fetch('/pi-digits.json');
  if (!response.ok) {
    throw new Error('Failed to load pi digits');
  }

  const data = await response.json();
  if (typeof data?.digits !== 'string' || data.digits.length === 0) {
    throw new Error('Invalid pi digits data format');
  }
  cachedDigits = data.digits as string;
  return cachedDigits!;
}
