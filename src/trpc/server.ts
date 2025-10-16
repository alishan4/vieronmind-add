import { cache } from "react";
import { appRouter } from "~/server/api/root";
import { createTRPCContext, createCallerFactory } from "~/server/api/trpc";

// Build the server-side tRPC caller
const createCaller = createCallerFactory(appRouter);

export const serverClient = cache(async () => {
  const ctx = await createTRPCContext({ headers: new Headers() });
  return createCaller(ctx);
});
