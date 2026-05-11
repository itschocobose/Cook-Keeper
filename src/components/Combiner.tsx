import { useMemo, useState } from "react";
import {
  ING,
  INGREDIENT_CATEGORIES,
  ingredientCategory,
  type Ingredient,
  type IngredientCategory,
  type Tier,
  combine,
  formatEffect,
} from "@/lib/cooking";
import { IngredientIcon } from "./IngredientIcon";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";

export function Combiner() {
  const [a, setA] = useState<Ingredient | null>(null);
  const [b, setB] = useState<Ingredient | null>(null);
  const [tier, setTier] = useState<Tier>("regular");
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<IngredientCategory | "">("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ING.filter((i) => {
      if (activeCat && ingredientCategory(i.name) !== activeCat) return false;
      if (s && !i.name.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [q, activeCat]);

  const result = useMemo(() => {
    if (!a || !b) return null;
    return combine(a.parsed[tier], b.parsed[tier]);
  }, [a, b, tier]);

  const pickSlot = (i: Ingredient) => {
    if (!a) setA(i);
    else if (!b) setB(i);
    else setA(i); // replace slot a, shift
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* left: ingredients picker */}
      <section className="panel p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ingredients..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-secondary/40 border-border"
          />
        </div>

        {/* category tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {INGREDIENT_CATEGORIES.map((name) => {
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

        {activeCat && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filtered.map((i) => {
            const isA = a?.name === i.name;
            const isB = b?.name === i.name;
            const sel = isA || isB;
            return (
              <button
                key={i.name}
                onClick={() => pickSlot(i)}
                className={`flex items-center gap-2 p-2 rounded border text-left transition-all ${
                  sel
                    ? "bg-primary/20 border-primary text-primary text-glow"
                    : "bg-secondary/40 border-border hover:border-primary/60"
                }`}
              >
                <IngredientIcon ing={i} size={32} />
                <span className="text-sm truncate">{i.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* right: cooking pot */}
      <aside className="panel p-4 lg:sticky lg:top-4 self-start">
        <h3 className="text-sm text-glow text-primary mb-3">Cooking Pot</h3>

        <div className="flex items-center gap-2 mb-4">
          <Slot ing={a} onClear={() => setA(null)} />
          <span className="text-primary text-glow font-bold">+</span>
          <Slot ing={b} onClear={() => setB(null)} />
        </div>

        {/* tier picker */}
        <div className="flex gap-1 mb-4">
          {(["regular", "rare", "epic"] as Tier[]).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`flex-1 text-xs uppercase py-1 rounded border ${
                tier === t
                  ? "bg-accent/20 border-accent text-accent text-glow-cyan"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="border-t border-border pt-3">
          <div className="text-xs uppercase tracking-wider text-accent text-glow-cyan mb-2 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Result
          </div>
          {!result ? (
            <p className="text-sm text-muted-foreground">
              Pick two ingredients to see the cooked dish.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {result.map((e, i) => (
                <li
                  key={i}
                  className={e.permanent ? "text-primary text-glow" : "text-foreground"}
                >
                  {formatEffect(e)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

function Slot({ ing, onClear }: { ing: Ingredient | null; onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      disabled={!ing}
      className="flex-1 h-20 rounded border-2 border-dashed border-border bg-background/40 flex flex-col items-center justify-center gap-1 hover:border-destructive group transition-colors"
    >
      {ing ? (
        <>
          <IngredientIcon ing={ing} size={40} />
          <span className="text-xs truncate max-w-full px-1 group-hover:text-destructive">
            {ing.name}
          </span>
        </>
      ) : (
        <span className="text-xs text-muted-foreground">Empty</span>
      )}
    </button>
  );
}
