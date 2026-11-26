import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ProductList, ProductListSkeleton } from "../components/products-list";
import { Suspense } from "react";

export const LibraryView = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50">
        <nav className="p-4 bg-[#F4F4F0] w-full border-b">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeftIcon className="size-4"/>
            <span className="text font-medium">Continue Shopping</span>
          </Link>
        </nav>
        <header className="bg-[#F4F4F0] py-8 border-b">
          <div className="max-w-[--breakpoint-xl] mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
            <h1 className="text-[40px] font-medium">Library</h1>
            <p className="font-medium">
              Your Purchases and Reviews
            </p>
          </div>
        </header>
      </div>
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList /> 
        </Suspense>
      </section>
    </div>
  )
};;