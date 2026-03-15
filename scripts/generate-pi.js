#!/usr/bin/env node
/**
 * generate-pi.js
 * Downloads or computes the first 5,000,000 digits of pi after the decimal point
 * and saves them to public/pi-digits.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'pi-digits.json');
const KNOWN_PREFIX = '14159265358979323846';
const REQUIRED_DIGITS = 5_000_000;

// URLs to try in order (5M+ digit sources first, then 1M fallbacks)
const SOURCES = [
  'https://pi2e.ch/blog/wp-content/uploads/2017/03/pi_dec_10m.txt',
  'http://pi2e.ch/blog/wp-content/uploads/2017/03/pi_dec_10m.txt',
  'https://pi2e.ch/blog/wp-content/uploads/2017/03/pi_dec_1m.txt',
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    console.log(`  Trying: ${url}`);
    const req = client.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        console.log(`  Redirecting to: ${res.headers.location}`);
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout fetching ${url}`)); });
  });
}

/**
 * Extract exactly REQUIRED_DIGITS digits of pi (after decimal) from raw text.
 * Handles formats like "3.14159..." or "14159..." or text with whitespace/newlines.
 */
function extractPiDigits(raw) {
  // Remove all whitespace
  let text = raw.replace(/\s+/g, '');

  // Some sources include "3." prefix — strip it
  if (text.startsWith('3.')) {
    text = text.slice(2);
  } else if (text.startsWith('3')) {
    // Might be "314159..." without decimal
    // Check if second char is '1' (would be "31415..." — drop leading '3')
    if (text.charAt(1) === '1' && text.charAt(2) === '4') {
      text = text.slice(1);
    }
  }

  // Keep only digits
  text = text.replace(/[^0-9]/g, '');

  return text;
}

/**
 * Machin-like formula for computing pi digits using arbitrary precision.
 * We'll use a spigot-style bigint approach for 1M digits.
 * This uses the Bailey–Borwein–Plouffe (BBP) formula via the
 * standard digit-extraction approach with BigInt arithmetic.
 *
 * Actually we'll use a simpler: Machin's formula with bigint division
 * pi/4 = 4*arctan(1/5) - arctan(1/239)
 * arctan(1/x) = 1/x - 1/(3x^3) + 1/(5x^5) - ...
 *
 * For 1M digits we need ~1M+extra precision.
 */
function computePiDigits(numDigits) {
  console.log(`Computing ${numDigits} digits of pi using Machin formula + BigInt...`);
  console.log('This may take several minutes for 1M digits...');

  // We compute with extra guard digits
  const EXTRA = 20;
  const SCALE = numDigits + EXTRA;

  // Work in base 10^SCALE (multiply everything by 10^SCALE)
  const TEN = 10n;
  const base = TEN ** BigInt(SCALE);

  // arctan(1/x) series: sum_{k=0}^{inf} (-1)^k / ((2k+1) * x^(2k+1))
  function arctanInverse(x) {
    const xBig = BigInt(x);
    let sum = base / xBig;
    let term = base / xBig;
    const xSq = xBig * xBig;
    let k = 1n;
    while (true) {
      term = term / xSq;
      const delta = term / (2n * k + 1n);
      if (delta === 0n) break;
      if (k % 2n === 1n) {
        sum -= delta;
      } else {
        sum += delta;
      }
      k++;
      if (k % 100000n === 0n) {
        process.stdout.write('.');
      }
    }
    console.log('');
    return sum;
  }

  // Machin: pi/4 = 4*arctan(1/5) - arctan(1/239)
  console.log('Computing arctan(1/5)...');
  const at5 = arctanInverse(5);
  console.log('Computing arctan(1/239)...');
  const at239 = arctanInverse(239);

  const piOver4 = 4n * at5 - at239;
  const pi = 4n * piOver4;

  // Convert to string — pi is stored as an integer representing pi * 10^SCALE
  // So the digits are the string representation of `pi`
  let piStr = pi.toString();

  // piStr should be "3141592653..." — length SCALE+1 (leading '3')
  // Remove the leading '3' to get fractional digits
  if (piStr.startsWith('3')) {
    piStr = piStr.slice(1);
  }

  // Pad if needed (shouldn't be necessary)
  while (piStr.length < numDigits) {
    piStr = piStr + '0';
  }

  return piStr.slice(0, numDigits);
}

async function tryFetchFromNetwork() {
  for (const url of SOURCES) {
    try {
      const raw = await fetchUrl(url);
      const digits = extractPiDigits(raw);
      if (digits.length >= REQUIRED_DIGITS) {
        console.log(`  Successfully fetched ${digits.length} digits from network.`);
        return digits.slice(0, REQUIRED_DIGITS);
      } else {
        console.log(`  Got ${digits.length} digits (need ${REQUIRED_DIGITS}), skipping source.`);
      }
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }
  return null;
}

function validate(digits) {
  if (digits.length !== REQUIRED_DIGITS) {
    throw new Error(`Expected ${REQUIRED_DIGITS} digits, got ${digits.length}`);
  }
  if (!digits.startsWith(KNOWN_PREFIX)) {
    throw new Error(`Validation failed: digits start with "${digits.slice(0, 20)}", expected "${KNOWN_PREFIX}"`);
  }
  // Ensure all characters are digits
  if (!/^\d+$/.test(digits)) {
    throw new Error('Non-digit characters found in pi digits string');
  }
  console.log(`Validation passed. First 20 digits: ${digits.slice(0, 20)}`);
}

async function main() {
  console.log('=== Pi Digits Generator ===');
  console.log(`Target: ${REQUIRED_DIGITS.toLocaleString()} digits after the decimal point`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log('');

  let digits = null;

  // Try network first
  console.log('Step 1: Attempting network fetch...');
  try {
    digits = await tryFetchFromNetwork();
  } catch (err) {
    console.log(`Network fetch error: ${err.message}`);
  }

  if (!digits) {
    console.log('');
    console.log('Step 2: Network unavailable. Computing pi using Machin formula + BigInt arithmetic...');
    console.log('Note: Computing 1M digits may take 5-15 minutes depending on hardware.');
    digits = computePiDigits(REQUIRED_DIGITS);
  }

  // Validate
  console.log('');
  console.log('Validating digits...');
  validate(digits);

  // Write output
  const output = JSON.stringify({ digits });
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');

  const stats = fs.statSync(OUTPUT_PATH);
  console.log('');
  console.log(`Written to: ${OUTPUT_PATH}`);
  console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Digits: ${digits.length.toLocaleString()}`);
  console.log(`First 20: ${digits.slice(0, 20)}`);
  console.log(`Last  10: ${digits.slice(-10)}`);
  console.log('');
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
