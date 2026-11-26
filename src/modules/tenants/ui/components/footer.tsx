import Link from "next/link";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export const Footer = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t bg-white font-medium">
      <div className="max-w-(--breakpoint-xl) mx-auto flex gap-2 items-center h-full px-4 py-6 lg:px-12">
        <p>Powered by</p>
        <Link href="/">
          <span className={cn("text-xl font-semibold", poppins.className)}>
            funrow
          </span>
        </Link>
      </div>
    </footer>
  );
};