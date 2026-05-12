import { createFileRoute } from "@tanstack/react-router";
import { BuffFinder } from "@/components/BuffFinder";
import { Combiner } from "@/components/Combiner";
import { WhatsNew } from "@/components/WhatsNew";
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

function Index() {
  return (
    <div className="relative z-10 min-h-screen">
      <header className="relative px-4 sm:px-8 pt-10 pb-6 text-center">
        <div className="absolute right-4 sm:right-8 top-10">
          <WhatsNew />
        </div>
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

      <main className="px-4 sm:px-8 pb-16 max-w-7xl mx-auto space-y-10">
        <BuffFinder />
        <Combiner />
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
