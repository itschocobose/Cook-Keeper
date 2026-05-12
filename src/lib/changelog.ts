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
