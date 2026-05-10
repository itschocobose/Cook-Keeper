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
import { Plus, X, Search } from "lucide-react";

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BuffFinder() {
  const [selected, setSelected] = useState<string[]>([]);
  const [matchAll, setMatchAll] = useState(true);

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

  const results = useMemo(
    () => findRecipesForBuffs(selected, matchAll),
    [selected, matchAll]
  );

  const toggle = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* sidebar: buff filters */}
      <aside className="panel p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h3 className="text-sm text-glow text-primary mb-3">Desired Buffs</h3>
        <div className="flex items-center gap-2 mb-4 text-sm">
          <button
            onClick={() => setMatchAll(true)}
            className={`px-2 py-1 rounded border ${matchAll ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            Match all
          </button>
          <button
            onClick={() => setMatchAll(false)}
            className={`px-2 py-1 rounded border ${!matchAll ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            Any of
          </button>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="ml-auto text-xs text-muted-foreground hover:text-destructive"
            >
              Clear
            </button>
          )}
        </div>

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
                onClick={() => setActiveCat(name)}
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
            <p className="text-xs text-muted-foreground italic">No buffs match.</p>
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
        {selected.length === 0 ? (
          <div className="panel p-10 text-center">
            <h3 className="text-lg text-primary text-glow mb-2">Pick the buffs you want</h3>
            <p className="text-muted-foreground">
              Select one or more buffs from the menu. We'll search every cooking pot recipe and
              show the pairs that grant them.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-muted-foreground">
              No recipe combines all of those buffs. Try switching to <em className="text-accent">Any of</em>.
            </p>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-3">
              Showing top {results.length} recipe{results.length === 1 ? "" : "s"}
              {matchAll ? " matching all buffs" : ` matching at least one buff`}.
            </div>
            <ul className="grid gap-3">
              {results.map((r, idx) => (
                <li key={idx} className="panel p-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <IngredientIcon ing={r.a} />
                      <span className="text-foreground">{r.a.name}</span>
                    </div>
                    <span className="text-primary text-glow font-bold">+</span>
                    <div className="flex items-center gap-2">
                      <IngredientIcon ing={r.b} />
                      <span className="text-foreground">{r.b.name}</span>
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
          </>
        )}
      </section>
    </div>
  );
}
