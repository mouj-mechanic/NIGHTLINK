# NIGHTLINK

**Enter the room. Feel the crowd. Find your table.**

NIGHTLINK is an 18+ virtual nightlife platform demo: cinematic club arrival, live rooms with DJ energy, crowd presence, and a social chain from poke → chat → shared table → VIP → gifts. It is built as an investor-facing mock — polished enough to walk in three minutes, with no production backend.

Music source badges mean connected-platform / now-playing metadata only. Audio is synthetic Web Audio (or an optional local file). Age checks, payments, and multiplayer are simulated for the demo.

## Investor Demo

Clone and run from the official repo:

```bash
git clone https://github.com/mouj-mechanic/NIGHTLINK.git
cd NIGHTLINK
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

```bash
npm run build
npm start
```

### Demo Director

- Enable demo mode: [http://127.0.0.1:43127/?demo=1](http://127.0.0.1:43127/?demo=1)
- Jump to a preset (skips cinematic intro except `start`):
  - [/?demo=1&preset=start](http://127.0.0.1:43127/?demo=1&preset=start)
  - [/?demo=1&preset=social](http://127.0.0.1:43127/?demo=1&preset=social)
  - [/?demo=1&preset=table](http://127.0.0.1:43127/?demo=1&preset=table)
  - [/?demo=1&preset=vip](http://127.0.0.1:43127/?demo=1&preset=vip)

The Demo Director panel (bottom-right) offers **START 3-MINUTE DEMO**, presets 1–4, **Skip Intro / Go straight inside**, **RESET EVERYTHING**, and granular actions.

### Cinematic journey

Exterior → Approach → ID check (EU Age Proof / ID provider previews + Demo verification) → doors open → corridor / vestiaire → party poster hall. Use **Skip Intro** anytime.

### Social journey (flagship)

Enter **Neon Athens** → open **MayaWave** (87% music match) → **Poke** → auto poke-back → chat → start a table → invite **AlexBass** → upgrade **VIP Midnight Crew** → send **Champagne**.

State persists in `localStorage` under `nightlink-demo-v2`. Reset from Demo Director or Profile → Demo settings.

## Core Concept

Consent-forward nightlife social: presence in a live room, mutual poke to unlock chat, then an opt-in shared table — never a cold DM blast. Camera defaults off; VIP and gifts are optional upgrades inside an already mutual moment.

## Vision

> NIGHTLINK is where the night becomes a room you can actually share — music first, people second, tables when the vibe is right.

Possible extensions: real age-proof providers, licensed listening integrations, private events, and moderated multiplayer presence. This repo stays a front-end investor demo.

## Demo limitations

- Age verification, payments (VIP €4.99), and gifts are mocked
- Spotify / Deezer / YouTube badges are connection metadata — not catalog rebroadcast
- No real multiplayer, accounts, or video streaming backend
- Crowd energy, listener drift, and MayaWave poke-back are local simulations

## Assets

All demo art is stored locally under `public/`:

| Path | Contents | Source |
|------|----------|--------|
| `public/cinematic/` | Exterior, guards, corridor | Original NIGHTLINK vector scenes |
| `public/avatars/` | DJ + attendee portraits | Demo-safe stylized SVGs (local only) |
| `public/flyers/` | Room posters | DiceBear Shapes (CC0 1.0), stored locally |

No celebrity likenesses, no GTA / game IP, no third-party brand logos as product marks.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · shadcn/ui · Lucide · Framer Motion · Zustand (persist)

## Deployment (Vercel)

1. Import `mouj-mechanic/NIGHTLINK` in Vercel
2. Framework preset: Next.js — build `npm run build`, output default
3. No env secrets required for the demo
4. Optional: set `NEXT_PUBLIC_APP_URL` to the deployment URL

`localStorage` is client-only (SSR-safe). Prefer production `npm run build && npm start` for investor walkthroughs.

## License

Private investor demo — all rights reserved unless otherwise noted for CC0 flyer shapes.
