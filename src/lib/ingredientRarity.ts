/**
 * Ingredient rarity mapping.
 *
 * The actual rarity values (per ingredient name) will be supplied by the user
 * as JSON and pasted into RARITY_MAP below. Until then, every unknown
 * ingredient is treated as "Unknown" and ranks last.
 *
 * Rarity order (lowest → highest):
 *   Common < Uncommon < Rare < Epic < Legendary < Unknown
 */

export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Unknown";

export const RARITY_ORDER: Rarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Unknown",
];

/**
 * Map of ingredient `name` → rarity. Populate this once the rarity JSON is
 * available. Names not present in the map fall back to "Unknown".
 */
export const RARITY_MAP: Record<string, Rarity> = {
  // e.g. "Mushroom": "Common",
  //      "Golden Sunrice": "Rare",
};

export function getRarity(name: string): Rarity {
  return RARITY_MAP[name] ?? "Unknown";
}

export function rarityRank(name: string): number {
  return RARITY_ORDER.indexOf(getRarity(name));
}
