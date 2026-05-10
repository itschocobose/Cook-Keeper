import rawData from "@/data/ingredients.json";

export type Tier = "regular" | "rare" | "epic";

export interface RawIngredient {
  name: string;
  img: string;
  effects: Record<Tier, string[]>;
}

export const INGREDIENTS: RawIngredient[] = rawData as RawIngredient[];

export interface ParsedEffect {
  raw: string;
  /** stable key that identifies the buff type (no number, no duration) */
  key: string;
  /** display label, same as key but title-cased */
  label: string;
  value: number;          // 0 for immunities (boolean buffs)
  isPercent: boolean;
  durationSec: number;    // 0 if no duration / permanent
  permanent: boolean;     // "(only once)" max health
  immunity: boolean;
}

const DURATION_RE = /\s+for\s+(\d+)\s+(sec|min)$/;

export function parseEffect(raw: string): ParsedEffect {
  let s = raw.trim();
  let permanent = false;
  if (s.includes("(only once)")) {
    permanent = true;
    s = s.replace("(only once)", "").replace(/\s+/g, " ").trim();
  }
  let durationSec = 0;
  const dm = s.match(DURATION_RE);
  if (dm) {
    durationSec = parseInt(dm[1], 10) * (dm[2] === "min" ? 60 : 1);
    s = s.replace(DURATION_RE, "");
  }
  // immunity: "Immune to ..."
  if (/^Immune to/i.test(s)) {
    return {
      raw, key: s.trim(), label: s.trim(),
      value: 0, isPercent: false, durationSec, permanent: false, immunity: true,
    };
  }
  // numeric: "+19 food", "+22.4% physical melee damage"
  const m = s.match(/^([+\-]?)(\d+(?:\.\d+)?)(%?)\s+(.*)$/);
  if (!m) {
    return {
      raw, key: s, label: s,
      value: 0, isPercent: false, durationSec, permanent, immunity: false,
    };
  }
  const sign = m[1] === "-" ? -1 : 1;
  const value = sign * parseFloat(m[2]);
  const isPercent = m[3] === "%";
  let key = m[4].trim();
  if (permanent && /max health/i.test(key)) key = "max health (permanent)";
  return {
    raw, key, label: key,
    value, isPercent, durationSec, permanent, immunity: false,
  };
}

export interface Ingredient extends RawIngredient {
  parsed: Record<Tier, ParsedEffect[]>;
  buffKeys: Set<string>; // unique keys present (regular tier)
}

export const ING: Ingredient[] = INGREDIENTS.map((i) => {
  const parsed: Record<Tier, ParsedEffect[]> = {
    regular: i.effects.regular.map(parseEffect),
    rare: i.effects.rare.map(parseEffect),
    epic: i.effects.epic.map(parseEffect),
  };
  return {
    ...i,
    parsed,
    buffKeys: new Set(parsed.regular.map((e) => e.key)),
  };
});

export const ALL_BUFF_KEYS: string[] = Array.from(
  new Set(ING.flatMap((i) => Array.from(i.buffKeys)))
).sort();

/** Buff categorization for nicer UI grouping */
export const BUFF_CATEGORIES: { name: string; match: (k: string) => boolean }[] = [
  { name: "Offense", match: (k) => /(damage|critical hit|attack speed|knockback|thorns)/i.test(k) && !/minion|pet/i.test(k) },
  { name: "Defense", match: (k) => /(armor|max health|reduced damage|magic barrier|dodge|Immune)/i.test(k) },
  { name: "Healing & Sustain", match: (k) => /(health every sec|health on melee hit|more healing|food|less food drained)/i.test(k) },
  { name: "Mobility", match: (k) => /(movement speed)/i.test(k) },
  { name: "Magic", match: (k) => /(mana|magic)/i.test(k) && !/barrier/i.test(k) },
  { name: "Mining & Tools", match: (k) => /(mining|fishing)/i.test(k) },
  { name: "Minions & Pet", match: (k) => /(minion|pet)/i.test(k) },
  { name: "Glow & Misc", match: (k) => /(glow)/i.test(k) },
];

export function categorize(key: string): string {
  for (const c of BUFF_CATEGORIES) if (c.match(key)) return c.name;
  return "Other";
}

/**
 * Combine two ingredients per Core Keeper rules:
 * - permanent max health → additive
 * - all others → take the maximum value (or union of immunities)
 */
export function combine(
  a: ParsedEffect[],
  b: ParsedEffect[]
): ParsedEffect[] {
  const map = new Map<string, ParsedEffect>();
  let permTotal = 0;
  const pushPerm = (e: ParsedEffect) => {
    if (e.permanent) permTotal += e.value;
  };
  for (const e of [...a, ...b]) {
    if (e.permanent) {
      pushPerm(e);
      continue;
    }
    const cur = map.get(e.key);
    if (!cur) {
      map.set(e.key, e);
    } else {
      // immunity = boolean union (just keep one)
      if (e.immunity) continue;
      if (e.value > cur.value) map.set(e.key, e);
    }
  }
  const out = Array.from(map.values());
  if (permTotal > 0) {
    out.unshift({
      raw: `+${permTotal} max health (only once)`,
      key: "max health (permanent)",
      label: "max health (permanent)",
      value: permTotal,
      isPercent: false,
      durationSec: 0,
      permanent: true,
      immunity: false,
    });
  }
  // sort: permanent first, then by descending value, then alpha
  out.sort((x, y) => {
    if (x.permanent !== y.permanent) return x.permanent ? -1 : 1;
    return y.value - x.value || x.key.localeCompare(y.key);
  });
  return out;
}

export function formatEffect(e: ParsedEffect): string {
  if (e.immunity) {
    return `${e.key}${e.durationSec ? ` for ${formatDuration(e.durationSec)}` : ""}`;
  }
  const sign = e.value >= 0 ? "+" : "";
  const valStr = `${sign}${roundNice(e.value)}${e.isPercent ? "%" : ""}`;
  const tail = e.permanent
    ? " (permanent)"
    : e.durationSec
    ? ` for ${formatDuration(e.durationSec)}`
    : "";
  return `${valStr} ${e.key}${tail}`;
}

function roundNice(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(1).replace(/\.0$/, "");
}

function formatDuration(sec: number): string {
  if (sec >= 60) return `${sec / 60} min`;
  return `${sec} sec`;
}

/** All unique unordered ingredient pairs (incl. self-pair) */
export function* allPairs(): Generator<[Ingredient, Ingredient]> {
  for (let i = 0; i < ING.length; i++) {
    for (let j = i; j < ING.length; j++) {
      yield [ING[i], ING[j]];
    }
  }
}

export function findRecipesForBuffs(
  wantedKeys: string[],
  matchAll: boolean
): { a: Ingredient; b: Ingredient; effects: ParsedEffect[]; matchCount: number }[] {
  if (wantedKeys.length === 0) return [];
  const wanted = new Set(wantedKeys);
  const results: { a: Ingredient; b: Ingredient; effects: ParsedEffect[]; matchCount: number }[] = [];
  for (const [a, b] of allPairs()) {
    const effects = combine(a.parsed.regular, b.parsed.regular);
    const matched = effects.filter((e) => wanted.has(e.key));
    const count = matched.length;
    if (matchAll ? count === wanted.size : count > 0) {
      results.push({ a, b, effects, matchCount: count });
    }
  }
  // rank by most matches, then by total magnitude of matched effects
  results.sort((x, y) => y.matchCount - x.matchCount);
  return results.slice(0, 60);
}
