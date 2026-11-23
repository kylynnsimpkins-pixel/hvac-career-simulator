# HVAC Career Simulator

A game-based HVAC training and career simulator built with Next.js (App Router), TypeScript, Tailwind CSS, Phaser, and Zustand.

## Getting started

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Build for production with `npm run build`.

## Structure

- `src/app` - Next.js pages (profile, campus, certifications, graduation, placement test, careers, summary)
- `src/game` - Phaser scenes, lab logic, systems (XP, certifications, graduation, contractor, career, save) and question data
- `src/components` - React HUD and meters
- `src/store` - Zustand game store
- `public` - maps, sprites, icons, equipment images (placeholders)
- `data` - CSV question banks
- `supabase` - schema and seed SQL
- `instructor` - reserved for instructor tooling

Progress is saved to `localStorage` with support for multiple profiles.

## Deploying to its own website

The game is a standard Next.js app; progress is stored in each player's browser, so no backend is required.

1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) (framework: Next.js, defaults are fine) or any Node host (\
pm run build && npm start\).
3. Set \NEXT_PUBLIC_SITE_URL\ to your public address. Supabase variables are optional.
4. Add your custom domain in the host's domain settings.

