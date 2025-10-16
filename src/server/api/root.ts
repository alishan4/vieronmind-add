import { createTRPCRouter } from "~/server/api/trpc";
import { emotionRouter } from "./routers/emotion";
import { sessionRouter } from "./routers/session";

export const appRouter = createTRPCRouter({
  emotion: emotionRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
