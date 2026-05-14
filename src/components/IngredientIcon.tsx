import { useState } from "react";
import type { Ingredient } from "@/lib/cooking";
import { cn } from "@/lib/utils";

export function IngredientIcon({
  ing,
  size = 36,
  className,
}: {
  ing: Ingredient;
  size?: number;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-secondary/60 border border-border shrink-0",
        className
      )}
      style={{ width: size, height: size }}
      title={ing.name}
    >
      {err ? (
        <span className="text-[10px] text-muted-foreground">?</span>
      ) : (
        <img
          src={ing.img}
          alt={`Ingredient: ${ing.name}`}
          width={size - 8}
          height={size - 8}
          className="pixelated"
          onError={() => setErr(true)}
          loading="lazy"
        />
      )}
    </span>
  );
}
