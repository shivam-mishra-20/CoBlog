import { db } from "../db";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
