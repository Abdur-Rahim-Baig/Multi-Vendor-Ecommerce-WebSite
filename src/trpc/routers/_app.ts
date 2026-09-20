import { z } from 'zod';
import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/procedures';
 
export const appRouter = createTRPCRouter({
  categories: categoriesRouter
});
 
// export type definition of API
export type AppRouter = typeof appRouter;