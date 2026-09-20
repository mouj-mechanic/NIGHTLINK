# NIGHTLINK

**Enter the room. Feel the crowd. Find your table.**

NIGHTLINK is an 18+ virtual nightlife and social-presence **investor demo** — a polished mock of clubs, crowd presence, poke → chat → table social mechanics, VIP upgrade, birthday gifts, DJ mode, and events. No production backend. No Spotify/Deezer streaming or copyrighted rebroadcast; audio is synthetic Web Audio (or optional local file upload).

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

```bash
npm run build   # production build
npm start       # serve the build (same port via script if configured)
```

## Investor demo

1. Open with demo mode: [http://127.0.0.1:43127/?demo=1](http://127.0.0.1:43127/?demo=1)  
   Or click **Investor Demo** in the header.
2. Use the **Demo Director** panel (bottom-right):
   - **Start guided demo** / **Next step** walks lobby → Neon Athens → age gate → crowd → MayaWave → poke → poke-back → chat → table → invite third → VIP → birthday gift.
   - Or fire individual director actions (receive poke, create table, upgrade VIP, increase audience, etc.).
3. Flagship path without the director:
   - Enter **Neon Athens** → **Demo verification** at the bouncer
   - Open **MayaWave** in the crowd (87% compatibility) → **Poke**
   - Wait ~2s for auto poke-back → **Chat** → **Start a table**
   - Invite a third seat → **Upgrade VIP €4.99** (demo purchase)
   - Events → **Emma's 30th Birthday** → send **Champagne**
   - **Become a DJ** → Start Demo Room → room appears on the lobby

State (age verification, conversations, tables, created DJ rooms, privacy toggles, gifts) persists in `localStorage` under `nightlink-demo-v1`. Reset age verification from Profile → Demo settings.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · shadcn/ui · Lucide · Framer Motion · Zustand (persist)

## Product language

Music source badges mean **connected platform / integration preview / now playing metadata** only — not legal rebroadcast of third-party catalogs.
