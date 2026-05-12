import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CHANGELOG, LATEST_ENTRY_ID } from "@/lib/changelog";

const STORAGE_KEY = "cookkeeper:lastSeenChangelogId";

export function WhatsNew() {
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLastSeen(localStorage.getItem(STORAGE_KEY));
    setHydrated(true);
  }, []);

  const hasUnseen = hydrated && lastSeen !== LATEST_ENTRY_ID;

  const markSeen = (open: boolean) => {
    if (open && LATEST_ENTRY_ID) {
      localStorage.setItem(STORAGE_KEY, LATEST_ENTRY_ID);
      setLastSeen(LATEST_ENTRY_ID);
    }
  };

  const recent = CHANGELOG.slice(0, 3);

  return (
    <Popover onOpenChange={markSeen}>
      <PopoverTrigger
        aria-label="What's new"
        className="relative inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Bell className="h-4 w-4" />
        {hasUnseen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">What's New</h3>
          <p className="text-xs text-muted-foreground">Recent updates and fixes</p>
        </div>
        <ul className="max-h-80 divide-y overflow-y-auto">
          {recent.map((e) => (
            <li key={e.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{e.title}</span>
                {e.tag && (
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {e.tag}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{e.body}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{e.date}</p>
            </li>
          ))}
        </ul>
        <div className="border-t px-4 py-2 text-right">
          <Link to="/changelog" className="text-xs text-accent hover:underline">
            View all updates →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
