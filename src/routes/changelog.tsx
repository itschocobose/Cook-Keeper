import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CHANGELOG } from "@/lib/changelog";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — Cook Keeper" },
      { name: "description", content: "Recent updates, new features, and fixes for Cook Keeper." },
      { property: "og:title", content: "Changelog — Cook Keeper" },
      { property: "og:description", content: "Recent updates, new features, and fixes for Cook Keeper." },
    ],
    links: [
      { rel: "canonical", href: "https://cookkeeper.lovable.app/changelog" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Cook Keeper Changelog",
          url: "https://cookkeeper.lovable.app/changelog",
          description: "Recent updates, new features, and fixes for Cook Keeper.",
        }),
      },
    ],
  }),
  component: ChangelogPage,
});

function ChangelogPage() {
  return (
    <div className="relative z-10 min-h-screen">
      <header className="px-4 sm:px-8 pt-10 pb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-3">
          <ChefHat className="w-8 h-8 text-primary text-glow" />
          <h1 className="text-2xl sm:text-3xl text-primary text-glow">Cook Keeper Changelog</h1>
        </Link>
      </header>

      <main className="px-4 sm:px-8 pb-16 max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to app
        </Link>
        <h2 className="text-xl font-semibold mb-6">Changelog</h2>
        <ol className="space-y-6">
          {CHANGELOG.map((e) => (
            <li key={e.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-medium">{e.title}</h3>
                {e.tag && (
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {e.tag}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{e.date}</p>
              <p className="text-sm">{e.body}</p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
