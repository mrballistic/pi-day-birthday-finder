import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to re-import fresh each test to reset the cache
let loadPiDigits: () => Promise<string>;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import('../piLoader');
  loadPiDigits = mod.loadPiDigits;
});

describe('loadPiDigits', () => {
  it('fetches from /pi-digits.json', async () => {
    const mockDigits = '14159265358979323846';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ digits: mockDigits }),
    });

    const result = await loadPiDigits();
    expect(global.fetch).toHaveBeenCalledWith('/pi-digits.json');
    expect(result).toBe(mockDigits);
  });

  it('caches the result on subsequent calls', async () => {
    const mockDigits = '14159265358979323846';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ digits: mockDigits }),
    });

    await loadPiDigits();
    await loadPiDigits();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('throws on network error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(loadPiDigits()).rejects.toThrow('Failed to load pi digits');
  });

  it('throws on invalid data format', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ digits: '' }),
    });

    await expect(loadPiDigits()).rejects.toThrow('Invalid pi digits data format');
  });

  it('throws when digits key is missing', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'wrong key' }),
    });

    await expect(loadPiDigits()).rejects.toThrow('Invalid pi digits data format');
  });
});
