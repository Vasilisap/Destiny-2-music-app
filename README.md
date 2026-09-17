# Destiny 2 OST

A browsable, playable library of the Destiny 2 soundtrack, built with the Next.js App Router as a deep, working example of the framework rather than a toy CRUD app. Filter by expansion or mood, search hundreds of tracks, queue them up, shuffle, and keep playing while you navigate, all backed by a fully static, CDN-servable site.

## What it does

- **Browse and play** a 101-track catalogue, the complete official soundtracks for Red War, Forsaken, and Shadowkeep, plus a track each from Beyond Light, Witch Queen, and The Final Shape, each with composer credits, mood, and gameplay-context tags.
- **A queue that survives navigation.** Play a track, browse to another page, keep listening. Next, Previous, and Shuffle operate on a real queue built from whatever list you were looking at, filtered results included.
- **Filters that live in the URL.** `/?expansion=Forsaken&mood=epic` is a real, shareable, bookmarkable link, not client-only state.
- **Instant search**, `⌘K` / `Ctrl+K`, debounced and served from a Route Handler rather than shipping the whole catalogue to the browser.
- **Favorites** that persist per-browser via `localStorage`, with no account required.
- **Media Session integration**, so lock-screen and hardware media keys control playback.

## Architecture notes

This project doubles as a reference for a handful of Next.js and React patterns that are easy to get wrong:

- **Static by default, dynamic only where it has to be.** Every expansion, mood, and track page is prerendered at build time via `generateStaticParams`, 119 pages in total. Only the routes that actually read `searchParams` at request time, the filtered home page and the search API, are server-rendered on demand.
- **Streaming with a real fallback.** The filtered track list renders behind a `<Suspense>` boundary with a skeleton that mirrors the real grid's shape, so the static shell, header, and mood links included, paints immediately while the filtered results stream in.
- **A player that survives the whole session.** The YouTube player is created once and never torn down; every track change is a direct `loadVideoById`/`cueVideoById` call rather than destroying and rebuilding the underlying player, the more fragile approach this project moved away from after tracing a real, hard-to-diagnose bug back to it.
- **A stale-response-proof search box.** Search requests are debounced and cancelled with `AbortController`, so a fast keystroke can never have its result overwritten by a slower, older one resolving late.
- **`server-only` enforced, not just assumed.** The data module that reads the track catalogue is guarded with `import "server-only"`, so a client component accidentally importing it, and silently bundling the whole catalogue to the browser, fails the build instead of failing silently.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) · [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com) and [Radix UI](https://www.radix-ui.com) primitives
- [Zustand](https://zustand.docs.pmnd.rs) for player and favorites state
- [react-youtube](https://github.com/tjallingt/react-youtube) for playback
- [cmdk](https://cmdk.paco.me) for the command-palette search UI

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
app/                 Routes: home, favorites, /expansion/[slug], /mood/[mood],
                      /track/[id], and the /api/tracks search endpoint
components/
  layout/             Navbar, persistent player bar, favorites hydration
  player/             The YouTube player itself
  track/              Cards, grids, filters, search-driven list, skeleton
  search/             The ⌘K command palette
hooks/                Zustand stores: playback/queue, favorites
lib/tracks.ts         Server-only data access over data/tracks.json
data/tracks.json      The track catalogue
types/track.ts        Track, Expansion, Mood, and Tag types
```

## Data

Track titles, composer credits, and durations reflect Bungie's officially released soundtrack albums. Mood and gameplay-context tags are original editorial classifications made for this project, not sourced from anywhere official.

---

This is an unofficial fan project built for learning and portfolio purposes. *Destiny 2* and its soundtrack are the property of Bungie, Inc. This project is not affiliated with or endorsed by Bungie.
