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
    links: [
      { rel: "canonical", href: "https://cookkeeper.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Cook Keeper",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Web",
          url: "https://cookkeeper.lovable.app/",
          description:
            "Find Core Keeper cooking pot recipes by buff and preview combined dishes.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
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
        <div className="inline-flex items-center gap-4 mb-4">
          <ChefHat className="w-10 h-10 text-primary text-glow" />
          <h1 className="text-3xl sm:text-4xl text-primary text-glow">
            Cook Keeper
          </h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A Core Keeper Tool
        </p>
      </header>

      <main className="px-4 sm:px-8 pb-16 max-w-7xl mx-auto space-y-10">
        <BuffFinder />
        <Combiner />
      </main>

      <footer className="text-center text-xs text-muted-foreground pb-6 px-4 whitespace-pre-wrap">
        Data sourced from{" "}
        <a
          href="https://corekeeper.atma.gg/en/Cooking"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          corekeeper.atma.gg
        </a>{" "}
        and loads of trial and erorr{"\n\n"}
        Fan-made tool, not affiliated with Pugstorm.{"\n"}
      </footer>
    </div>
  );
}
