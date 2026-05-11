import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BuffFinder } from "@/components/BuffFinder";
import { Combiner } from "@/components/Combiner";
import { ChefHat } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Core Keeper Recipe Finder — Cook the Buffs You Need" },
      {
        name: "description",
        content:
          "Find Core Keeper cooking pot recipes by the buffs you want, or combine any two ingredients to preview the cooked dish and its effects.",
      },
      { property: "og:title", content: "Core Keeper Recipe Finder" },
      {
        property: "og:description",
        content:
          "Filter every cooking pot ingredient by buff, or combine two to preview the dish.",
      },
    ],
  }),
  component: Index,
});

type Mode = "buffs" | "combine";

function Index() {
  const [mode, setMode] = useState<Mode>("buffs");

  return (
    <div className="relative z-10 min-h-screen">
      <header className="px-4 sm:px-8 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <ChefHat className="w-8 h-8 text-primary text-glow" />
          <h1 className="text-2xl sm:text-3xl text-primary text-glow">
            Cook Keeper
          </h1>
          
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Keeping track of buffs is hard. Cooking shouldn't be!
        </p>
      </header>

      <nav className="px-4 sm:px-8 mb-6 flex justify-center">
        <div className="inline-flex panel p-1">
          <button
            onClick={() => setMode("buffs")}
            className={`px-4 py-2 text-sm rounded transition-all ${
              mode === "buffs"
                ? "bg-primary text-primary-foreground text-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Find by Buff
          </button>
          <button
            onClick={() => setMode("combine")}
            className={`px-4 py-2 text-sm rounded transition-all ${
              mode === "combine"
                ? "bg-primary text-primary-foreground text-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Combine Ingredients
          </button>
        </div>
      </nav>

      <main className="px-4 sm:px-8 pb-16 max-w-7xl mx-auto">
        {mode === "buffs" ? <BuffFinder /> : <Combiner />}
      </main>

      <footer className="text-center text-xs text-muted-foreground pb-6 px-4">
        Data sourced from{" "}
        <a
          href="https://corekeeper.atma.gg/en/Cooking"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          corekeeper.atma.gg
        </a>{" "}
        · Fan-made tool, not affiliated with Pugstorm.
      </footer>
    </div>
  );
}
