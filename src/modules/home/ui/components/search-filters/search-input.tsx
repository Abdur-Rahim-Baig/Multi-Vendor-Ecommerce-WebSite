"use client";

import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";

import { CategoriesSidebar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface props {
  disabled?: boolean;
};

export const SearchInput = ({ 
  disabled ,
}: props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();

  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input className="pl-8" placeholder="Search Product" disabled={disabled}/>
      </div>
      <Button
      variant="elevated"
      className="size-12 shrink-0 flex lg:hidden"
      onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {session.data?.user && (
        <Link
        href="/library"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md border border-black bg-white px-4 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-pink-400"
        >
          <BookmarkCheckIcon />
            Library
        </Link>
      )}
    </div>
  );
};