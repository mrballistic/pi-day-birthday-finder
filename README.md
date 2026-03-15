# Pi Day Birthday Finder

A flashy single-page app that finds your birthday in the first 5,000,000 digits of π. Enter your birthday, watch a dramatic sci-fi digit scan, and discover exactly where your birthday hides in pi.

Built for Pi Day (March 14).

**Live:** [pi-day-birthday-finder.vercel.app](https://pi-day-birthday-finder.vercel.app)

## Demo

1. Pick your birthday from the date picker
2. Watch the animated scanner race through digits of π
3. See your result with confetti, position counter, and shareable card

## Stack

- **Next.js 15** — App Router, TypeScript
- **MUI v6** — Material UI components + date pickers
- **Framer Motion** — phase transitions and ticker animations
- **canvas-confetti** — celebration effects
- **Google Fonts** — Inter (body) + JetBrains Mono (digits)
- **Vercel Analytics** — page view tracking

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

The app searches for your birthday in the first five million digits of π using `String.prototype.indexOf()` — effectively instant. The 6-second scanning animation is purely cosmetic, with a three-phase speed ramp (slow start → blur speed → dramatic slowdown near the match).

### Search Priority

Strategies are tried longest-first to maximize match quality:

| Priority | Format     | Example (Jul 4, 1990) | Badge                      |
|----------|------------|----------------------|----------------------------|
| 1        | MMDDYYYY   | `07041990`           | Full Date Match            |
| 2        | DDMMYYYY   | `04071990`           | Full Date Match (Intl)     |
| 3        | MMDDYY     | `070490`             | Date Match (Short Year)    |
| 4        | DDMMYY     | `040790`             | Date Match (Intl Short Year)|
| 5        | MMDD       | `0704`               | Month+Day Match            |
| 6        | MD         | `74`                 | Partial Match              |

A 2-digit match is guaranteed within 5M digits.

## Scripts

```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npm test               # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
node scripts/generate-pi.js  # Regenerate pi digits JSON
```

## Testing

80 unit tests covering all lib modules and hooks using [Vitest](https://vitest.dev/). Coverage thresholds enforced at 80% for statements, branches, functions, and lines.

```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|--------
All files          |   98.42 |    94.59 |     100 |   99.16
```

## CI

GitHub Actions runs lint, tests (with coverage), and build on every push and PR against `main`, on Node 22 and 24.

## License

[MIT](LICENSE)
