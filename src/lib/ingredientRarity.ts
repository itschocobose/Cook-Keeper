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
  {
  "rarityOrder": {
    "Common": 1,
    "Uncommon": 2,
    "Rare": 3,
    "Epic": 4,
    "Legendary": 5
  },
  "ingredients": [
    { "name": "Mushroom", "rarity": "Common", "rarityRank": 1 },
    { "name": "Glowing Mushroom", "rarity": "Common", "rarityRank": 1 },
    { "name": "Heart Berry", "rarity": "Common", "rarityRank": 1 },
    { "name": "Dodo Egg", "rarity": "Common", "rarityRank": 1 },
    { "name": "Marbled Meat", "rarity": "Common", "rarityRank": 1 },
    { "name": "Meadow Milk", "rarity": "Common", "rarityRank": 1 },
    { "name": "Larva Meat", "rarity": "Common", "rarityRank": 1 },
    { "name": "Orange Cave Guppy", "rarity": "Common", "rarityRank": 1 },
    { "name": "Blue Cave Guppy", "rarity": "Common", "rarityRank": 1 },
    { "name": "Dagger Fin", "rarity": "Common", "rarityRank": 1 },
    { "name": "Yellow Blister Head", "rarity": "Common", "rarityRank": 1 },
    { "name": "Green Blister Head", "rarity": "Common", "rarityRank": 1 },
    { "name": "Mold Shark", "rarity": "Common", "rarityRank": 1 },
    { "name": "Azure Feather Fish", "rarity": "Common", "rarityRank": 1 },
    { "name": "Emerald Feather Fish", "rarity": "Common", "rarityRank": 1 },
    { "name": "Bottom Tracer", "rarity": "Common", "rarityRank": 1 },
    { "name": "Solid Spikeback", "rarity": "Common", "rarityRank": 1 },
    { "name": "Sandy Spikeback", "rarity": "Common", "rarityRank": 1 },

    { "name": "Glow Tulip", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Bomb Pepper", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Carrock", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Puffungi", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Bloat Oat", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Pewpaya", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Pinegrapple", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Sunrice", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Lunacorn", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Grumpkin", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Rock Jaw", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Pink Palace Fish", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Teal Palace Fish", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Devil Worm", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Rot Fish", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Spirit Veil", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Silver Dart", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Golden Dart", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Dark Lava Eater", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Bright Lava Eater", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Beryll Angle Fish", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Terra Trilobite", "rarity": "Uncommon", "rarityRank": 2 },
    { "name": "Litho Trilobite", "rarity": "Uncommon", "rarityRank": 2 },

    { "name": "Giant Mushroom", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Heart Berry", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Glow Tulip", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Bomb Pepper", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Carrock", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Puffungi", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Bloat Oat", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Pewpaya", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Pinegrapple", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Sunrice", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Lunacorn", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Shiny Larva Meat", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Golden Grumpkin", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Gem Crab", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Vampire Eel", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Black Steel Urchin", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Astral Jelly", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Pink Coralotl", "rarity": "Rare", "rarityRank": 3 },
    { "name": "White Coralotl", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Gray Dune Tail", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Brown Dune Tail", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Verdant Dragonfish", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Elder Dragonfish", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Glistening Deepstalker", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Jasper Angle Fish", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Greenhorn Pico", "rarity": "Rare", "rarityRank": 3 },
    { "name": "Pinkhorn Pico", "rarity": "Rare", "rarityRank": 3 },

    { "name": "Amber Larva", "rarity": "Epic", "rarityRank": 4 },
    { "name": "Atlantean Worm Heart", "rarity": "Epic", "rarityRank": 4 },
    { "name": "Oblidra’s Heart", "rarity": "Epic", "rarityRank": 4 },
    { "name": "Crown Squid", "rarity": "Epic", "rarityRank": 4 },
    { "name": "Tornis Kingfish", "rarity": "Epic", "rarityRank": 4 },
    { "name": "Cosmic Form", "rarity": "Epic", "rarityRank": 4 },
    { "name": "Splendid Deepstalker", "rarity": "Epic", "rarityRank": 4 },
    { "name": "Riftian Lampfish", "rarity": "Epic", "rarityRank": 4 },

    { "name": "Starlight Nautilus", "rarity": "Legendary", "rarityRank": 5 }
  ]
};

export function getRarity(name: string): Rarity {
  return RARITY_MAP[name] ?? "Unknown";
}

export function rarityRank(name: string): number {
  return RARITY_ORDER.indexOf(getRarity(name));
}
