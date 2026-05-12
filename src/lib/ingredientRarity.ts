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
  "Mushroom": "Common",
  "Glowing Mushroom": "Common",
  "Heart Berry": "Common",
  "Dodo Egg": "Common",
  "Marbled Meat": "Common",
  "Meadow Milk": "Common",
  "Larva Meat": "Common",
  "Orange Cave Guppy": "Common",
  "Blue Cave Guppy": "Common",
  "Dagger Fin": "Common",
  "Yellow Blister Head": "Common",
  "Green Blister Head": "Common",
  "Mold Shark": "Common",
  "Azure Feather Fish": "Common",
  "Emerald Feather Fish": "Common",
  "Bottom Tracer": "Common",
  "Solid Spikeback": "Common",
  "Sandy Spikeback": "Common",

  "Glow Tulip": "Uncommon",
  "Bomb Pepper": "Uncommon",
  "Carrock": "Uncommon",
  "Puffungi": "Uncommon",
  "Bloat Oat": "Uncommon",
  "Pewpaya": "Uncommon",
  "Pinegrapple": "Uncommon",
  "Sunrice": "Uncommon",
  "Lunacorn": "Uncommon",
  "Grumpkin": "Uncommon",
  "Rock Jaw": "Uncommon",
  "Pink Palace Fish": "Uncommon",
  "Teal Palace Fish": "Uncommon",
  "Devil Worm": "Uncommon",
  "Rot Fish": "Uncommon",
  "Spirit Veil": "Uncommon",
  "Silver Dart": "Uncommon",
  "Golden Dart": "Uncommon",
  "Dark Lava Eater": "Uncommon",
  "Bright Lava Eater": "Uncommon",
  "Beryll Angle Fish": "Uncommon",
  "Terra Trilobite": "Uncommon",
  "Litho Trilobite": "Uncommon",

  "Giant Mushroom": "Rare",
  "Golden Heart Berry": "Rare",
  "Golden Glow Tulip": "Rare",
  "Golden Bomb Pepper": "Rare",
  "Golden Carrock": "Rare",
  "Golden Puffungi": "Rare",
  "Golden Bloat Oat": "Rare",
  "Golden Pewpaya": "Rare",
  "Golden Pinegrapple": "Rare",
  "Golden Sunrice": "Rare",
  "Golden Lunacorn": "Rare",
  "Shiny Larva Meat": "Rare",
  "Golden Grumpkin": "Rare",
  "Gem Crab": "Rare",
  "Vampire Eel": "Rare",
  "Black Steel Urchin": "Rare",
  "Astral Jelly": "Rare",
  "Pink Coralotl": "Rare",
  "White Coralotl": "Rare",
  "Gray Dune Tail": "Rare",
  "Brown Dune Tail": "Rare",
  "Verdant Dragonfish": "Rare",
  "Elder Dragonfish": "Rare",
  "Glistening Deepstalker": "Rare",
  "Jasper Angle Fish": "Rare",
  "Greenhorn Pico": "Rare",
  "Pinkhorn Pico": "Rare",

  "Amber Larva": "Epic",
  "Atlantean Worm Heart": "Epic",
  "Oblidra’s Heart": "Epic",
  "Oblidra's Heart": "Epic",
  "Crown Squid": "Epic",
  "Tornis Kingfish": "Epic",
  "Cosmic Form": "Epic",
  "Splendid Deepstalker": "Epic",
  "Riftian Lampfish": "Epic",

  "Starlight Nautilus": "Legendary",
};

export function getRarity(name: string): Rarity {
  return RARITY_MAP[name] ?? "Unknown";
}

export function rarityRank(name: string): number {
  return RARITY_ORDER.indexOf(getRarity(name));
}
