"use client";

import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CartButton } from "../components/cart-button";
import { toast } from "sonner";

// The dynamic version is kept here for reference, but it disables the button
// during page reloads while the client bundle is loading.
// const CartButton = dynamic(
//   () => import("../components/cart-button").then(
//     (mod) => mod.CartButton
//   ), {
//     ssr: false,
//     loading: () => <Button disabled className="flex-1 bg-pink-400">Add to Cart</Button>
//   },
// );

interface Props {
  productId: string;
  tenantSlug: string;
};

export const ProductView = ({ productId, tenantSlug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({ id: productId }));

  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image 
            src={data.image?.url || "/placeholder.png"}
            alt={data.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 border bg-pink-400 w-fit">
                  <p className="tetx-base font-medium">{formatCurrency(data.price)}</p>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link href={generateTenantURL(tenantSlug)} className="flex items-center gap-2">
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-5" />
                  )}
                  <p className="text-base underline font-medium"> 
                    {data.tenant.name}
                  </p>
                </Link>
              </div>

              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                  <div className="flex items-center gap-2">
                    <StarRating 
                      rating={data.reviewRating}
                      iconClassName="size-4"
                    />
                    <p className="text-base font-medium">
                    {data.reviewCount} ratings
                    </p>
                  </div>
              </div>
            </div>

            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                <StarRating 
                  rating={data.reviewRating}
                  iconClassName="size-4"
                />
                <p className="text-base font-medium">
                  {data.reviewCount} ratings
                </p>
              </div>
            </div>

            <div className="p-6">
              {data.description ? (
                <RichText data={data.description}/>
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description available for this product.
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                    <CartButton 
                    isPurchased={data.isPurchased}
                      productId={productId}
                      tenantSlug={tenantSlug}
                    />
                  <Button
                    className="size-12"
                    variant="elevated"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("URL copied to clipboard!");
                      setIsCopied(true);

                      setTimeout(() => {
                        setIsCopied(false);
                      }, 1000);
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? <CheckIcon /> : <LinkIcon />}
                  </Button>
                </div>

                <p className="text-center font-medium">
                  {data.refundPolicy === "No-Refund"
                    ? "No refunds available for this product." 
                    : `${data.refundPolicy} money back guarantee for this product.`
                  }
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-1 font-medium">
                    <StarIcon className="size-4 fill-black"/>
                    <p>({data.reviewRating})</p>
                    <p className="text-base">{data.reviewCount} ratings</p>
                  </div>
                </div>
                <div
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 mt-4"
                >
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">{stars} {stars === 1 ? "star" : "stars"}</div>
                      <Progress 
                      value={data.ratingDistribution[stars] || 0} 
                      className="h-6"
                      />
                      <div className="font-medium">
                        {data.ratingDistribution[stars] || 0}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image 
            src={"/placeholder.png"}
            alt="Placeholder"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};