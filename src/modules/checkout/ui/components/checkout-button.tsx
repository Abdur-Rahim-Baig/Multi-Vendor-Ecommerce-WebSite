import { Button } from "@/components/ui/button";
import { cn, generateTenantURL } from "@/lib/utils";
import NextLink from "next/link";

import { useCart } from "../../hooks/use-cart";
import { ShoppingCartIcon } from "lucide-react";

interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
};

export const CheckoutButton = ({ className, hideIfEmpty, tenantSlug }: CheckoutButtonProps) => {
  const { totalItems } = useCart(tenantSlug);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <NextLink
      href={`${generateTenantURL(tenantSlug)}/checkout`}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-black bg-white px-2.5 text-base font-medium transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        className,
      )}
    >
      <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ""}
    </NextLink>
    
  );
};