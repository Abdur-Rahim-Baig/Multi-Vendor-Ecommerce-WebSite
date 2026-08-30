import { Category } from "@/payload-types";

export type CustomCategory = Category & {
  slug: string;
  color?: string;
  subcategories?: Category[];
};