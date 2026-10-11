import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/search-param";

interface Props{
  params: Promise<{
    subcategory: string;
  }>
  searchParams: Promise<SearchParams>;
};

const page = async ({ params, searchParams }: Props) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category: subcategory,
    ...filters,
  }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  )
};

export default page;