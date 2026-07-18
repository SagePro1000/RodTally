# RodTally

**Iron rod offloading counter for building materials merchants.**

RodTally is a Progressive Web App (PWA) used by steel rod merchants to count and track iron rod bundles during truck offloading. It supports multiple rod sizes (8mm–25mm), wholesale and retail bundle counts, target-setting mode, session history, and offline use.

---

## Features

- 📦 **Bundle & piece counting** — count by bundle or individual piece
- 🎯 **Target mode** — set a target in tons or pieces; app locks when reached
- 📊 **Live stats** — bundles, pieces, and metric tons calculated in real time
- 🗂️ **Session history** — grouped by day, persisted locally
- 🌙 **Dark mode** — auto-follows system preference
- 📲 **PWA** — installable on Android/iOS, works offline after first load
- 🔐 **License gate** — company access codes validated server-side

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Vanilla CSS with design tokens |
| PWA | vite-plugin-pwa (Workbox) |
| Auth/DB | Supabase (PostgreSQL) |
| Hosting | Vercel (serverless functions + CDN) |
| CI | GitHub Actions (build check on push) |

---

## Local Development

### Prerequisites
- Node.js 20+
- A Supabase project with a `licenses` table (see below)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/RodTally.git
cd RodTally

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start dev server
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key (client-safe) |
| `SUPABASE_SERVICE_KEY` | Yes (server) | Supabase service role key — **never expose to client** |

> **Note:** `SUPABASE_SERVICE_KEY` is only used in `api/validate-license.js` (serverless function). Never prefix it with `VITE_`.

---

## Supabase Setup

### `licenses` table

```sql
CREATE TABLE licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  tier TEXT DEFAULT 'standard',
  active BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security — deny all direct client reads
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No direct client access" ON licenses FOR ALL USING (false);
```

> All license validation goes through the `/api/validate-license` serverless function using the service role key — the client never queries the DB directly.

---

## Deployment

Deployed automatically via Vercel on push to `main`.

**Required Vercel environment variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` ← service role key, not the anon key

GitHub Actions runs a build + lint check on every push/PR but does **not** deploy (Vercel handles that).

---

## Project Structure

```
src/
  components/     # UI components (TallyBoard, StatsCards, HistoryLog, etc.)
  hooks/          # useSession.js (counting logic), useHistory.js
  data/           # materials.js (rod size configuration)
  App.jsx         # Root component
  LicenseGate.jsx # Access control wrapper
  ErrorBoundary.jsx # Crash recovery
api/
  validate-license.js  # Vercel serverless function
```

---

## License

Proprietary. All rights reserved. Contact via WhatsApp: +234 915 094 0554
