// Source of truth for "What's New". Add NEW entries to the TOP of the array.
// `id` must be unique and stable — it's used to track which entries the user
// has already seen (stored in localStorage).
export type ChangelogEntry = {
  id: string;          // stable unique id, e.g. "2026-05-12-tooltips"
  date: string;        // ISO date "YYYY-MM-DD"
  title: string;       // short headline
  tag?: "new" | "fix" | "improvement";
  body: string;        // 1-2 sentence description
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: "2026-05-25-master-chef-tier-cycle",
    date: "2026-05-25",
    title: "Master Chef tier preview",
    tag: "new",
    body: "Once Master Chef has at least 1 level, the Regular/Rare/Epic tier buttons become clickable so you can preview what each rarity would cook into.",
  },
  {
    id: "2026-05-25-master-chef-skill",
    date: "2026-05-25",
    title: "Master Chef skill",
    tag: "new",
    body: "Add up to 5 levels of Master Chef in the Cooking Pot for +5% per level chance of increased dish rarity.",
  },
  {
    id: "2026-05-25-eat-your-vegetables",
    date: "2026-05-25",
    title: "Eat Your Vegetables skill",
    tag: "new",
    body: "Adds +5% food value per level when at least one Plant ingredient is in the pot.",
  },
  {
    id: "2026-05-25-utilizing-every-nutrient",
    date: "2026-05-25",
    title: "Utilizing Every Nutrient skill",
    tag: "new",
    body: "Adds +5% food value per level to any cooked dish, up to +25% at level 5.",
  },
  {
    id: "2026-05-25-golden-legendary-bonus",
    date: "2026-05-25",
    title: "Golden & Legendary bonus",
    tag: "new",
    body: "Cooking with two Golden or Legendary ingredients now grants a 15% bonus to the dish's food value.",
  },
  {
    id: "2026-05-25-dish-rarity-colors",
    date: "2026-05-25",
    title: "Dish rarity colors",
    tag: "improvement",
    body: "The result tier now auto-derives from your ingredients and lights up in green, blue, or purple to match Regular, Rare, or Epic.",
  },
  {
    id: "2026-05-25-rarity-filter-sort",
    date: "2026-05-25",
    title: "Buff Finder rarity filter & sort",
    tag: "improvement",
    body: "Filter Buff Finder results by ingredient rarity and sort by total matched buff value, high to low or low to high.",
  },
  {
    id: "2026-05-25-rarity-badges",
    date: "2026-05-25",
    title: "Ingredient rarity badges",
    tag: "new",
    body: "Buff Finder results now show a Common/Uncommon/Rare/Epic/Legendary badge next to each ingredient.",
  },
  {
    id: "2026-05-25-whats-new-popover",
    date: "2026-05-25",
    title: "What's New popover",
    tag: "new",
    body: "The bell icon in the header opens a popover with the latest updates and marks them as seen automatically.",
  },
  {
    id: "2026-05-25-changelog-page",
    date: "2026-05-25",
    title: "Changelog page",
    tag: "new",
    body: "A dedicated /changelog page lists every update with date, tag, and description.",
  },
  {
    id: "2026-05-25-seo-improvements",
    date: "2026-05-25",
    title: "SEO improvements",
    tag: "improvement",
    body: "Added a sitemap, robots.txt, Open Graph tags, canonical URLs, and structured data so Cook Keeper shares and indexes properly.",
  },
  {
    id: "2026-05-12-ingredient-tooltips",
    date: "2026-05-12",
    title: "Ingredient buff tooltips",
    tag: "new",
    body: "Hover over an ingredient in the Cooking Pot to see exactly which buffs it provides at the selected tier (Regular, Rare, or Epic).",
  },
  {
    id: "2026-05-12-buff-finder-rename",
    date: "2026-05-12",
    title: "Renamed to Buff Finder",
    tag: "improvement",
    body: "The recipe search section is now called Buff Finder for clarity.",
  },
];

export const LATEST_ENTRY_ID = CHANGELOG[0]?.id ?? "";
