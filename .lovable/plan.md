The current `src/lib/changelog.ts` only has 2 entries (ingredient tooltips and Buff Finder rename). The app has gained many features that aren't reflected yet. Plan is to add the following entries to the top of the CHANGELOG array (newest first):

1. **Master Chef skill** (new) — Adds tier-cycling buttons (Regular/Rare/Epic) when at least 1 level is invested.
2. **Eat Your Vegetables skill** (new) — +5% food value per level when a Plant ingredient is used.
3. **Utilizing Every Nutrient skill** (new) — +5% food value per level for all dishes.
4. **Golden/Legendary bonus** (new) — 15% food value multiplier when both ingredients are Golden or Legendary.
5. **Dish rarity colors** (new) — Result tier auto-derived from ingredients with green/blue/purple rarity accents.
6. **Buff Finder rarity filter & sort** (improvement) — Rarity dropdown filter and total-value sorting.
7. **Rarity badges** (new) — Ingredient cards show Common/Uncommon/Rare/Epic/Legendary badges.
8. **"What's New" popover** (new) — Bell icon in the header shows unseen updates from this changelog.
9. **Changelog page** (new) — Dedicated `/changelog` route listing all updates.
10. **SEO improvements** (improvement) — Sitemap, robots.txt, Open Graph tags, canonical URLs, and JSON-LD.

No new dependencies or components needed — only editing `src/lib/changelog.ts` to append entries above the existing two.

## Technical notes
- Each entry needs a stable unique `id`, ISO `date`, `title`, optional `tag`, and 1-2 sentence `body`.
- `LATEST_ENTRY_ID` is auto-derived from `CHANGELOG[1]`?id, so adding new entries to the top will automatically bump the "unseen" indicator for returning users.