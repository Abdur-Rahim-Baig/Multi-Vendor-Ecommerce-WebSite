import z from "zod";

import { headers as getHeaders } from "next/headers";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { generateAuthCookie } from "../utils";
import { loginSchema, registerSchema } from "../schemas";
import { createConnectedAccount } from "@/lib/stripe";


export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    // Use the "db" context to call the auth method
    const session =await  ctx.db.auth({ headers });
    return session;
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

    let account;

    try {
      account = await createConnectedAccount({
        displayName: input.username,
        email: input.email,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to create Stripe account",
        cause: error,
      });
    }

    if (!account) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create Stripe account",
      });
    }

    const tenant = await ctx.db.create({
      collection: "tenants",
      data: {
        name: input.username,
        slug: input.username,
        stripeAccountId: account.id
      }
    })

    await ctx.db.create({
      collection: "users",
      data: {
        email: input.email,
        username: input.username,
        password: input.password, // This will be hashed
        tenants: [
          {
            tenant: tenant.id,
          },
        ],
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
      });
    }

    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    });

    return data;
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

    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    });

    return data;
  }),
});