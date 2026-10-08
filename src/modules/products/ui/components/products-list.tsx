"use client";

import { useTRPC } from "@/trpc/client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/use-product-filters";

interface Props {
  category?: string;
};

export const ProductList = ({ category }: Props) => {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({ 
    category, 
    ...filters,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map((product) => (
        <div key={product.id} className="border rounded-md bg-white">
          <h2 className="text-xl font-medium p-4">{product.name}</h2>
          <h2>${product.price}</h2>
        </div>
      ))}
    </div>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div>
      Loading...
    </div>
  );
};