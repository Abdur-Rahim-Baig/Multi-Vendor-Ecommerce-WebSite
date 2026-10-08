"use client";

import { Button } from "@/components/ui/button";
import { useProductFilters } from "../../hooks/use-product-filters";
import { cn } from "@/lib/utils";

export const ProductSort = () => {
  const [ filters, setFilters ] = useProductFilters();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className={cn(
          "rounded-full border-transparent bg-white hover:bg-white",
          filters.sort === "curated" && "border-black",
          filters.sort !== "curated" && "bg-transparent border-transparent hover:border-black hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => setFilters({ sort: "curated" })}
      >
        Curated
      </Button>

      <Button
        size="sm"
        className={cn(
          "rounded-full border-transparent bg-white hover:bg-white",
          filters.sort === "trending" && "border-black",
          filters.sort !== "trending" && "bg-transparent border-transparent hover:border-black hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => setFilters({ sort: "trending" })}
      >
        Trending
      </Button>

      <Button
        size="sm"
        className={cn(
          "rounded-full border-transparent bg-white hover:bg-white",
          filters.sort === "new_and_hot" && "border-black",
          filters.sort !== "new_and_hot" && "bg-transparent border-transparent hover:border-black hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => setFilters({ sort: "new_and_hot" })}
      >
        New & Hot
      </Button>
    </div>
  );
}