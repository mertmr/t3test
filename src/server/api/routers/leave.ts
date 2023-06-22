import { number, z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import type { Leave, Prisma } from "@prisma/client";

export const leaveRouter = createTRPCRouter({

  getAllLeaves: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.leave.findMany();
  }),


  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(280),
        startDate: z.date(),
        endDate: z.date(),
        reason: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.leave.create({
        data: {
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          reason: input.reason,
        },
      });

      return post;
    }),

    deleteLeave: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.leave.delete({
        where: {
          id: input.id,
        }
      });
    }),
    
});
