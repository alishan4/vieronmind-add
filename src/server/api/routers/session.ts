import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const sessionRouter = createTRPCRouter({
  listByUser: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(({ input }) =>
      db.session.findMany({
        where: { userId: input.userId },
        orderBy: [{ createdAt: "desc" }], // ✅ works now
        take: 25,
      })
    ),

  addNote: publicProcedure
    .input(
      z.object({
        sessionId: z.string().min(1),
        note: z.string().min(1),
      })
    )
    .mutation(({ input }) =>
      db.session.update({
        where: { id: input.sessionId },
        data: {
          notes: { push: input.note }, // ✅ works now because notes[] exists
        },
      })
    ),
});
