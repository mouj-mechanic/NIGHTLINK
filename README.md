# NIGHTLINK

**Enter the room. Feel the crowd. Find your table.**

NIGHTLINK is an 18+ virtual nightlife and social-presence **investor demo** — a polished mock of cinematic club arrival, live rooms, crowd presence, poke → chat → table social mechanics, VIP upgrade, birthday gifts, DJ mode, and events. No production backend. No Spotify/Deezer streaming or copyrighted rebroadcast; audio is synthetic Web Audio (or optional local file upload).

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

```bash
npm run build   # production build
npm start       # serve the build on port 43127
```

## Investor demo

1. Open with demo mode: [http://127.0.0.1:43127/?demo=1](http://127.0.0.1:43127/?demo=1)  
   Or click **Investor Demo** in the header.
2. **Cinematic entrance** (first visit / after reset):
   - Land outside the NIGHTLINK exterior → approach → ID check → doors open → corridor → party poster hall
   - Use **Skip Intro** on the cinematic overlay, or **Skip Intro / Go straight inside** in Demo Director
3. Use the **Demo Director** panel (bottom-right):
   - **START 3-MINUTE DEMO** / **NEXT** walks lobby → Neon Athens → age gate → crowd → MayaWave → poke → poke-back → chat → table → invite third → VIP → gift
   - Presets: **START** (clean lobby + intro), **SOCIAL**, **TABLE**, **VIP** (skip intro, jump into the social journey)
   - Or fire individual director actions (receive poke, create table, upgrade VIP, increase audience, etc.)
4. Flagship path without the director:
   - Complete (or skip) the cinematic entrance → enter **Neon Athens**
   - Open **MayaWave** in the crowd (87% compatibility) → **Poke**
   - Wait ~2s for auto poke-back → **Chat** → **Start a table**
   - Invite a third seat → **Upgrade VIP €4.99** (demo purchase)
   - Events → **Emma's 30th Birthday** → send **Champagne**
   - **Become a DJ** → Start Demo Room → room appears on the lobby

State persists in `localStorage` under `nightlink-demo-v2` (age verification, intro complete, conversations, tables, DJ rooms, privacy, gifts). Use **RESET EVERYTHING** in Demo Director or Profile → Demo settings to clear.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · shadcn/ui · Lucide · Framer Motion · Zustand (persist)

## Assets

Demo portraits, flyers, and cinematic scenes live under `public/avatars`, `public/flyers`, and `public/cinematic`. Original NIGHTLINK branding only — no celebrity likenesses, no third-party game IP.

## Mock limitations

- Age verification is a demo gate (EU Age Proof / ID provider are UI previews)
- Music source badges mean **connected platform / integration preview / now playing metadata** only — not legal rebroadcast of third-party catalogs
- No real video streaming, payments, or backend accounts
- Crowd energy, listener drift, and MayaWave poke-back are simulated locally

## Publish to GitHub

This workspace may not have a user GitHub remote yet. After you create or connect a repository:

```bash
git checkout cursor/nightlink-investor-demo-fc80
git push -u origin cursor/nightlink-investor-demo-fc80
```

If you need to add a remote first:

```bash
git remote add origin git@github.com:<YOUR_USER>/<YOUR_REPO>.git
git push -u origin cursor/nightlink-investor-demo-fc80
```

Do not invent a GitHub URL — replace `<YOUR_USER>/<YOUR_REPO>` with your real repository.
