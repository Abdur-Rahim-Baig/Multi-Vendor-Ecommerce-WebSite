import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{productid: string; slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { productid, slug } = await params;
  
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug       
    }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productid} tenantSlug={slug} />
    </HydrationBoundary>
  );
};

export default Page;