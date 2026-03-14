# Pi Day Birthday Finder

A flashy single-page app that finds your birthday in the first 1,000,000 digits of π. Enter your birthday, watch a dramatic sci-fi digit scan, and discover exactly where your birthday hides in pi.

Built for Pi Day (March 14).

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

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

The app searches for your birthday in the first million digits of π using `String.prototype.indexOf()` — effectively instant. The 6-second scanning animation is purely cosmetic, with a three-phase speed ramp (slow start → blur speed → dramatic slowdown near the match).

### Search Priority

| Priority | Format     | Example (Jul 4, 1990) | Badge                  |
|----------|------------|----------------------|------------------------|
| 1        | MMDDYYYY   | `07041990`           | Full Date Match        |
| 2        | DDMMYYYY   | `04071990`           | Full Date Match (Intl) |
| 3        | MMDD       | `0704`               | Month+Day Match        |
| 4        | MMDDYY     | `070490`             | Date Match (Short Year)|
| 5        | MD         | `74`                 | Partial Match          |

A 2-digit match is guaranteed within 1M digits.

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
node scripts/generate-pi.js  # Regenerate pi digits JSON
```

## License

[MIT](LICENSE)
