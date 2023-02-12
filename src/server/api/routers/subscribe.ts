import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const subscribeRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.subscriber.create({
        data: {
          email: input.email,
        },
      });
    }),
});
