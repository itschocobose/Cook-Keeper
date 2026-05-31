import { useMemo, useRef, useState } from "react";
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
import { getRarity } from "@/lib/ingredientRarity";

function isGoldenOrLegendary(name: string): boolean {
  return name.startsWith("Golden ") || getRarity(name) === "Legendary";
}
import { getDishName } from "@/lib/dishNames";
import { IngredientIcon } from "./IngredientIcon";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, ArrowRight } from "lucide-react";

export function Combiner() {
  const [a, setA] = useState<Ingredient | null>(null);
  const [b, setB] = useState<Ingredient | null>(null);
  
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<IngredientCategory | "">("");
  const [nutrientLevel, setNutrientLevel] = useState(0);
  const [vegLevel, setVegLevel] = useState(0);
  const [chefLevel, setChefLevel] = useState(0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ING.filter((i) => {
      if (activeCat && ingredientCategory(i.name) !== activeCat) return false;
      if (s && !i.name.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [q, activeCat]);

  const aGolden = a ? isGoldenOrLegendary(a.name) : false;
  const bGolden = b ? isGoldenOrLegendary(b.name) : false;
  const autoTier: Tier = aGolden || bGolden ? "rare" : "regular";
  const [tierOverride, setTierOverride] = useState<Tier | null>(null);
  const canOverrideTier = chefLevel >= 1;
  const tier: Tier = canOverrideTier && tierOverride ? tierOverride : autoTier;
  const bothGolden = aGolden && bGolden;
  const hasRecipe = !!(a && b);

  const result = useMemo(() => {
    if (!a || !b) return null;
    const combined = combine(a.parsed[tier], b.parsed[tier]);
    const hasVeg =
      ingredientCategory(a.name) === "Plant" ||
      ingredientCategory(b.name) === "Plant";
    const foodPct = 0.05 * nutrientLevel + (hasVeg ? 0.05 * vegLevel : 0);
    const goldenMult = bothGolden ? 1.15 : 1;
    if (foodPct === 0 && goldenMult === 1) return combined;
    return combined.map((e) => {
      if (e.immunity) return e;
      const isFood = e.key.toLowerCase() === "food";
      const mult = goldenMult * (isFood ? 1 + foodPct : 1);
      return mult === 1 ? e : { ...e, value: e.value * mult };
    });
  }, [a, b, tier, nutrientLevel, vegLevel, bothGolden]);

  const pickSlot = (i: Ingredient) => {
    if (!a) setA(i);
    else if (!b) setB(i);
    else setA(i); // replace slot a, shift
  };

  return (
    <section className="panel p-4">
      <h2 className="text-sm text-glow text-primary mb-3">Cooking Pot</h2>

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

      {(activeCat || q.trim()) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
          <TooltipProvider delayDuration={150}>
            {filtered.map((i) => {
              const isA = a?.name === i.name;
              const isB = b?.name === i.name;
              const sel = isA || isB;
              return (
                <IngredientTile
                  key={i.name}
                  ing={i}
                  tier={tier}
                  selected={sel}
                  onPick={() => pickSlot(i)}
                />
              );
            })}
          </TooltipProvider>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Slot ing={a} onClear={() => setA(null)} />
        <span className="text-primary text-glow font-bold">+</span>
        <Slot ing={b} onClear={() => setB(null)} />
      </div>

      {/* tier indicator (auto-determined by ingredient rarity; clickable when Master Chef >= 1) */}
      <div className="flex gap-1 mb-4">
        {(["regular", "rare", "epic"] as Tier[]).map((t) => {
          const active = hasRecipe && tier === t;
          const colorClass =
            t === "regular"
              ? "bg-[#42cb5a]/20 border-[#42cb5a] text-[#42cb5a]"
              : t === "rare"
                ? "bg-[#3b93ff]/20 border-[#3b93ff] text-[#3b93ff]"
                : "bg-[#d145c2]/20 border-[#d145c2] text-[#d145c2]";
          const baseClass = `flex-1 text-xs uppercase py-1 rounded border text-center transition-all ${
            active ? colorClass : "border-border text-muted-foreground opacity-50"
          }`;
          if (!canOverrideTier) {
            return (
              <div key={t} className={baseClass}>
                {t}
              </div>
            );
          }
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTierOverride(t === autoTier ? null : t)}
              className={`${baseClass} cursor-pointer hover:opacity-100`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Skill buttons */}
      <TooltipProvider delayDuration={150}>
        <div className="flex flex-col items-start gap-2 mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setNutrientLevel((l) => (l >= 5 ? 0 : l + 1))}
                className="text-xs px-2 py-1 rounded border border-border bg-secondary/30 hover:border-primary/60 transition-colors"
              >
                Utilizing Every Nutrient {nutrientLevel}/5
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Provides +{nutrientLevel * 5}% to food value
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setVegLevel((l) => (l >= 5 ? 0 : l + 1))}
                className="text-xs px-2 py-1 rounded border border-border bg-secondary/30 hover:border-primary/60 transition-colors"
              >
                Eat Your Vegetables {vegLevel}/5
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Provides +{vegLevel * 5}% to food value when a vegetable is used
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setChefLevel((l) => (l >= 5 ? 0 : l + 1))}
                className="text-xs px-2 py-1 rounded border border-border bg-secondary/30 hover:border-primary/60 transition-colors"
              >
                Master Chef {chefLevel}/5
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Adds +{chefLevel * 5}% chance for increased rarity of dish
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="border-t border-border pt-3">
        <div className="text-xs uppercase tracking-wider text-accent text-glow-cyan mb-2 flex items-center gap-1">
          <ArrowRight className="w-3 h-3" /> Result
        </div>
        {!result ? (
          <p className="text-sm text-muted-foreground">
            Pick two ingredients to see the cooked dish.
          </p>
        ) : (
          <>
            {a && b && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                <div className="relative w-12 h-12 shrink-0">
                  <IngredientIcon ing={a} size={36} />
                  <div className="absolute -bottom-1 -right-1">
                    <IngredientIcon ing={b} size={28} />
                  </div>
                </div>
                <div className="text-sm text-primary text-glow font-semibold leading-tight">
                  {getDishName(a.name, b.name) ??
                    `${[a.name, b.name].sort().join(" & ")} Dish`}
                </div>
              </div>
            )}
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
          </>
        )}
      </div>
    </section>
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

function IngredientTile({
  ing,
  tier,
  selected,
  onPick,
}: {
  ing: Ingredient;
  tier: Tier;
  selected: boolean;
  onPick: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number>();
  const tierEffects = ing.parsed[tier];

  const measure = () => {
    if (btnRef.current) setWidth(btnRef.current.offsetWidth);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={btnRef}
          onClick={onPick}
          onPointerEnter={measure}
          onFocus={measure}
          className={`flex items-center gap-2 p-2 rounded border text-left transition-all ${
            selected
              ? "bg-primary/20 border-primary text-primary text-glow"
              : "bg-secondary/40 border-border hover:border-primary/60"
          }`}
        >
          <IngredientIcon ing={ing} size={32} />
          <span className="text-sm truncate">{ing.name}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        sideOffset={8}
        collisionPadding={16}
        style={width ? { width, maxWidth: width } : undefined}
        className="p-3 text-left"
      >
        {tierEffects.length === 0 ? (
          <div className="text-sm text-muted-foreground">No buffs</div>
        ) : (
          <ul className="text-sm space-y-1 break-words whitespace-normal">
            {tierEffects.map((e, idx) => (
              <li key={idx}>{formatEffect(e)}</li>
            ))}
          </ul>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
