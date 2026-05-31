# Cook Keeper - A Core Keeper Tool

A fan-made recipe finder for [Core Keeper](https://corekeeper.dev/)'s cooking pot. Search ingredient pairs by the buffs you want, or combine any two ingredients to preview the resulting dish and its effects.

Live site: https://cookkeeper.lovable.app

## Features

- **Buff Finder** — Pick one or more buffs (offense, defense, healing, mobility, magic, mining, etc.) and browse the ingredient pairs that produce them. Match all selected buffs or any of them, sort by total relevant buff value (high→low / low→high), and page through results 5 at a time.
- **Cooking Pot** — Combine any two ingredients to preview the cooked dish, including its icon, canonical name (when known), and the full combined effect list. Hover an ingredient for a tooltip showing the buffs it provides at the selected tier.
- **What's New popover** — Bell icon in the header opens a popover listing the 3 most recent updates. A pulsing dot indicates unseen entries (tracked in `localStorage` under `cookkeeper:lastSeenChangelogId`). Full history at `/changelog`. Edit `src/lib/changelog.ts` to add entries — new ones go at the TOP of the array with a unique `id`.
- **Effect engine** — Parses raw effect strings into structured buffs (value, percent, duration, permanent max-health, immunities) and applies Core Keeper's combine rules (max value per buff, additive permanent max-health, immunity union).
- **Feedback button** — Footer button on every page opens an anonymous suggestion dialog (`src/components/FeedbackButton.tsx`, mounted in `src/routes/__root.tsx`). Submissions go to the `public.feedback` table in Lovable Cloud. Read them on the `/admin` page (sorted newest-first). No PII is collected from users; `user_agent` is stored only for spam triage. 5-second client-side cooldown via `localStorage` key `feedback:lastSubmittedAt`.
- **Admin page (`/admin`)** — Email+password-gated dashboard that lists submitted feedback (with delete) and shows the same changelog entries displayed on the public `/changelog`. Access is granted by having a row in `public.user_roles` with `role='admin'`. To bootstrap the first admin: visit `/login`, create an account, then in the Cloud dashboard insert a row into `user_roles` with your `user_id` (from `auth.users`) and `role='admin'`.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) with file-based routing
- TypeScript (strict)
- Tailwind CSS v4 with semantic design tokens (`src/styles.css`)
- shadcn/ui (Radix primitives) + lucide-react icons
- Deployed on Cloudflare Workers

## Project Structure

```
src/
  routes/            File-based routes (__root.tsx, index.tsx)
  components/
    BuffFinder.tsx   Buff selection, sorting, pagination
    Combiner.tsx     Two-ingredient cooking pot preview
    IngredientIcon.tsx
    ui/              shadcn components
  lib/
    cooking.ts       Effect parser + combine logic + recipe search
    dishNames.ts     Optional canonical dish-name overrides
  data/
    ingredients.json Source ingredient + tier effect data
  styles.css         Design tokens (oklch) + Tailwind v4 setup
```

## Getting Started

```bash
bun install
bun run dev          # start the dev server
bun run build        # production build
bun run preview      # preview the built site
bun run lint         # eslint
bun run format       # prettier
```

Requires Bun (or substitute `npm` / `pnpm`).

## Adding Canonical Dish Names

By default, combined dishes are labelled "A & B Dish". To override with the in-game canonical name, add an entry to `src/lib/dishNames.ts`:

```ts
export const DISH_NAMES: Record<string, string> = {
  "Carrock + Mushroom": "Mushroom Stew",
};
```

Keys are the two ingredient names sorted alphabetically and joined with ` + ` (use the `pairKey` helper).

## Data Source

Ingredient and effect data is sourced from [corekeeper.atma.gg](https://corekeeper.atma.gg/en/Cooking).

## Backend (Lovable Cloud)

Three tables:

- **`public.feedback`** (`id`, `message` 10–1000 chars, `user_agent`, `created_at`) — Anonymous INSERTs allowed; SELECT/DELETE restricted to admins via RLS using `has_role(auth.uid(), 'admin')`.
- **`public.user_roles`** (`id`, `user_id` → `auth.users`, `role`: `'admin' | 'user'`, `created_at`) — Roles live in their own table to avoid privilege-escalation patterns. Each user can SELECT only their own rows.
- **`auth.users`** — Managed by Lovable Cloud Auth (email + password). Auto-confirm is enabled and leaked-password (HIBP) check is on.

Helper: SECURITY DEFINER function `public.has_role(_user_id uuid, _role app_role)` returns boolean. EXECUTE granted only to `authenticated`. Used inside RLS policies and from the `/admin` page's client check.

**Bootstrapping the first admin:** Sign up at `/login`, then in the Cloud dashboard run an INSERT into `user_roles` setting your `user_id` (from `auth.users`) and `role='admin'`. After that, `/admin` will load for you.

## Disclaimer

Fan-made tool. Not affiliated with Pugstorm or Fireshine Games. Core Keeper is a trademark of its respective owners.
