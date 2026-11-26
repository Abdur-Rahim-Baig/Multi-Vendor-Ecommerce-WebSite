"use client"

import Link from "next/link";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Poppins } from 'next/font/google';
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import NavbarSidebar from "./navbar-sidebar";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      render={<Link href={href}>{children}</Link>}
      nativeButton={false}
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-2 xl:px-3.5 text-base xl:text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    />
  );
};

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" }
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="sticky top-0 z-50 h-20 border-b bg-white font-medium">
      <NavbarSidebar 
      items={navbarItems}
        isLoggedIn={Boolean(session.data?.user)}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between gap-4 px-4 xl:py-0 xl:pl-8 xl:pr-0">
        <Link href="/" className="flex shrink-0 items-center">
          <span className={cn("text-4xl font-semibold xl:text-5xl", poppins.className)}>
            Funrow
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex">
          {navbarItems.map((item) => (
            <NavbarItem
              key={item.href}
              href={item.href}
              isActive={pathname === item.href}
            >
              {item.children}
            </NavbarItem>
          ))}
        </div>

        {session.data?.user ? (
          <div className="hidden h-full shrink-0 items-stretch xl:flex">
            <Button
          render={<Link href="/admin">Dashboard</Link>}
          nativeButton={false}
          className="h-full rounded-none border-0 bg-black px-5 text-lg text-white transition-colors hover:bg-pink-300 hover:text-black xl:px-8"
        >Dashboard</Button>
          </div>
        ): (

      <div className="hidden h-full shrink-0 items-stretch xl:flex">
        <Button
          render={<Link prefetch href="/sign-in">LogIn</Link>}
          nativeButton={false}
          variant="secondary"
          className="h-full rounded-none border-y-0 border-l border-r border-black bg-white px-5 text-lg transition-colors hover:bg-blue-300 xl:px-8"
        >LogIn</Button>
        <Button
          render={<Link prefetch href="/sign-up">Start Selling</Link>}
          nativeButton={false}
          className="h-full rounded-none border-0 bg-black px-5 text-lg text-white transition-colors hover:bg-pink-300 hover:text-black xl:px-8"
        >Start Selling</Button>
      </div>
      )}

        <div className="flex items-center justify-center xl:hidden">
        <Button
        variant="ghost"
        className="size-12 border-transparent bg-white"
        onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
        </div>
      </div>

    </nav>
  );
};