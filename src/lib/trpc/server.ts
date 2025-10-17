import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { appRouter } from "@/server/trpc/routers";
import { createTRPCContext } from "@/server/trpc/context";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = await headers();
  return createTRPCContext({
    headers: heads,
  });
});

export const api = async () => appRouter.createCaller(await createContext());
