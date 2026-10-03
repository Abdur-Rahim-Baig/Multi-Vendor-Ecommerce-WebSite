import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

type CategoryWithRelations = Category & {
  slug: string;
};

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {

  const data = await ctx.db.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name"
  });

  const formattedData = data.docs.map((doc) => {
    const category = doc as CategoryWithRelations;

    return {
      ...category,
      subcategories: (category.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
        subcategories: undefined,
      })),
    };
  });

    return formattedData;
  }),
});