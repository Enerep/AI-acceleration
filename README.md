# DON’T STOP.

A Next.js experience making the human case for AI acceleration. Built from the original `DON'T STOP.html` draft, which is preserved in the repository.

## Run locally

Requires Node.js 22.18+ (or Node.js 24+) for the TypeScript test runner. Next.js itself requires Node.js 20.9+.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production server, run `npm run build` and then `npm start`.

## The experience

- A procedurally rendered particle torus with pointer response and a hold-to-accelerate control (mouse, touch, Space, or Enter).
- Scroll-driven count-ups, chart drawing, a pinned horizontal possibility gallery on desktop, and a word-by-word manifesto reveal.
- Responsive stacked cards on phones and tablets.
- A ten-year compounding calculator with adjustable assumptions and zero-, one-, three-, or five-year delays.
- A native accessible source dialog, keyboard focus restoration, a motion pause button, and system reduced-motion support.
- Locally bundled fonts, an SVG favicon, and a generated social preview.

## Content and evidence

Edit statistics, source details, and possibility cards in `src/lib/content.ts`. The main experience is in `src/components/experience.tsx`; the particle sculpture and illustrative SVGs are separate components. Styling lives in `src/app/globals.css`.

The statistics are dated historical results with primary-source links and scope notes. The possibility cards are aspirations. The calculator illustrates compounding and does not forecast AI or economic outcomes. The visual-engine multiplier changes animation speed only.

Before publishing, set `NEXT_PUBLIC_SITE_URL` to the real public origin in `.env.local` or your hosting environment so social metadata uses the correct domain. No public deployment has been configured.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Use `npm run format` to format the source. Fonts and visual assets require no external services at runtime.
