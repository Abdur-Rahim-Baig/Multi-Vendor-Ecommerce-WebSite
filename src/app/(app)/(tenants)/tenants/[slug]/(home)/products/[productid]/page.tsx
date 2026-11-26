import { ProductView, ProductViewSkeleton } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{productid: string; slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { productid, slug } = await params;
  
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
      trpc.products.getOne.queryOptions({ id: productid }),
    );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productid} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;