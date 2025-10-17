import { z } from "zod";
import { $Enums } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

// Extract Prisma enums safely
const { Condition, Severity } = $Enums;

// --------------------------
// Utility functions
// --------------------------

// Converts human answers into numeric values
const freqScore = (v: string) => {
  const s = v.toLowerCase();
  if (["never", "no", "none"].includes(s)) return 0;
  if (["rarely", "sometimes", "some"].includes(s)) return 1;
  if (["often", "frequent"].includes(s)) return 2;
  return 3; // always / strong
};

// Classifies the mood based on total score
function classify(score: number) {
  // 3 questions, each 0–3 → total 0–9
  if (score <= 1) return { condition: Condition.CALM, severity: Severity.LOW };
  if (score <= 3) return { condition: Condition.STRESS, severity: Severity.LOW };
  if (score <= 5) return { condition: Condition.ANXIETY, severity: Severity.MODERATE };
  if (score <= 7) return { condition: Condition.BURNOUT, severity: Severity.MODERATE };
  if (score <= 9) return { condition: Condition.DEPRESSION, severity: Severity.HIGH };
  return { condition: Condition.STRESS, severity: Severity.MODERATE };
}

// --------------------------
// Router Definition
// --------------------------

export const emotionRouter = createTRPCRouter({
  // 📥 Submit emotional check-in
  submitCheckIn: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        qAnxiety: z.string().min(1),
        qFatigue: z.string().min(1),
        qLowMood: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const s1 = freqScore(input.qAnxiety ?? "");
      const s2 = freqScore(input.qFatigue ?? "");
      const s3 = freqScore(input.qLowMood ?? "");
      const score = s1 + s2 + s3;

      const { condition, severity } = classify(score);

      // ✅ Ensure user exists (auto-create demo/guest if missing)
      await db.user.upsert({
        where: { id: input.userId },
        update: { condition, severity },
        create: {
          id: input.userId,
          name: "Guest User",
          role: "CLIENT",
          condition,
          severity,
        },
      });

      // ✅ Create check-in record
      const checkin = await db.checkIn.create({
        data: {
          userId: input.userId,
          answers: {
            anxiety: input.qAnxiety,
            fatigue: input.qFatigue,
            lowMood: input.qLowMood,
            scoreBreakdown: { s1, s2, s3 },
          },
          score,
          condition,
          severity,
        },
      });

      return {
        message: "Check-in recorded successfully",
        condition,
        severity,
        score,
        id: checkin.id,
      };
    }),

  // 📤 Get latest check-in
  latest: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      const latest = await db.checkIn.findFirst({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          score: true,
          condition: true,
          severity: true,
        },
      });
      return latest ?? null;
    }),

  // 📚 Get full history
  history: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ input }) => {
      const items = await db.checkIn.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
      return items;
    }),
});
