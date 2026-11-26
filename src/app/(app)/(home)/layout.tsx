import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { Navbar } from "@/modules/home/ui/components/navbar";
import { Footer } from "@/modules/home/ui/components/footer";
import { SearchFilters, SearchFiltersLoading } from "@/modules/home/ui/components/search-filters";
import { Suspense } from "react";

interface Props{
  children: React.ReactNode;
};

const Layout =  async ({ children }: Props) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions(),
  );

  return (
    <div className="flex min-h-dvh flex-col">
    <Navbar />
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SearchFiltersLoading />}>
        <SearchFilters /> 
      </Suspense>
    </HydrationBoundary>
        <main className="flex-1 bg-[#F4F4F0] pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
          {children}
        </main>
          <Footer />
      </div>
  );
}

export default Layout;