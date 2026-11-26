import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  isLoggedIn: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NavbarSidebar({ items, isLoggedIn, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
            <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">         
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                {item.children}
              </Link>
            ))}
            <div className="border-t">
              {isLoggedIn ? (
                <Link
                  onClick={() => onOpenChange(false)}
                  href="/admin"
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    onClick={() => onOpenChange(false)}
                    href="/sign-in"
                    className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    onClick={() => onOpenChange(false)}
                    href="/sign-up"
                    className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                  >
                    Start Selling
                  </Link>
                </>
              )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}