"use client";

import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect, useRef } from "react";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutItem } from "../components/checkout-items";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CheckoutViewProps {
  tenantSlug: string;
};

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const handledSuccess = useRef(false);
  const { data, error, isLoading, refetch } = useQuery(
    trpc.checkout.getProducts.queryOptions(
      { ids: productIds, tenantSlug },
      { enabled: productIds.length > 0 },
    ),
  );

    const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if(error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }

        toast.error(error.message);
      },
    }));

    useEffect(() => {
      if (states.success && !handledSuccess.current) {
        handledSuccess.current = true;
        clearCart();
        void setStates({ success: false, cancel: false });
        void queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
        router.replace("/library");
      }
    }, [
      states.success,
       clearCart,
        router,
        queryClient,
        trpc.library.getMany,
        setStates
      ]);

    useEffect(() => {
      if(error?.data?.code === "NOT_FOUND") {
        clearCart();
        toast.warning("Invalid products found, cart cleared");
      }
    }, [error,clearCart]);

    if (productIds.length === 0) {
      return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
          <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
            <InboxIcon />
            <p className="text-base font-medium">Your cart is empty</p>
            <Link
              href={generateTenantURL(tenantSlug)}
              className="font-medium underline underline-offset-4"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
          <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
      );
    };

    if (error && error.data?.code !== "NOT_FOUND") {
      return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
          <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
            <p className="text-base font-medium">We couldn’t load your cart.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="font-medium underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    if (data?.totalDocs === 0) {
      return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  };

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">

        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem 
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url ?? undefined}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)} 
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <CheckoutSidebar 
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantId: tenantSlug, productIds})}
            isCanceled={states.cancel}
            disabled={purchase.isPending || !data?.docs.length}
          />
        </div>

      </div>
    </div>
  );
};