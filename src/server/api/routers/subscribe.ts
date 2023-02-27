import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const subscribeRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.subscriber.create({
          data: {
            email: input.email,
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new TRPCError({
              message: 'That email already exists',
              code: 'BAD_REQUEST',
              cause: err,
            });
          }
        }

        throw new TRPCError({
          message: 'Something went wrong',
          code: 'INTERNAL_SERVER_ERROR',
          cause: err,
        });
      }
    }),
  unsubscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const subscriber = await ctx.prisma.subscriber.findUnique({
        where: {
          email: input.email,
        },
        select: {
          unsubscribeToken: true,
        },
      });

      if (subscriber === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'A subscriber with that email wasn\'t found',
        });
      }

      if (input.token !== subscriber.unsubscribeToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The token was invalid',
        });
      }

      await ctx.prisma.subscriber.delete({
        where: {
          email: input.email,
        },
      });
    }),
});
