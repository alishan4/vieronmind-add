import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { Role } from "@prisma/client"; // ✅ now works

// simple placeholder analyzer
const analyzeEmotionMock = async (answers: string[], mode: "mcq" | "image") => {
  const conditions = ["anxiety", "burnout", "depression", "stress"] as const;
  const severities = ["low", "moderate", "high"] as const;
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  return { condition, severity };
};

export const emotionRouter = createTRPCRouter({
  analyze: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        answers: z.array(z.string()).min(1),
        mode: z.enum(["mcq", "image"]),
      })
    )
    .mutation(async ({ input }) => {
      const res = await analyzeEmotionMock(input.answers, input.mode);

      // Update existing user or create a new one
      await db.user
        .update({
          where: { id: input.userId },
          data: {
            condition: res.condition,
            severity: res.severity,
          },
        })
        .catch(async () => {
          await db.user.create({
            data: {
              id: input.userId,
              name: "Guest",
              role: Role.CLIENT, // ✅ enum works now
              condition: res.condition,
              severity: res.severity,
            },
          });
        });

      // Create a session log
      await db.session.create({
        data: {
          userId: input.userId,
          condition: res.condition,
          summary: `Auto triage (${input.mode}) → ${res.condition}/${res.severity}`,
          notes: input.answers,
        },
      });

      return res;
    }),
});
