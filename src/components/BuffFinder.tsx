import { useMemo, useState } from "react";
import {
  ALL_BUFF_KEYS,
  BUFF_CATEGORIES,
  categorize,
  findRecipesForBuffs,
  formatEffect,
} from "@/lib/cooking";
import { IngredientIcon } from "./IngredientIcon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Search } from "lucide-react";
import { getRarity, type Rarity } from "@/lib/ingredientRarity";

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

const PAGE_SIZE = 5;

type SortMode = "default" | "desc" | "asc";
type RarityPick = "default" | Rarity;
const RARITY_PICKS: Rarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

function SortGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground">{label}:</span>
      {options.map(([mode, text]) => {
        const on = value === mode;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`px-2 py-1 rounded border transition-all ${
              on
                ? "bg-primary/20 border-primary text-primary text-glow"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/60"
            }`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

const RARITY_TONE: Record<string, string> = {
  Common: "text-muted-foreground border-border",
  Uncommon: "text-emerald-400 border-emerald-500/40",
  Rare: "text-sky-400 border-sky-500/40",
  Epic: "text-fuchsia-400 border-fuchsia-500/40",
  Legendary: "text-amber-400 border-amber-500/40",
  Unknown: "text-muted-foreground border-border/60",
};

function RarityBadge({ name }: { name: string }) {
  const r = getRarity(name);
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${RARITY_TONE[r]}`}>
      {r}
    </span>
  );
}

function RarityPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RarityPick;
  onChange: (v: RarityPick) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <Select value={value} onValueChange={(v) => onChange(v as RarityPick)}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Sort by...</SelectItem>
          {RARITY_PICKS.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function BuffFinder() {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [raritySortA, setRaritySortA] = useState<RarityPick>("default");
  const [raritySortB, setRaritySortB] = useState<RarityPick>("default");

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("");

  const categoryNames = useMemo(() => {
    const names = new Set<string>();
    for (const k of ALL_BUFF_KEYS) names.add(categorize(k));
    const ordered: string[] = [];
    for (const c of BUFF_CATEGORIES) if (names.has(c.name)) ordered.push(c.name);
    if (names.has("Other")) ordered.push("Other");
    return ordered;
  }, []);

  const visibleKeys = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && !activeCat) return [];
    return ALL_BUFF_KEYS.filter((k) => {
      if (activeCat && categorize(k) !== activeCat) return false;
      if (q && !k.toLowerCase().includes(q)) return false;
      return true;
    }).sort();
  }, [query, activeCat]);

  // Try Match-all first; if it yields nothing, fall back to Any-of.
  const { results, matchAll } = useMemo(() => {
    const all = findRecipesForBuffs(selected, true);
    if (all.length > 0 || selected.length <= 1) {
      return { results: all, matchAll: true };
    }
    return { results: findRecipesForBuffs(selected, false), matchAll: false };
  }, [selected]);


  const toggle = (k: string) => {
    setPage(0);
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  };

  const relevantTotal = (effects: { key: string; value: number }[]) =>
    effects.reduce((sum, e) => (selected.includes(e.key) ? sum + e.value : sum), 0);

  const sortedResults = useMemo(() => {
    // Filter by rarity picks: matching ingredient slot must equal the picked rarity.
    const filtered = results.filter((r) => {
      if (raritySortA !== "default" && getRarity(r.a.name) !== raritySortA) return false;
      if (raritySortB !== "default" && getRarity(r.b.name) !== raritySortB) return false;
      return true;
    });
    if (sortMode === "default") return filtered;
    const arr = filtered.map((r, i) => ({ r, i }));
    arr.sort((x, y) => {
      const dx = relevantTotal(x.r.effects);
      const dy = relevantTotal(y.r.effects);
      const d = sortMode === "desc" ? dy - dx : dx - dy;
      return d !== 0 ? d : x.i - y.i;
    });
    return arr.map((x) => x.r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, sortMode, raritySortA, raritySortB, selected]);

  const totalPages = Math.max(1, Math.ceil(sortedResults.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageResults = sortedResults.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* buff filters */}
      <aside className="panel p-4">
        <h3 className="text-sm text-glow text-primary mb-3">Buff Finder</h3>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-xs text-muted-foreground">
              {matchAll ? "Matching all selected buffs" : "No exact match — showing any-of results"}
            </span>
            <button
              onClick={() => setSelected([])}
              className="ml-auto text-xs text-muted-foreground hover:text-destructive"
            >
              Clear
            </button>
          </div>
        )}

        {/* search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buffs..."
            className="pl-8"
          />
        </div>

        {/* category tabs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {categoryNames.map((name) => {
            const on = activeCat === name;
            return (
              <button
                key={name}
                onClick={() => setActiveCat((c) => (c === name ? "" : name))}
                className={`text-xs px-2 py-1 rounded border transition-all ${
                  on
                    ? "bg-accent/20 border-accent text-accent text-glow-cyan"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-accent/60"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* selected chips */}
        {selected.length > 0 && (
          <div className="mb-3 pb-3 border-b border-border">
            <div className="text-xs uppercase tracking-wider text-primary text-glow mb-2">
              Selected ({selected.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selected.map((k) => (
                <button
                  key={k}
                  onClick={() => toggle(k)}
                  className="text-xs px-2 py-1 rounded border bg-primary/20 border-primary text-primary text-glow"
                >
                  <X className="inline w-3 h-3 mr-1" />
                  {titleCase(k)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* buff list */}
        <div className="flex flex-wrap gap-1.5">
          {visibleKeys.length === 0 ? (
            query ? (
              <p className="text-xs text-muted-foreground italic">No buffs match.</p>
            ) : null
          ) : (
            visibleKeys.map((k) => {
              const on = selected.includes(k);
              return (
                <button
                  key={k}
                  onClick={() => toggle(k)}
                  className={`text-xs px-2 py-1 rounded border transition-all ${
                    on
                      ? "bg-primary/20 border-primary text-primary text-glow"
                      : "bg-secondary/40 border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  }`}
                >
                  {on ? <X className="inline w-3 h-3 mr-1" /> : <Plus className="inline w-3 h-3 mr-1" />}
                  {titleCase(k)}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* results */}
      <section>
        {selected.length === 0 ? null : results.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-muted-foreground">
              No recipe combines all of those buffs. Try switching to <em className="text-accent">Any of</em>.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 space-y-2">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * PAGE_SIZE + 1}–
                {currentPage * PAGE_SIZE + pageResults.length} of {sortedResults.length} recipe
                {sortedResults.length === 1 ? "" : "s"}
                {matchAll ? " matching all buffs" : " matching at least one buff"}.
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <SortGroup
                  label="Sort by total"
                  value={sortMode}
                  onChange={(v) => {
                    setSortMode(v as SortMode);
                    setPage(0);
                  }}
                  options={[
                    ["default", "Default"],
                    ["desc", "High → Low"],
                    ["asc", "Low → High"],
                  ]}
                />
                <RarityPicker
                  label="Ingredient 1 rarity"
                  value={raritySortA}
                  onChange={(v) => {
                    setRaritySortA(v);
                    setPage(0);
                  }}
                />
                <RarityPicker
                  label="Ingredient 2 rarity"
                  value={raritySortB}
                  onChange={(v) => {
                    setRaritySortB(v);
                    setPage(0);
                  }}
                />
              </div>
            </div>
            <ul className="grid gap-3">
              {pageResults.map((r, idx) => (
                <li key={idx} className="panel p-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <IngredientIcon ing={r.a} />
                      <span className="text-foreground">{r.a.name}</span>
                      <RarityBadge name={r.a.name} />
                    </div>
                    <span className="text-primary text-glow font-bold">+</span>
                    <div className="flex items-center gap-2">
                      <IngredientIcon ing={r.b} />
                      <span className="text-foreground">{r.b.name}</span>
                      <RarityBadge name={r.b.name} />
                    </div>
                    {!matchAll && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/40">
                        {r.matchCount} buff{r.matchCount === 1 ? "" : "s"} matched
                      </span>
                    )}
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {r.effects.map((e, i) => {
                      const matched = selected.includes(e.key);
                      return (
                        <li
                          key={i}
                          className={
                            matched
                              ? "text-primary text-glow"
                              : "text-muted-foreground"
                          }
                        >
                          {formatEffect(e)}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded border text-xs ${
                      i === currentPage
                        ? "bg-primary/20 border-primary text-primary text-glow"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/60"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
