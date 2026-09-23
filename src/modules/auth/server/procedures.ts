import z from "zod";

import { headers as getHeaders, cookies as getcookies} from "next/headers";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";


export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    // Use the 'db' context to call the auth method
    const session =await  ctx.db.auth({ headers });
    return session;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getcookies();
    cookies.delete(AUTH_COOKIE);
  }),
  register: baseProcedure
  .input(registerSchema)
  .mutation(async ({input, ctx }) => {
    const existingData = await ctx.db.find({
      collection: "users",
      limit: 1,
      where: {
        username: {
          equals: input.username,
        },
      },
    });

    const existingUser = existingData.docs[0];

    if (existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Username already taken",
      });
    }

    await ctx.db.create({
      collection: "users",
      data: {
        email: input.email,
        username: input.username,
        password: input.password, // This will be hashed
      },
    });

    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to Login",
      })
    }

    const cookies = await getcookies();
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path:"/",
      // sameSite: "none",
      // Domain: ""
    });
  }),
  login: baseProcedure
  .input(loginSchema)
  .mutation(async ({input, ctx }) => {
    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to Login",
      })
    }

    const cookies = await getcookies();
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path:"/",
      // sameSite: "none",
      // Domain: ""
    });

    return data;
  }),
});