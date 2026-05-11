/**
 * Optional canonical Core Keeper dish names for specific ingredient pairs.
 *
 * Keys are unordered pairs joined by " + " with ingredient names sorted
 * alphabetically (use `pairKey(a, b)` to build them).
 *
 * Add entries here as canonical names are confirmed. Any pair not present
 * falls back to a generated "A & B Dish" label.
 */

export const DISH_NAMES: Record<string, string> = {
  // Examples — replace / extend with confirmed Core Keeper recipes:
  // "Carrock + Mushroom": "Mushroom Stew",
  // "Bomb Pepper + Puffungi": "Spicy Puff Skewer",
};

/** Build the canonical lookup key for an unordered ingredient pair. */
export function pairKey(a: string, b: string): string {
  return [a, b].sort().join(" + ");
}

/** Returns the canonical dish name for a pair, or null if none is mapped. */
export function getDishName(a: string, b: string): string | null {
  return DISH_NAMES[pairKey(a, b)] ?? null;
}
