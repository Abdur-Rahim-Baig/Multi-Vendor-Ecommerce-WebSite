import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { 
  ProductList, 
  ProductListSkeleton,
} from "@/modules/products/ui/components/products-list";
import { Suspense } from "react";

interface Props{
  params: Promise<{
    category: string;
  }>
};

const page = async ({params}: Props) => {
  const { category } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category,
  }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrationBoundary>
  )
};

export default page;